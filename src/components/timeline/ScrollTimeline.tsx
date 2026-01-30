'use client'

import {
  type ReactNode,
  useRef,
  useMemo,
  createContext,
  useContext,
  useSyncExternalStore,
} from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react'
import Image from 'next/image'

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────────── */

export type TimelineItem = {
  id: string
  title: string
  description: string
  meta?: string
  media?: ReactNode
  mediaSrc?: string
}

export type ScrollTimelineProps = {
  items: TimelineItem[]
  sectionVh?: number
  stickyTop?: number
  layout?: 'twoCol' | 'oneCol'
  railAlign?: 'center' | 'left'
  leftRailOffsetPx?: number
  className?: string
}

/* ─────────────────────────────────────────────────────────────────────────────
   SSR-SAFE HOOKS
   ───────────────────────────────────────────────────────────────────────────── */

function getServerSnapshot(): boolean {
  return false
}

function subscribeToMediaQuery(query: string) {
  return (callback: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mql = window.matchMedia(query)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }
}

function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(() => subscribeToMediaQuery(query), [query])
  const getSnapshot = useMemo(() => {
    return () => {
      if (typeof window === 'undefined') return false
      return window.matchMedia(query).matches
    }
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

/* ─────────────────────────────────────────────────────────────────────────────
   SEGMENT CALCULATION
   ───────────────────────────────────────────────────────────────────────────── */

type SegmentRanges = {
  start: number
  inEnd: number
  outStart: number
  end: number
}

function segmentRanges(index: number, count: number): SegmentRanges {
  const stepSize = 1 / count
  const start = index * stepSize
  const end = start + stepSize
  const inEnd = start + stepSize * 0.3
  const outStart = start + stepSize * 0.75

  return { start, inEnd, outStart, end }
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP MOTION HOOK
   ───────────────────────────────────────────────────────────────────────────── */

type StepMotionValues = {
  opacity: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
  active: MotionValue<number>
}

function useStepMotion(
  scrollYProgress: MotionValue<number>,
  index: number,
  count: number,
  reducedMotion: boolean | null
): StepMotionValues {
  const { start, inEnd, outStart, end } = segmentRanges(index, count)

  const opacity = useTransform(scrollYProgress, [start, inEnd, outStart, end], [0, 1, 1, 0])

  const y = useTransform(scrollYProgress, [start, inEnd], reducedMotion ? [0, 0] : [32, 0])

  const scale = useTransform(scrollYProgress, [start, inEnd], reducedMotion ? [1, 1] : [0.985, 1])

  const active = useTransform(scrollYProgress, [start, inEnd, outStart, end], [0, 1, 1, 0])

  return { opacity, y, scale, active }
}

/* ─────────────────────────────────────────────────────────────────────────────
   MEDIA MOTION HOOK
   ───────────────────────────────────────────────────────────────────────────── */

type MediaMotionValues = {
  opacity: MotionValue<number>
  scale: MotionValue<number>
  y: MotionValue<number>
}

function useMediaMotion(
  scrollYProgress: MotionValue<number>,
  index: number,
  count: number,
  reducedMotion: boolean | null
): MediaMotionValues {
  const { start, inEnd, outStart, end } = segmentRanges(index, count)

  const opacity = useTransform(scrollYProgress, [start, inEnd, outStart, end], [0, 1, 1, 0])

  const scale = useTransform(scrollYProgress, [start, inEnd], reducedMotion ? [1, 1] : [0.95, 1])

  // Subtle float effect using local progress within the segment
  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1])
  const y = useTransform(localProgress, (p) => {
    if (reducedMotion) return 0
    return Math.sin(p * Math.PI) * -6
  })

  return { opacity, scale, y }
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTEXT FOR SCROLL PROGRESS
   ───────────────────────────────────────────────────────────────────────────── */

type TimelineContextValue = {
  scrollYProgress: MotionValue<number>
  itemCount: number
  reducedMotion: boolean | null
}

const TimelineContext = createContext<TimelineContextValue | null>(null)

function useTimelineContext(): TimelineContextValue {
  const ctx = useContext(TimelineContext)
  if (!ctx) {
    throw new Error('Timeline components must be used within ScrollTimeline')
  }
  return ctx
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP CARD COMPONENT (DESKTOP)
   ───────────────────────────────────────────────────────────────────────────── */

type StepCardProps = {
  item: TimelineItem
  index: number
}

function StepCard({ item, index }: StepCardProps) {
  const { scrollYProgress, itemCount, reducedMotion } = useTimelineContext()
  const { opacity, y, scale } = useStepMotion(scrollYProgress, index, itemCount, reducedMotion)

  return (
    <motion.article
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity,
        y,
        scale,
        pointerEvents: 'none',
      }}
      aria-hidden={false}
    >
      {item.meta && <span className="text-sm font-medium text-primary mb-2">{item.meta}</span>}
      <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">{item.title}</h3>
      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md">
        {item.description}
      </p>
    </motion.article>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MEDIA PANEL COMPONENT (DESKTOP)
   ───────────────────────────────────────────────────────────────────────────── */

type MediaPanelProps = {
  item: TimelineItem
  index: number
}

function MediaPanel({ item, index }: MediaPanelProps) {
  const { scrollYProgress, itemCount, reducedMotion } = useTimelineContext()
  const { opacity, scale, y } = useMediaMotion(scrollYProgress, index, itemCount, reducedMotion)

  const hasMedia = item.media || item.mediaSrc

  if (!hasMedia) return null

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        scale,
        y,
        pointerEvents: 'none',
      }}
    >
      {item.media ? (
        item.media
      ) : item.mediaSrc ? (
        <div className="relative w-full aspect-video">
          <Image
            src={item.mediaSrc}
            alt={item.title}
            fill
            className="object-cover rounded-2xl shadow-2xl"
          />
        </div>
      ) : null}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MARKER DOT COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────────
   FULL-HEIGHT RAIL COMPONENT (spans entire section)
   ───────────────────────────────────────────────────────────────────────────── */

type FullRailProps = {
  items: TimelineItem[]
  railPosition: 'center' | 'left'
  leftOffset: number
}

function FullRail({ items, railPosition, leftOffset }: FullRailProps) {
  // Calculate rail position based on layout
  const railLeft = railPosition === 'center' ? '50%' : `${leftOffset}px`

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none z-10"
      style={{ left: railLeft, transform: railPosition === 'center' ? 'translateX(-50%)' : 'none' }}
    >
      {/* Marker dots positioned along the full rail */}
      {items.map((item, index) => (
        <FullRailMarker key={item.id} index={index} totalSteps={items.length} year={item.meta} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   STICKY PROGRESS INDICATOR (stays in viewport while in section)
   ───────────────────────────────────────────────────────────────────────────── */

type StickyProgressIndicatorProps = {
  railPosition: 'center' | 'left'
  leftOffset: number
}

function StickyProgressIndicator({ railPosition, leftOffset }: StickyProgressIndicatorProps) {
  const { scrollYProgress } = useTimelineContext()

  const indicatorLeft = railPosition === 'center' ? '50%' : `${leftOffset}px`
  const indicatorTransform = railPosition === 'center' ? 'translateX(-50%)' : 'none'

  // Add padding so the indicator stays visible (15% from top, 85% from top)
  const logoTop = useTransform(scrollYProgress, [0, 1], ['15%', '85%'])
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '70%'])

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-20 overflow-visible">
      <div
        className="sticky top-0 h-screen overflow-visible"
        style={{ marginLeft: indicatorLeft, transform: indicatorTransform, width: 0 }}
      >
        {/* Background rail line - stays in viewport with padding */}
        <div
          className="absolute w-0.5 bg-border -translate-x-1/2 rounded-full"
          style={{ top: '15%', bottom: '15%' }}
        />

        {/* Animated fill line - starts at 15% from top */}
        <motion.div
          className="absolute w-1 rounded-full -translate-x-1/2"
          style={{ top: '15%', height: fillHeight, backgroundColor: '#759845' }}
        />

        {/* Current position indicator logo */}
        <motion.div
          className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
          style={{ backgroundColor: '#f5f5f4', top: logoTop }}
        >
          <Image src="/logo-notext.svg" alt="Progress indicator" fill className="object-contain" />
        </motion.div>
      </div>
    </div>
  )
}

type FullRailMarkerProps = {
  index: number
  totalSteps: number
  year?: string
}

function FullRailMarker({ index, totalSteps, year }: FullRailMarkerProps) {
  const { scrollYProgress, itemCount, reducedMotion } = useTimelineContext()
  const { active } = useStepMotion(scrollYProgress, index, itemCount, reducedMotion)

  const bgOpacity = useTransform(active, [0, 1], [0, 0.4])
  const labelOpacity = useTransform(active, [0, 1], [0.4, 1])

  // Position marker at its segment center along the full rail
  const stepSize = 1 / totalSteps
  const topPercent = (index * stepSize + stepSize * 0.5) * 100

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
      style={{ top: `${topPercent}%`, y: '-50%' }}
    >
      {/* Year label (left of dot) */}
      {year && (
        <motion.span
          className="text-xs font-extrabold text-[#672542] whitespace-nowrap -translate-x-full pr-3"
          style={{ opacity: labelOpacity }}
        >
          {year}
        </motion.span>
      )}

      {/* Glow ring */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#672542]"
        style={{ opacity: bgOpacity }}
      />

      {/* Dot */}
      {/* <motion.div
        className="relative w-4 h-4 rounded-full bg-primary shadow-lg"
        style={{ scale: dotScale, opacity: dotOpacity }}
      /> */}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE STEP CARD COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

type MobileStepCardProps = {
  item: TimelineItem
  index: number
  reducedMotion: boolean | null
}

function MobileStepCard({ item, index, reducedMotion }: MobileStepCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-12 border-b border-border last:border-b-0"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        {item.meta && (
          <span className="text-sm font-medium text-muted-foreground">{item.meta}</span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-3 text-foreground">{item.title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed mb-6">{item.description}</p>

      {/* Media */}
      {(item.media || item.mediaSrc) && (
        <div className="mt-6">
          {item.media ? (
            item.media
          ) : item.mediaSrc ? (
            <div className="relative w-full aspect-video">
              <Image
                src={item.mediaSrc}
                alt={item.title}
                fill
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          ) : null}
        </div>
      )}
    </motion.article>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE TIMELINE COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

type MobileTimelineProps = {
  items: TimelineItem[]
  reducedMotion: boolean | null
  className?: string
}

function MobileTimeline({ items, reducedMotion, className }: MobileTimelineProps) {
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {items.map((item, index) => (
          <MobileStepCard key={item.id} item={item} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   DESKTOP TIMELINE COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

type DesktopTimelineProps = {
  items: TimelineItem[]
  sectionVh: number
  stickyTop: number
  layout: 'twoCol' | 'oneCol'
  railAlign: 'center' | 'left'
  leftRailOffsetPx: number
  reducedMotion: boolean | null
  className?: string
}

function DesktopTimeline({
  items,
  sectionVh,
  stickyTop,
  layout,
  railAlign,
  leftRailOffsetPx,
  reducedMotion,
  className,
}: DesktopTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const sectionHeight = items.length * sectionVh

  const contextValue: TimelineContextValue = {
    scrollYProgress,
    itemCount: items.length,
    reducedMotion,
  }

  const isTwoCol = layout === 'twoCol'
  const hasAnyMedia = items.some((item) => item.media || item.mediaSrc)

  return (
    <TimelineContext.Provider value={contextValue}>
      <section
        ref={sectionRef}
        className={className}
        style={{
          backgroundColor: '#f5f5f4',
          height: `${sectionHeight}vh`,
          position: 'relative',
        }}
      >
        {/* Sticky progress indicator (stays in viewport while in section) */}
        <StickyProgressIndicator railPosition={railAlign} leftOffset={leftRailOffsetPx} />

        {/* Full-height rail with markers (spans entire section) */}
        <FullRail items={items} railPosition={railAlign} leftOffset={leftRailOffsetPx} />

        {/* Sticky container for content */}
        <div
          style={{
            backgroundColor: '#f5f5f4',
            position: 'sticky',
            top: stickyTop,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Content container */}
          <div
            style={{
              width: '100%',
              maxWidth: 1200,
              height: '100%',
              padding: '0 24px',
              display: 'grid',
              gridTemplateColumns:
                isTwoCol && hasAnyMedia
                  ? railAlign === 'center'
                    ? '1fr 80px 1fr'
                    : `${leftRailOffsetPx}px 1fr`
                  : railAlign === 'center'
                    ? '1fr 80px 1fr'
                    : `${leftRailOffsetPx}px 1fr`,
              alignItems: 'center',
              gap: 24,
              position: 'relative',
            }}
          >
            {/* Text column */}
            <div
              style={{
                position: 'relative',
                height: '60%',
                gridColumn: railAlign === 'left' ? 2 : 1,
              }}
            >
              {items.map((item, index) => (
                <StepCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {/* Spacer for rail (rail is now absolute positioned) */}
            <div
              style={{
                gridColumn: railAlign === 'left' ? 1 : 2,
                gridRow: 1,
              }}
            />

            {/* Media column (only in twoCol layout) */}
            {isTwoCol && hasAnyMedia && (
              <div
                style={{
                  position: 'relative',
                  height: '70%',
                  gridColumn: 3,
                }}
              >
                {items.map((item, index) => (
                  <MediaPanel key={item.id} item={item} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </TimelineContext.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */

export function ScrollTimeline({
  items,
  sectionVh = 100,
  stickyTop = 0,
  layout = 'twoCol',
  railAlign = 'center',
  leftRailOffsetPx = 24,
  className = '',
}: ScrollTimelineProps) {
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()

  if (items.length === 0) {
    return null
  }

  if (isMobile) {
    return <MobileTimeline items={items} reducedMotion={reducedMotion} className={className} />
  }

  return (
    <DesktopTimeline
      items={items}
      sectionVh={sectionVh}
      stickyTop={stickyTop}
      layout={layout}
      railAlign={railAlign}
      leftRailOffsetPx={leftRailOffsetPx}
      reducedMotion={reducedMotion}
      className={className}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXAMPLE USAGE
   ─────────────────────────────────────────────────────────────────────────────

import { ScrollTimeline, type TimelineItem } from '@/components/timeline/ScrollTimeline'

const items: TimelineItem[] = [
  {
    id: 'discover',
    title: 'Discover',
    description: 'We begin by understanding your business, target audience, and competitive landscape through comprehensive research.',
    meta: 'Step 01',
    mediaSrc: 'https://placehold.co/600x400/6366f1/ffffff?text=Discover',
  },
  {
    id: 'define',
    title: 'Define',
    description: 'Based on our findings, we define clear objectives, user personas, and project requirements.',
    meta: 'Step 02',
    mediaSrc: 'https://placehold.co/600x400/ec4899/ffffff?text=Define',
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Our design team creates wireframes, prototypes, and high-fidelity mockups that bring your vision to life.',
    meta: 'Step 03',
    mediaSrc: 'https://placehold.co/600x400/f97316/ffffff?text=Design',
  },
  {
    id: 'develop',
    title: 'Develop',
    description: 'We transform designs into functional products using modern technologies and best practices.',
    meta: 'Step 04',
    mediaSrc: 'https://placehold.co/600x400/22c55e/ffffff?text=Develop',
  },
  {
    id: 'deliver',
    title: 'Deliver',
    description: 'We deploy your product, provide training, and offer ongoing support to ensure long-term success.',
    meta: 'Step 05',
    mediaSrc: 'https://placehold.co/600x400/06b6d4/ffffff?text=Deliver',
  },
]

export default function Page() {
  return (
    <main>
      <section className="h-screen flex items-center justify-center">
        <h1>Scroll Down</h1>
      </section>

      <ScrollTimeline
        items={items}
        sectionVh={100}
        layout="twoCol"
        railAlign="center"
      />

      <section className="h-screen flex items-center justify-center">
        <h2>The End</h2>
      </section>
    </main>
  )
}

   ───────────────────────────────────────────────────────────────────────────── */

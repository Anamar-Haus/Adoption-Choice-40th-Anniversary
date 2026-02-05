'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInTextProps {
    children: React.ReactNode
    className?: string
}

export function FadeInText({ children, className = '' }: FadeInTextProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return

            const rect = ref.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            // Calculate progress based on element position
            // Element starts animating when it enters bottom 30% of viewport
            // Animation completes when element reaches center of viewport
            const startPoint = windowHeight * 0.85
            const endPoint = windowHeight * 0.4

            if (rect.top >= startPoint) {
                setProgress(0)
            } else if (rect.top <= endPoint) {
                setProgress(1)
            } else {
                const rawProgress = (startPoint - rect.top) / (startPoint - endPoint)
                setProgress(Math.min(1, Math.max(0, rawProgress)))
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial check

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Calculate animation values based on progress
    const translateY = 150 * (1 - progress) // 50px to 0px
    const rotateX = -50 * (1 - progress) // 15deg to 0deg
    const opacity = progress

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: `perspective(1000px) translateY(${translateY}px) rotateX(${rotateX}deg)`,
                opacity,
                transformOrigin: 'center top',
                willChange: 'transform, opacity',
            }}
        >
            {children}
        </div>
    )
}

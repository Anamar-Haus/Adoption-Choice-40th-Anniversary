'use client'

import { useEffect, useRef, useState } from 'react'

interface SimpleFadeInProps {
    children: React.ReactNode
    className?: string
}

export function SimpleFadeIn({ children, className = '' }: SimpleFadeInProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return

            const rect = ref.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            const startPoint = windowHeight * 0.75
            const endPoint = windowHeight * 0.6

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
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: progress,
                willChange: 'opacity',
            }}
        >
            {children}
        </div>
    )
}

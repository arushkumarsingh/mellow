"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CarouselProps {
  images: string[]
  className?: string
  imageClassName?: string
}

export function Carousel({ images, className, imageClassName }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null)
  const [isSwiping, setIsSwiping] = React.useState(false)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    setTouchEnd(null)
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setIsSwiping(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    
    const touch = e.targetTouches[0]
    const deltaX = Math.abs(touch.clientX - touchStart.x)
    const deltaY = Math.abs(touch.clientY - touchStart.y)
    
    // Track movement but don't prevent default - let browser handle scrolling
    // Only mark as swiping if horizontal movement is significantly greater
    if (deltaX > deltaY * 1.5 && deltaX > 15) {
      setIsSwiping(true)
      setTouchEnd({ x: touch.clientX, y: touch.clientY })
    } else if (deltaY > deltaX * 1.5) {
      // Vertical scrolling detected - clear touch state to allow page scroll
      setTouchStart(null)
      setTouchEnd(null)
      setIsSwiping(false)
    } else {
      // Track position for potential swipe
      setTouchEnd({ x: touch.clientX, y: touch.clientY })
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isSwiping) {
      setTouchStart(null)
      setTouchEnd(null)
      setIsSwiping(false)
      return
    }

    const distance = touchStart.x - touchEnd.x
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
    
    setTouchStart(null)
    setTouchEnd(null)
    setIsSwiping(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (images.length === 0) return null

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden select-none", className)}
      style={{ touchAction: 'pan-y pinch-zoom', maxWidth: '100%' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-in-out h-full w-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          maxWidth: '100%'
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full flex-shrink-0 relative w-full"
            style={{ maxWidth: '100%' }}
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className={cn("w-full h-full object-cover select-none", imageClassName)}
              style={{ maxWidth: '100%', width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}


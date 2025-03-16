"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react"

interface Review {
  id: number
  name: string
  image: string
  rating: number
  comment: string
  date: string
}

interface RoomReviewsProps {
  reviews: Review[]
}

export function RoomReviews({ reviews }: RoomReviewsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} />
      ))
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <MessageSquare className="h-5 w-5 text-brand-gold mr-2" />
        Opiniones de jugadores
      </h3>

      <div className="relative bg-brand-dark/60 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-6 horror-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border border-brand-gold/30">
                <Image
                  src={reviews[activeIndex].image || "/placeholder.svg"}
                  alt={reviews[activeIndex].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold">{reviews[activeIndex].name}</h4>
                <div className="flex items-center">
                  <div className="flex mr-2">{renderStars(reviews[activeIndex].rating)}</div>
                  <span className="text-xs text-gray-400">{reviews[activeIndex].date}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 italic">"{reviews[activeIndex].comment}"</p>
          </motion.div>
        </AnimatePresence>

        {reviews.length > 1 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={prevReview}
              className="bg-brand-dark/60 border border-brand-gold/30 rounded-full p-2 text-brand-gold hover:bg-brand-gold/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex space-x-1">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeIndex === index ? "bg-brand-gold" : "bg-gray-600"}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="bg-brand-dark/60 border border-brand-gold/30 rounded-full p-2 text-brand-gold hover:bg-brand-gold/20 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


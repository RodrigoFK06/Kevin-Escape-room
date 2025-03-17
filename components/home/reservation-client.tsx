"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Loading component
function ReservationLoading() {
  return (
    <div className="py-16 md:py-24 bg-brand-dark relative w-full my-12">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a141f] border border-brand-gold/20 rounded-lg p-4 md:p-8">
            <Skeleton className="h-8 w-full max-w-md mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dynamically import the ReservationSystem component with ssr: false
const ReservationSystem = dynamic(() => import("./reservation-system"), {
  ssr: false,
  loading: () => <ReservationLoading />,
})

export function ReservationClient() {
  return (
    <Suspense fallback={<ReservationLoading />}>
      <ReservationSystem />
    </Suspense>
  )
}


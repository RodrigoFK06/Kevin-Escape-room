import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "icon"
  className?: string
  textClassName?: string
  iconClassName?: string
}

export function Logo({ variant = "full", className, textClassName, iconClassName }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      {variant === "icon" ? (
        <div className={cn("relative w-10 h-10", iconClassName)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand-gold"
            >
              <path d="M35 50C35 41.716 41.716 35 50 35H85V65H50C41.716 65 35 58.284 35 50Z" fill="currentColor" />
              <circle cx="25" cy="50" r="15" stroke="currentColor" strokeWidth="10" />
              <rect x="55" y="42" width="10" height="16" fill="#0e1a28" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className={cn("text-brand-gold font-display font-bold text-3xl tracking-wider", textClassName)}>
            <span className="relative">
              EN
              <span className="relative">
                C
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0e1a28]"></span>
              </span>
              RYPTE
              <span className="relative">
                D<span className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-4 bg-[#0e1a28]"></span>
              </span>
            </span>
          </div>
          <div className="text-white font-sans text-xs tracking-[0.2em] mt-1">
            <span className="mx-4 relative">
              <span className="absolute left-0 top-1/2 w-3 h-px bg-brand-gold transform -translate-y-1/2"></span>
              ESCAPE ROOM
              <span className="absolute right-0 top-1/2 w-3 h-px bg-brand-gold transform -translate-y-1/2"></span>
            </span>
          </div>
        </div>
      )}
    </Link>
  )
}


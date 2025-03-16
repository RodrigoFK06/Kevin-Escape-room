import type React from "react"
interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  withGradient?: boolean
}

export function SectionWrapper({ children, className = "", id, withGradient = true }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden py-16 md:py-24 ${withGradient ? "section-gradient" : ""} ${className}`}
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-5"></div>
      <div className="content-container">{children}</div>
    </section>
  )
}


import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./fonts.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Encrypted - Escape Room",
  description: "Descifra los enigmas. Encuentra las llaves. Escapa antes de que sea tarde.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.png", // ← Aquí definimos el favicon correctamente
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark scroll-smooth" suppressHydrationWarning>
      <head />
      <body className="font-sans bg-[#0e1a28] text-white min-h-screen overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="relative z-0">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

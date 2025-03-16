import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./fonts.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Encrypted - Escape Room",
  description: "Descifra los enigmas. Encuentra las llaves. Escapa antes de que sea tarde.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <style>
          {`
            .rdp {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #e29c3c;
              --rdp-background-color: rgba(226, 156, 60, 0.2);
              --rdp-accent-color-dark: #e29c3c;
              --rdp-background-color-dark: #0a141f;
              --rdp-outline: 2px solid var(--rdp-accent-color);
              --rdp-outline-selected: 2px solid var(--rdp-accent-color);
              color: white;
            }
            .rdp-day_selected, 
            .rdp-day_selected:focus-visible, 
            .rdp-day_selected:hover {
              background-color: #e29c3c !important;
              color: #0a141f !important;
            }
            .rdp-button {
              color: white !important;
            }
            .rdp-head_cell {
              color: #e29c3c !important;
            }
          `}
        </style>
      </head>
      <body className="font-sans bg-[#0e1a28] text-white min-h-screen overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="relative z-0">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VBCI Notes",
  description: "Weekly sermon notes from Victory Bible Church International",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <div className="mx-auto max-w-5xl px-6">
          {children}
        </div>
      </body>
    </html>
  )
}

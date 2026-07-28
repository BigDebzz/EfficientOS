import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EfficientOS — Your AI Operations Team',
  description: 'Monitor and manage your personal AI agents from anywhere.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f0f1a] text-[#e8e8f0] min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

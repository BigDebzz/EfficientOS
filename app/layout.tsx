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
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

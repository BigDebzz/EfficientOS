import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EfficientOS — Your AI Operations Team',
  description: 'Monitor and manage your personal AI agents from anywhere.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f0f1a] text-[#e8e8f0] min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

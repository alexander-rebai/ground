import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Ground',
  description: 'Track habits, energy and thoughts. One stream, every day.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-bg text-text">
      <body className={`${dmSans.className} min-h-dvh overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}

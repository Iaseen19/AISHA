import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RootProvider } from './providers/root-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AISHA - AI Supported Health Assistant',
  description: 'Your personal AI health assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}


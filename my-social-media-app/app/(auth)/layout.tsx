import type { Metadata } from 'next'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Threads',
  description: 'A Next.js 14 Meta Threads Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
        <html lang="en">
          <body className="bg-dark-1">
            <div className="w-full flex justify-center items-center min-h=screen">
              {children}
            </div>
          </body>
        </html>
    </ClerkProvider>
  )
}

import type { Metadata } from 'next'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import BottomBar from '@/components/shared/BottomBar'
import Navbar from '@/components/shared/Navbar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import RightSideBar from '@/components/shared/RightSideBar'

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
        <body>
          <Navbar />
          <main className="flex flex-row">
            <LeftSideBar />
            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>
            <RightSideBar />
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  )
}

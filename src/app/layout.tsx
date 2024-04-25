import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import { Toaster } from 'sonner'

import Providers from '@/components/Providers'
import NavBar from '@/components/Navbar'

import { cn } from '@/lib/utils'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digitalhippo',
  description: 'Your marketplace for high-quality digital assets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='h-full'>
      <body
        className={cn('relative h-full font-sans antialiased', inter.className)}
      >
        <main className='relative flex min-h-screen flex-col'>
          <Providers>
            <NavBar />

            <div className='flex-1 flex-grow'>{children}</div>
          </Providers>
        </main>

        <Toaster position='top-center' richColors />
      </body>
    </html>
  )
}

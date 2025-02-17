

import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/myUi/myLandingPage/myNavbar.tsx/Navbar'
import { Toaster } from "@/components/ui/sonner"



const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Watchparty',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className='w-full h-full'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased vsc-initialized p-0 m-0 bg-black w-full h-full`}>
          <header>
            <Navbar />
          </header>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
// pages/_app.js or your equivalent root layout file
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Providers from '@/components/Client/Providers'
import { Toaster } from 'react-hot-toast'
import ClientThemeProvider from '@/components/Client/ClientThemeProvider'
import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'
import { ThemeProvider } from '@/components/Client/theme-provider'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AiPDFly'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <Providers>
        <ClientThemeProvider>
          <html lang='en' suppressHydrationWarning>
            <body
              className={cn(
                'min-h-screen bg-background font-sans antialiased',
                fontSans.variable
              )}
            >
              <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
              >
                {children} <Toaster />
              </ThemeProvider>
            </body>
          </html>
        </ClientThemeProvider>
      </Providers>
    </ClerkProvider>
  )
}

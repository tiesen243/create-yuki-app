import '@/app/globals.css'

import { ThemeProvider } from 'next-themes'

import { geistSans } from '@/lib/fonts'
import { seo } from '@/lib/seo'
import { TRPCReactProvider } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={cn('font-sans antialiased', geistSans.variable)}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout

export const metadata = seo({})

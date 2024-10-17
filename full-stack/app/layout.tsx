import '@/app/globals.css'

import { ThemeProvider } from 'next-themes'

import { SessionProvider } from '@/hooks/use-session'
import { geistSans } from '@/lib/fonts'
import { seo } from '@/lib/seo'
import { TRPCReactProvider } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'
import { auth } from '@/server/auth'

const RootLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-dvh font-sans', geistSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <SessionProvider session={session}>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout

export const metadata = seo({})

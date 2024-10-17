import '@/app/globals.css'

import { ThemeProvider } from 'next-themes'

import { geistSans } from '@/lib/fonts'
import { seo } from '@/lib/seo'
import { cn } from '@/lib/utils'

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={cn('min-h-dvh font-sans', geistSans.variable)}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </body>
  </html>
)

export default RootLayout

export const metadata = seo({})

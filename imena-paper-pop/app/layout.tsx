import './globals.css'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  title: "Imena Paper Pop",
  description: "Generate beautiful Imena invitations",
  icons: {
    icon: "/IMENA.png",
  },
}


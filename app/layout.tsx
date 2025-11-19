'use client'

import { OptionsProvider } from '@/hooks/useOptions'
import { Monda } from "next/font/google"
import "./globals.css"
import { setup } from '@/db/db'

const monda = Monda({
  variable: "--font-monda",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  setup()

  return (
    <OptionsProvider>
      <html lang="en">
        <body
          className={`${monda.variable} antialiased gradient-primary`}
        >
          {children}
          <div data-ht-role="modals" />
        </body>
      </html>
    </OptionsProvider>
  )
}

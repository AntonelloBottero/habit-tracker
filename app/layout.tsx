import { InfrastructureProvider } from "@/src/shared/infrastructure/InfrastructureContext"
import { Monda } from "next/font/google"
import "./globals.css"

const monda = Monda({
  variable: "--font-monda",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${monda.variable} antialiased gradient-primary`}
      >
        <InfrastructureProvider>
          {children}
        </InfrastructureProvider>
        <div data-ht-role="modals" />
      </body>
    </html>
  )
}

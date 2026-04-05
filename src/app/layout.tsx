import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: {
    default: 'Clay & Light',
    template: '%s · Clay & Light',
  },
  description: 'Booking & reservation management for Clay & Light',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        {/* Cookiebot — replace YOUR-CBID with your actual Cookiebot ID */}
        {process.env.NEXT_PUBLIC_COOKIEBOT_ID && (
          <script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_ID}
            data-blockingmode="auto"
            type="text/javascript"
            async
          />
        )}
      </head>
      <body className="bg-cloud text-ink min-h-screen font-body">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-cloud">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

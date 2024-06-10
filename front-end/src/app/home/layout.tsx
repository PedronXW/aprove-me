'use client'

import AuthGuard from '@/guard/AuthGuard'
import Providers from '@/providers/Providers'

export default function InternalApplicationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="max-w-[1200px] h-full m-auto">
      <Providers>
        <AuthGuard>{children}</AuthGuard>
      </Providers>
    </div>
  )
}

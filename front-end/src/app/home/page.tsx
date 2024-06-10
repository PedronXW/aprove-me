'use client'

import Header from '@/components/Header'
import PayablesList from '@/components/PayablesList/PayablesList'

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col justify-center items-center gap-14">
      <Header />
      <PayablesList />
    </main>
  )
}

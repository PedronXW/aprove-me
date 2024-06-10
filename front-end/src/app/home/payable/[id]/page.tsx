'use client'

import Header from '@/components/Header'
import PayableInformation from '@/components/PayableInformation'

export default function PayablePage({ params }: { params: { id: string } }) {
  const id = params.id

  return (
    <main className="flex flex-1 flex-col justify-center items-center gap-14">
      <Header />
      <PayableInformation id={id} />
    </main>
  )
}

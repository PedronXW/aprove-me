'use client'

import Header from '@/components/Header'
import ProfileInformation from '@/components/ProfileInformation'

export default function ProfilePage() {
  return (
    <main className="flex flex-1 flex-col justify-center items-center gap-14">
      <Header />
      <ProfileInformation />
    </main>
  )
}

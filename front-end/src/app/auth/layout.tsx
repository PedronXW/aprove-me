'use client'

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen w-full bg-gray-100 flex flex-1 justify-center items-center">
      {children}
    </div>
  )
}

import AuthGuard from '@/guard/AuthGuard'

export default function LayoutPayable({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <AuthGuard>{children}</AuthGuard>
    </div>
  )
}

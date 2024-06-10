import AuthGuard from '@/guard/AuthGuard'

export default function LayoutProfile({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <AuthGuard>{children}</AuthGuard>
    </div>
  )
}

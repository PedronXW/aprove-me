import AssignorProvider from '@/contexts/AssignorContext'
import PayablesProvider from '@/contexts/PayablesContext'

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log('children', children)

  return (
    <AssignorProvider>
      <PayablesProvider>{children}</PayablesProvider>
    </AssignorProvider>
  )
}

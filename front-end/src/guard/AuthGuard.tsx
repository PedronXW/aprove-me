'use client'

import { AuthenticationVerifier } from './verifyAuthentication'

export default function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const verify = new AuthenticationVerifier()
  if(!verify.verify()) return

  return <>{children}</>
}

'use client'

import { X } from '@phosphor-icons/react/dist/ssr'
import { SnackbarProvider, closeSnackbar } from 'notistack'

export default function NotificationProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={5000}
      action={(snackbarId) => (
        <button onClick={() => closeSnackbar(snackbarId)}>
          <X size={20} />
        </button>
      )}
    >
      {children}
    </SnackbarProvider>
  )
}

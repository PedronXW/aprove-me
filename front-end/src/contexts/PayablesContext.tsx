'use client'

import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { ReactNode, createContext, useState } from 'react'

export type Payable = {
  id: string
  value: number
  emissionDate: string
  active: boolean
  assignorId: string
}

interface PayableContext {
  payables: Payable[]
  page: number
  setPage: (page: number) => void
  fetchPayables: () => void
  payablesCount: number
  addPayable: (payable: Payable) => void
  editPayable: (id: string, payable: Partial<Payable>) => void
  deletePayable: (payableId: string) => void
}

interface PayableContextInterface {
  children: ReactNode
}

export const PayableContext = createContext({} as PayableContext)

export default function PayablesProvider({
  children,
}: PayableContextInterface) {
  const [payables, setPayables] = useState<Payable[]>([])
  const [payablesCount, setPayablesCount] = useState<number>(1)
  const [page, setPage] = useState<number>(1)

  const router = useRouter()

  const addPayable = async (payable: Payable) => {
    setPayables((prev) => [payable, ...prev])
  }

  const editPayable = async (id: string, payable: Partial<Payable>) => {
    setPayables((prev) =>
      prev.map((prevPayable) =>
        prevPayable.id === id ? { ...prevPayable, ...payable } : prevPayable,
      ),
    )
  }

  const deletePayable = async (payableId: string) => {
    setPayables((prev) =>
      prev.filter((prevPayable) => prevPayable.id !== payableId),
    )
  }

  const verify = new AuthenticationVerifier()

  const fetchPayables = async () => {
    if(!verify.verify()) return

    const fetchedPayables = await api.get(
      '/payable?' +
        new URLSearchParams({
          page: page.toString(),
          limit: '10',
        }),
      {
        headers: {
          Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
        },
      },
    )
    if (fetchedPayables.status === 200) {
      setPayables((prev) => prev.concat(fetchedPayables.data.payables))
      setPayablesCount(fetchedPayables.data.payablesCount)
      setPage((prev) => prev + 1)
    } else {
      if (fetchedPayables.status === 401) {
        enqueueSnackbar(
          'Usuário não autorizado. Por favor, faça login novamente.',
          { variant: 'error' },
        )
        return router.push('/auth')
      }
      enqueueSnackbar('Erro ao carregar dados', { variant: 'error' })
    }
  }

  return (
    <PayableContext.Provider
      value={{
        payables,
        page,
        setPage,
        fetchPayables,
        payablesCount,
        addPayable,
        deletePayable,
        editPayable,
      }}
    >
      {children}
    </PayableContext.Provider>
  )
}

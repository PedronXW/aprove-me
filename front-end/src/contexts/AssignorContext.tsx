import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { ReactNode, createContext, useEffect, useState } from 'react'

export type Assignor = {
  id: number
  name: string
  email: string
  document: string
  phone: string
}

interface AssignorContext {
  assignor: Assignor | undefined
  editAssignor: (editedAssignor: Partial<Assignor>) => void
}

interface AssignorContextInterface {
  children: ReactNode
}

export const AssignorContext = createContext({} as AssignorContext)

export default function AssignorProvider({
  children,
}: AssignorContextInterface) {
  const [assignor, setAssignor] = useState<Assignor>()

  const router = useRouter()

  useEffect(() => {
    fetchAssignor()
  }, [])

  const editAssignor = async (editedAssignor: Partial<Assignor>) => {
    setAssignor((assignor) => {
      if (!assignor) return
      return { ...assignor, ...editedAssignor }
    })
  }

  const verify = new AuthenticationVerifier()

  const fetchAssignor = async () => {
    if(!verify.verify()) return

    const fetchedAssignor = await api.get('/assignor', {
      headers: {
        Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
      },
    })
    if (fetchedAssignor.status === 200) {
      setAssignor(fetchedAssignor.data.assignor)
    } else {
      if (fetchedAssignor.status === 401) {
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
    <AssignorContext.Provider value={{ assignor, editAssignor }}>
      {children}
    </AssignorContext.Provider>
  )
}

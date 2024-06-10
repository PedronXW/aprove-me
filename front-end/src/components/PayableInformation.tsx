import { Payable } from '@/contexts/PayablesContext'
import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import PayableInformationHeader from './PayableInformationHeader'

export default function PayableInformation({ id }: { id: string }) {
  const [payable, setPayable] = useState<Payable>()

  const router = useRouter()

  useEffect(() => {
    fetchPayable()
    console.log('fetchPayable')
  }, [])

  const verify = new AuthenticationVerifier()

  const fetchPayable = async () => {
    if (!verify.verify()) return

    const payable = await api.get(`/payable/${id}`, {
      headers: {
        Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
      },
    })

    if (payable.status === 200) {
      setPayable(payable.data.payable)
    } else {
      if (payable.status === 401) {
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
    <main className="flex flex-1 flex-col w-full justify-center items-center">
      <PayableInformationHeader id={id} />
      <div className="flex flex-1 flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Valor</span>
          <span className="text-sm">{payable ? payable!.value : 0}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Data de emissão</span>
          <span className="text-sm">
            {payable ? payable!.emissionDate : ''}
          </span>
        </div>
      </div>
    </main>
  )
}

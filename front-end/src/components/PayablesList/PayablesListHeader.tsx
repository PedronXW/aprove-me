import { PayableContext } from '@/contexts/PayablesContext'
import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useContext, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import AddMultiplePayablesList from '../AddMultiplePayablesList'
import PayableForm from '../PayableForm'
import Popup from '../Popup'

export default function PayablesListHeader() {
  const { addPayable } = useContext(PayableContext)

  const router = useRouter()

  const [addPayableModalStatus, setChangeAddPayableModalStatus] =
    useState(false)

  const [addMultiplePayableModalStatus, setMultipleAddPayableModalStatus] =
    useState(false)

  const handleChangeAddPayablestatus = () => {
    setChangeAddPayableModalStatus(!addPayableModalStatus)
    setMultipleAddPayableModalStatus(false)
  }

  const handleChangeAddMultiplePayablestatus = () => {
    setMultipleAddPayableModalStatus(!addMultiplePayableModalStatus)
    setChangeAddPayableModalStatus(false)
  }

  const verify = new AuthenticationVerifier()

  const handleAddPayable = async (credentials: FieldValues) => {
    if (!verify.verify()) return

    const addResult = await api.post(
      '/payable',
      {
        value: Number.parseFloat(credentials.value),
        emissionDate: new Date(
          credentials.emissionDate + 'T' + credentials.time,
        ),
      },
      {
        headers: {
          Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
        },
      },
    )

    if (addResult.status === 201) {
      addPayable(addResult.data.payable)
      enqueueSnackbar('Recebível adicionado com sucesso', {
        variant: 'success',
      })
    } else {
      if (addResult.status === 401) {
        enqueueSnackbar(
          'Usuário não autorizado. Por favor, faça login novamente.',
          { variant: 'error' },
        )
        return router.push('/auth')
      }
      enqueueSnackbar('Erro ao adicionar dados', { variant: 'error' })
    }
  }

  return (
    <header className="bg-white w-full h-16 flex justify-between items-center px-4 border-b-2 border-gray-200">
      <h1 className="text-2xl font-bold">Meus recebíveis</h1>
      <div className="flex gap-4">
        <div className="flex flex-col items-end">
          <button
            onClick={handleChangeAddPayablestatus}
            className="bg-primary_color text-white px-4 py-2 rounded-md"
          >
            Adicionar recebível
          </button>

          <div className={`${addPayableModalStatus ? 'block' : 'hidden'}`}>
            <Popup>
              <PayableForm
                closeForm={() => {
                  setChangeAddPayableModalStatus(false)
                }}
                confirmAction={handleAddPayable}
              />
            </Popup>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <button
            onClick={handleChangeAddMultiplePayablestatus}
            className="bg-primary_color text-white px-4 py-2 rounded-md"
          >
            Adicionar multiplos recebíveis
          </button>

          <div
            className={`${addMultiplePayableModalStatus ? 'block' : 'hidden'} `}
          >
            <AddMultiplePayablesList
              handleCloseForm={() => {
                setMultipleAddPayableModalStatus(false)
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

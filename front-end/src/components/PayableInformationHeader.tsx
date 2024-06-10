import { PayableContext } from '@/contexts/PayablesContext'
import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useContext, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import PayableForm from './PayableForm'
import Popup from './Popup'

export default function PayableInformationHeader({ id }: { id: string }) {
  const router = useRouter()

  const [updatePayableModalStatus, setUpdatePayableModalStatus] =
    useState(false)

  const handleChangeUpdatePayableStatus = () => {
    setUpdatePayableModalStatus(!updatePayableModalStatus)
  }

  const { editPayable } = useContext(PayableContext)

  const verify = new AuthenticationVerifier()

  const handleUpdate = async (credentials: FieldValues) => {
    if (!verify.verify()) return

    const updateResult = await api.patch(
      `/payable/${id}`,
      {
        value: credentials.value,
        emissionDate: credentials.emissionDate + 'T' + credentials.time,
      },
      {
        headers: {
          Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
        },
      },
    )

    if (updateResult.status === 200) {
      editPayable(id!.toString(), {
        value: credentials.value,
        emissionDate: credentials.emissionDate + 'T' + credentials.time,
      })

      enqueueSnackbar('Recebível alterado com sucesso', { variant: 'success' })
    } else {
      if (updateResult.status === 401) {
        enqueueSnackbar(
          'Usuário não autorizado. Por favor, faça login novamente.',
          { variant: 'error' },
        )
        return router.push('/auth')
      }
      enqueueSnackbar('Erro ao alterar dados', { variant: 'error' })
    }
  }

  return (
    <header className="bg-white w-full h-16 flex justify-between items-center ">
      <h1 className="text-2xl font-bold">Recebível {id}</h1>
      <div className="flex gap-4">
        <div className="flex flex-col items-end">
          <button
            onClick={handleChangeUpdatePayableStatus}
            className="bg-primary_color text-white px-4 py-2 rounded-md"
          >
            Alterar recebível
          </button>

          <div className={`${updatePayableModalStatus ? 'block' : 'hidden'}`}>
            <Popup>
              <PayableForm
                confirmAction={handleUpdate}
                closeForm={handleChangeUpdatePayableStatus}
                title="Alterar Recebível"
                hasX={true}
                id={id}
              />
            </Popup>
          </div>
        </div>
      </div>
    </header>
  )
}

import { Payable, PayableContext } from '@/contexts/PayablesContext'
import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { Pencil } from '@phosphor-icons/react'
import { DotsThree, Trash } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useContext, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import PayableForm from '../PayableForm'
import Popup from '../Popup'

export default function PayableCell({ id, value, emissionDate }: Payable) {
  const [isEditing, setIsEditing] = useState(false)

  const { editPayable, deletePayable } = useContext(PayableContext)

  const router = useRouter()

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const verify = new AuthenticationVerifier()

  const handleDelete = async () => {
    if (!verify.verify()) return

    const deleteResult = await api.delete(`/payable/${id}`, {
      headers: {
        Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
      },
    })

    if (deleteResult.status === 204) {
      deletePayable(id)
      enqueueSnackbar('Recebível deletado com sucesso', { variant: 'success' })
    } else {
      if (deleteResult.status === 401) {
        enqueueSnackbar(
          'Usuário não autorizado. Por favor, faça login novamente.',
          { variant: 'error' },
        )
        return router.push('/auth')
      }
      enqueueSnackbar('Erro ao excluir dados', { variant: 'error' })
    }
  }

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
      enqueueSnackbar('Recebível alterado com sucesso', { variant: 'success' })
      editPayable(id, {
        value: credentials.value,
        emissionDate: credentials.emissionDate + 'T' + credentials.time,
      })
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
    <div key={id} className="bg-white p-4 px-0 border-b-2 border-gray-200">
      <div className="flex justify-between">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-lg font-bold">R$ {value}</h1>
          <p>{emissionDate}</p>
        </div>
        <div className="flex gap-10">
          <button
            onClick={() => {
              router.push(`/home/payable/${id}`)
            }}
            className="p-4 cursor-pointer"
          >
            <DotsThree size={20} />
          </button>
          <div className="flex flex-col items-end">
            <button onClick={handleEdit} className="p-4 cursor-pointer">
              <Pencil size={20} />
            </button>

            <div className={`${isEditing ? 'block' : 'hidden'} `}>
              <Popup>
                <PayableForm
                  title={'Alterar Recebível'}
                  confirmAction={handleUpdate}
                  closeForm={() => {
                    setIsEditing(false)
                  }}
                  hasX={true}
                  id={id}
                />
              </Popup>
            </div>
          </div>

          <button onClick={handleDelete} className="p-4 cursor-pointer">
            <Trash size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

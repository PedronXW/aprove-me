import { Payable } from '@/contexts/PayablesContext'
import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import EmissionDateInput from './EmissionDateInput'
import Popup from './Popup'
import TimeInput from './TimeInput'
import ValueInput from './ValueInput'

type AddMultiplePayablesListProps = {
  handleCloseForm: () => void
}

export default function AddMultiplePayablesList({
  handleCloseForm,
}: AddMultiplePayablesListProps) {
  const [payablesListToAdd, setPayablesListToAdd] = useState<Payable[]>([])

  const router = useRouter()

  const handleAddPayable = (credentials: FieldValues) => {
    const newPayable = {
      id: Math.random().toString(),
      value: credentials.value,
      emissionDate: credentials.emissionDate + 'T' + credentials.time,
      active: true,
      assignorId: '1',
    }
    setPayablesListToAdd([...payablesListToAdd, newPayable])
  }

  const handleRemovePayable = (id: string) => {
    const newList = payablesListToAdd.filter((payable) => payable.id !== id)
    setPayablesListToAdd(newList)
  }

  const createPayableFormSchema = z.object({
    value: z.number().min(1, 'Valor precisa ser maior que 0'),
    emissionDate: z.string().min(1, 'Data de Emissão é obrigatória'),
    time: z.string().min(1, 'Hora é obrigatória'),
  })

  const payableForm = useForm({
    resolver: zodResolver(createPayableFormSchema),
  })

  const verify = new AuthenticationVerifier()

  const handleConfirmAddition = async () => {
    if (!verify.verify()) return

    const confirmAddition = await api.post(
      '/payable/batch',
      { payables: payablesListToAdd },
      {
        headers: {
          Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
        },
      },
    )

    if (confirmAddition.status === 201) {
      enqueueSnackbar('Recebíveis adicionados com sucesso', {
        variant: 'success',
      })
      handleCloseForm()
    } else {
      if (confirmAddition.status === 401) {
        return router.push('/auth')
      }
      enqueueSnackbar('Erro ao adicionar dados', { variant: 'error' })
    }

    setPayablesListToAdd([])
  }

  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = payableForm

  return (
    <Popup>
      <main className="bg-white p-14 rounded-md shadow-md block gap-2 w-3/5 h-2/3 overflow-hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Adicionar Multiplos Recebíveis</h1>
          <X className="cursor-pointer" onClick={handleCloseForm} />
        </div>

        <div className="bg-gray-400 h-[1px] w-full" />

        <div className="flex gap-4 flex-1 h-full overflow-scroll">
          <form
            onSubmit={handleSubmit(handleAddPayable)}
            onChange={() => {
              clearErrors()
            }}
            autoComplete="off"
            className="flex flex-col gap-2 mt-6 w-2/5"
          >
            <FormProvider {...payableForm}>
              <ValueInput errors={errors} />
              <EmissionDateInput errors={errors} />
              <TimeInput errors={errors} />
              <button
                aria-label="Confirmar Payable"
                type="submit"
                className="w-full p-2 cursor-pointer flex items-center bg-primary_color border-primary_color rounded-md text-secundary_color justify-center"
              >
                Confirmar
              </button>
            </FormProvider>
          </form>

          <div className="bg-gray-200 self-center h-2/3 w-[2px]" />

          <div className="w-full overflow-scroll gap-2">
            <button
              onClick={handleConfirmAddition}
              className="bg-primary_color text-white px-4 py-2 rounded-md w-full mt-4"
            >
              Confirmar Multiplos Recebíveis
            </button>

            {payablesListToAdd.length > 0 ? (
              payablesListToAdd.map((payable) => (
                <div
                  key={payable.id}
                  className="flex justify-between items-center border-b-2 border-gray-200 px-4 py-2 w-full"
                >
                  <div className="flex flex-col ">
                    <div className="flex gap-2">
                      <span className="font-bold text-base">Valor:</span>
                      <span>{payable.value}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm">Data de Emissão:</span>
                      <span className="text-sm">{payable.emissionDate}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePayable(payable.id)}
                    className="bg-primary_color text-white px-4 py-2 rounded-md"
                  >
                    <X className="cursor-pointer" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <span>Nenhum recebível adicionado</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </Popup>
  )
}

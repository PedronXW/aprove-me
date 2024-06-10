'use client'

import { PayableContext } from '@/contexts/PayablesContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from '@phosphor-icons/react/dist/ssr'
import { useContext, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import EmissionDateInput from './EmissionDateInput'
import TimeInput from './TimeInput'
import ValueInput from './ValueInput'

type PayableFormProps = {
  closeForm?: () => void
  confirmAction: (credentials: FieldValues) => void
  hasX?: boolean
  value?: number
  emissionDate?: string
  title?: string
  id?: string
}

export default function PayableForm({
  closeForm,
  confirmAction,
  hasX = true,
  title,
  id,
}: PayableFormProps) {
  const createPayableFormSchema = z.object({
    value: z.number().min(1, 'Valor precisa ser maior que 0'),
    emissionDate: z.string().min(1, 'Data de Emissão é obrigatória'),
    time: z.string().min(1, 'Hora é obrigatória'),
  })

  const { payables } = useContext(PayableContext)

  const handleCloseForm = () => {
    if (closeForm) closeForm()
  }

  const payableForm = useForm({
    resolver: zodResolver(createPayableFormSchema),
  })

  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = payableForm

  useEffect(() => {
    const payable = payables.find((payable) => payable.id === id)
    if (!payable) return
    console.log(payable.emissionDate.split('T'))
    setValue('emissionDate', payable.emissionDate.split('T')[0])
    setValue('time', payable.emissionDate.split('T')[1].slice(0, 5))
    setValue('value', payable.value)
  }, [])

  return (
    <main className="bg-white p-14 rounded-md shadow-md flex flex-col gap-2 w-1/3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{title || 'Adicionar Recebível'}</h1>
        {hasX ? (
          <X className="cursor-pointer" onClick={handleCloseForm} />
        ) : (
          <></>
        )}
      </div>

      <div className="bg-gray-400 h-[1px] w-full" />

      <form
        onSubmit={handleSubmit(confirmAction)}
        onChange={() => {
          clearErrors()
        }}
        autoComplete="off"
        className="flex flex-col gap-2 mt-6"
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
    </main>
  )
}

import { AssignorContext } from '@/contexts/AssignorContext'
import { AuthenticationVerifier } from '@/guard/verifyAuthentication'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useContext, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import DocumentInput from './DocumentInput'
import EmailInput from './EmailInput'
import NameInput from './NameInput'
import PhoneInput from './PhoneInput'

type AssignorFormProps = {
  closeForm?: () => void
  hasX?: boolean
}

export default function AssignorForm({
  closeForm,
  hasX = true,
}: AssignorFormProps) {
  const { assignor, editAssignor } = useContext(AssignorContext)

  const router = useRouter()

  const updateAssignorFormSchema = z.object({
    name: z
      .string()
      .min(2, 'O nome precisa ter, no mínimo 2 caracteres')
      .max(140, 'O nome pode ter, no máximo, 140 caracteres'),
    email: z
      .string()
      .email('Formato de e-mail invalido')
      .max(140, 'O email pode ter, no máximo, 140 caracteres'),
    document: z
      .string()
      .min(1, 'O documento é obrigatório')
      .max(30, 'O documento pode ter, no máximo, 30 caracteres'),
    phone: z
      .string()
      .min(1, 'O telefone é obrigatório')
      .max(20, 'O telefone pode ter, no máximo 20 caracteres'),
  })

  const verify = new AuthenticationVerifier()

  const handleChangeAssignor = async (credentials: FieldValues) => {
    if (!verify.verify()) return

    const update = await api.patch(
      '/assignor',
      {
        email: credentials.email,
        name: credentials.name,
        document: credentials.document,
        phone: credentials.phone,
      },
      {
        headers: {
          Authorization: `Bearer ${LocalStorageAuthenticationManager.getAuth()}`,
        },
      },
    )

    if (update.status === 200) {
      editAssignor({
        email: credentials.email,
        name: credentials.name,
        document: credentials.document,
        phone: credentials.phone,
      })
      enqueueSnackbar('Dados alterados com sucesso', { variant: 'success' })
    } else {
      if (update.status === 401) {
        enqueueSnackbar(
          'Usuário não autorizado. Por favor, faça login novamente.',
          { variant: 'error' },
        )
        return router.push('/auth')
      }
      enqueueSnackbar('Erro ao alterar dados', { variant: 'error' })
    }
  }

  const handleCloseForm = () => {
    if (closeForm) closeForm()
  }

  const assignorForm = useForm({
    resolver: zodResolver(updateAssignorFormSchema),
    defaultValues: {
      name: assignor?.name,
      email: assignor?.email,
      document: assignor?.document,
      phone: assignor?.phone,
    },
  })

  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = assignorForm

  useEffect(() => {
    if (!assignor) return
    setValue('email', assignor.email)
    setValue('name', assignor.name)
    setValue('document', assignor.document)
    setValue('phone', assignor.phone)
  }, [])

  return (
    <main className="bg-white p-14 rounded-md shadow-md flex flex-col gap-2 w-1/3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold"> Alterar dados pessoais</h1>
        {hasX ? (
          <X className="cursor-pointer" onClick={handleCloseForm} />
        ) : (
          <></>
        )}
      </div>

      <div className="bg-gray-400 h-[1px] w-full" />

      <form
        onSubmit={handleSubmit(handleChangeAssignor)}
        onChange={() => {
          clearErrors()
        }}
        autoComplete="off"
        className="flex flex-col gap-2 mt-6"
      >
        <FormProvider {...assignorForm}>
          <NameInput errors={errors} />
          <EmailInput errors={errors} />
          <DocumentInput errors={errors} />
          <PhoneInput errors={errors} />
          <button
            aria-label="Confirmar Alteração"
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

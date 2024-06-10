'use client'

import Logo from '@/assets/logo-bankme.png'
import DocumentInput from '@/components/DocumentInput'
import EmailInput from '@/components/EmailInput'
import NameInput from '@/components/NameInput'
import PasswordInput from '@/components/PasswordInput'
import PhoneInput from '@/components/PhoneInput'
import { api } from '@/lib/axios'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

export default function Register() {
  const router = useRouter()

  const createPersonFormSchema = z.object({
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
    password: z
      .string()
      .min(1, 'A senha é obrigatória')
      .min(8, 'A senha precisa ter, no mínimo 8 caracteres'),
  })

  const handleRegister = async (credentials: FieldValues) => {
    const create = await api.post('/assignor', {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      document: credentials.document,
      phone: credentials.phone,
    })

    if (create.status === 201) {
      enqueueSnackbar('Usuário criado com sucesso', { variant: 'success' })
      const auth = await api.post('/session', {
        email: credentials.email,
        password: credentials.password,
      })
      if (auth.status === 201) {
        LocalStorageAuthenticationManager.setAuth(auth.data.token)
        return router.push('/home')
      }
      enqueueSnackbar('Erro ao realizar login', { variant: 'error' })
    } else {
      enqueueSnackbar('Erro ao criar usuário', { variant: 'error' })
    }
  }

  const registerForm = useForm({
    resolver: zodResolver(createPersonFormSchema),
  })

  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = registerForm

  return (
    <div className="h-screen w-full bg-white flex flex-1 justify-center items-center">
      <div className="p-12 py-12 shadow-xl bg-white justify-center flex-col flex gap-5">
        <figure className="flex items-end">
          <Image src={Logo} alt="Logo" width={50} height={50} />
          <figcaption className="text-xl font-bold text-blue-700">
            ankMe
          </figcaption>
        </figure>

        <h1 className="text-base">CRIE SUA CONTA</h1>

        <form
          onSubmit={handleSubmit(handleRegister)}
          onChange={() => {
            clearErrors()
          }}
          autoComplete="off"
          className="flex flex-col gap-2"
        >
          <FormProvider {...registerForm}>
            <NameInput errors={errors} />
            <div className="grid grid-cols-2 gap-2 row h-min">
              <EmailInput errors={errors} />
              <PasswordInput errors={errors} />
              <DocumentInput errors={errors} />
              <PhoneInput errors={errors} />
            </div>
            <button
              aria-label="Confirmar Login"
              type="submit"
              className="w-full p-2 cursor-pointer flex items-center bg-primary_color border-primary_color rounded-md text-secundary_color justify-center"
            >
              Login
            </button>
            <Link
              className="h-8 w-auto p-2 flex cursor-pointer text-xs self-center"
              href={'/auth'}
            >
              Já tenho uma conta
            </Link>
          </FormProvider>
        </form>
      </div>
    </div>
  )
}

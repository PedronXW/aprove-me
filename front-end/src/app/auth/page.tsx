'use client'

import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import Logo from '@/assets/logo-bankme.png'
import EmailInput from '@/components/EmailInput'
import PasswordInput from '@/components/PasswordInput'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import Image from 'next/image'
import { enqueueSnackbar } from 'notistack'

export default function Login() {
  const router = useRouter()

  const createPersonFormSchema = z.object({
    email: z
      .string()
      .nonempty('O email é obrigatório')
      .email('Formato de e-mail invalido'),
    password: z
      .string()
      .nonempty('A senha é obrigatório')
      .min(6, 'A senha precisa ter, no mínimo 6 caracteres'),
  })

  const handleLogin = async (credentials: FieldValues) => {
    const auth = await api.post('/session', {
      email: credentials.email,
      password: credentials.password,
    })

    if (auth.status === 201) {
      LocalStorageAuthenticationManager.setAuth(auth.data.token)
      enqueueSnackbar('Login realizado com sucesso', { variant: 'success' })
      return router.push('/home')
    }

    if (auth.status === 401) {
      enqueueSnackbar('Usuário ou senha inválidos', { variant: 'error' })
    }

    enqueueSnackbar('Erro ao realizar login', { variant: 'error' })
  }

  const loginForm = useForm({ resolver: zodResolver(createPersonFormSchema) })

  const {
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
  } = loginForm

  return (
    <main className="p-12 py-16 shadow-xl bg-white justify-center flex-col flex gap-10">
      <figure className="flex items-end">
        <Image src={Logo} alt="Logo" width={50} height={50} />
        <figcaption className="text-xl font-bold text-blue-700">
          ankMe
        </figcaption>
      </figure>

      <h1 className="text-base">FAÇA SEU LOGIN</h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        onChange={() => {
          clearErrors()
        }}
        autoComplete="off"
        className="flex flex-col gap-2"
      >
        <FormProvider {...loginForm}>
          <EmailInput errors={errors} />
          <PasswordInput errors={errors} control={control} />
          <button
            aria-label="Confirmar Login"
            type="submit"
            className="w-full p-2 cursor-pointer flex items-center bg-primary_color border-primary_color rounded-md text-secundary_color justify-center"
          >
            Login
          </button>
          <Link
            className="h-8 w-auto p-2 flex cursor-pointer text-xs self-center"
            href={'/auth/register'}
          >
            Ainda não tem uma conta? Cadastre-se
          </Link>
        </FormProvider>
      </form>
    </main>
  )
}

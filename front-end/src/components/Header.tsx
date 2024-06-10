import Logo from '@/assets/logo-bankme.png'
import { AssignorContext } from '@/contexts/AssignorContext'
import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { SignOut, User } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

export default function Header() {
  const { assignor } = useContext(AssignorContext)

  const router = useRouter()

  const handleLogout = () => {
    LocalStorageAuthenticationManager.removeAuth()
    router.push('/auth')
  }

  const handleAcessProfile = () => {
    router.push('/home/profile')
  }

  return (
    <header className="bg-white w-full h-16 flex justify-between items-center px-4">
      <div className="h-full items-center flex gap-4">
        <Image src={Logo} alt="Logo" width={35} height={35} />
        <div className="flex-col flex">
          <strong>Olá, {assignor?.name}</strong>
          <span>Bem vindo ao seu gestor de recebíveis</span>
        </div>
      </div>
      <nav className="flex gap-6 items-center">
        <button
          type="button"
          onClick={() => {
            handleAcessProfile()
          }}
        >
          <User size={24} />
        </button>
        <button
          type="button"
          onClick={() => {
            handleLogout()
          }}
        >
          <SignOut size={24} />
        </button>
      </nav>
    </header>
  )
}

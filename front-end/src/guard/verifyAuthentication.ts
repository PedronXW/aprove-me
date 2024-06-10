import { LocalStorageAuthenticationManager } from '@/utils/LocalStorageAuthenticationManager'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'

export class AuthenticationVerifier {
  router = useRouter()

  verify = (): boolean => {
    if (window !== undefined) {
      const token = LocalStorageAuthenticationManager.getAuth()

      if (!token) {
        enqueueSnackbar(
          'Usuário não autorizado. Por favor, faça login novamente.',
          { variant: 'error' },
        )
        this.router.push('/auth')
        return false
      }

      const decodedToken = jwtDecode(token)
      if (decodedToken.exp! * 1000 < Date.now()) {
        enqueueSnackbar('Sessão expirada. Por favor, faça login novamente.', {
          variant: 'error',
        })
        this.router.push('/auth')
        return false
      }
    }
    return true
  }
}

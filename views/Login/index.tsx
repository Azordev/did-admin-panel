import { useLazyQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import useLogger from '@/hooks/useLogger'
import { USER_SESSION } from '@/services/GraphQL/users/queries'
import { LoginInput } from '@/services/GraphQL/users/types'

import LoginLayout from './Layout'

const Login: NextPage = () => {
  const [checkUserSession, { loading }] = useLazyQuery(USER_SESSION)
  const { log, warn, error, toast } = useLogger()
  const router = useRouter()

  const onSubmit = async (formData: LoginInput) => {
    const { called, error: queryError, data } = await checkUserSession({ variables: formData })
    toast.dismiss()
    if (called) {
      if (queryError) {
        error(queryError, 'Login:onSubmit', 'Error al verificar sesión...', 'SERVER_CONNECTION')
      } else {
        // DB have a condition to check "code_member" is unique, so this state should be impossible, left just in case.
        if (data?.users?.length === 0) {
          warn(
            'Login:onSubmit',
            'No se encontró ningún usuario en base de datos con esas credenciales, Usuario o contraseña incorrectos...',
            'INPUT',
          )
        } else {
          if (data.users[0]?.length > 1) {
            error(
              Error('Se encontraron más de un usuario en base de datos'),
              'Login:onSubmit',
              'Se encontraron varios usuarios en base de datos con estas credenciales. Informe al servicio técnico del incidente...',
              'UNEXPECTED',
            )
            setTimeout(() => router.reload(), 1000)
            return
          }

          const userIsValid: boolean =
            data.users[0]?.isActive &&
            (data.users[0]?.type === 'PROVIDER' ||
              data.users[0]?.type === 'ADMIN' ||
              data.users[0]?.type === 'TEST_ADMIN')

          if (userIsValid) {
            const user = data.users[0]

            log('Login:useEffect', 'Usuario encontrado en base de datos, procediendo a verificar sesión...', 'SUCCESS')
            window.sessionStorage.setItem('userId', user.id)
            window.sessionStorage.setItem('user', JSON.stringify(user))

            if (user?.type === 'PROVIDER') {
              window.sessionStorage.setItem('providerId', user?.providerInfo?.id)
            }
            setTimeout(() => router.push('/'), 200)
          } else {
            warn('Login:onSubmit', 'Usuario no activo o no valido, contactar con el administrador...', 'AUTHORIZATION')
          }
        }
      }
    } else {
      warn('Login:onSubmit', 'No se pudo verificar sesión', 'AVAILABILITY')
    }
  }

  return <LoginLayout onSubmit={onSubmit} loading={loading} />
}

export default Login

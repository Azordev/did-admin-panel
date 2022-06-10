import { useLayoutEffect as useEffect } from 'react'
import { NextPage } from 'next'
import { useLazyQuery } from '@apollo/client'
import { GET_USER_SESSION } from '@/services/GraphQL/queries/users'
import { LoginInput } from '@/services/GraphQL/types/users'
import useLogger from '@/hooks/useLogger'
import LoginLayout from './Layout'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
  const [checkUserSession, { loading, data }] = useLazyQuery(GET_USER_SESSION)
  const { log, warn, error } = useLogger()
  const router = useRouter()

  useEffect(() => {
    if (!data) return
    if (data?.users?.length === 0) {
      warn(
        'Login:useEffect',
        'No se encontró ningún usuario en base de datos con esas credenciales, Usuario o contraseña incorrectos...',
        'INPUT',
      )
    } else {
      // DB have a condition to check "code_member" is unique, so this state should be impossible
      if (data?.users?.length > 1) {
        error(
          Error('Se encontraron más de un usuario en base de datos'),
          'Login:useEffect',
          'Se encontraron varios usuarios en base de datos con estas credenciales. Informe al servicio técnico del incidente...',
          'UNEXPECTED',
        )
        setTimeout(() => router.reload(), 1000)
        return
      }
      if (data.users[0]?.is_active && data.users[0]?.member_info?.email) {
        log('Login:useEffect', 'Usuario encontrado en base de datos, procediendo a verificar sesión...', 'SUCCESS')
        const user = data.users[0]
        window.sessionStorage.setItem('userId', user.id)
        window.sessionStorage.setItem('user', JSON.stringify(user))
        router.push('/')
      } else {
        warn('Login:useEffect', 'Usuario no activo, contactar con el administrador...', 'AUTHORIZATION')
      }
    }
  }, [data, log, warn, error, router])

  const onSubmit = async (formData: LoginInput) => {
    const { called, error: requestError } = await checkUserSession({ variables: formData })
    if (requestError) {
      error(requestError, 'Login:onSubmit', 'Error al verificar sesión', 'SERVER_CONNECTION')
    }
    if (!called) {
      warn('Login:onSubmit', 'No se pudo verificar sesión', 'AVAILABILITY')
    }
  }

  return <LoginLayout onSubmit={onSubmit} loading={loading} />
}

export default Login

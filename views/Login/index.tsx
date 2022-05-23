import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import { toast } from 'react-toastify'
import { GET_USER_SESSION } from '../../services/GraphQL/queries/users'
import { NextPage } from 'next'
import { LoginInput } from '../../services/GraphQL/types/users'
import LoginLayout from './Layout'

const Login: NextPage = () => {
  const router = useRouter()
  const [checkUserSession, { loading, data }] = useLazyQuery(GET_USER_SESSION)

  const onSubmit = async (formData: LoginInput) => {
    const { called, error } = await checkUserSession({ variables: formData })
    if (called) {
      console.log(data, error)
      if (error) {
        console.log(error)
        toast('Error al iniciar sesión', { type: 'error' })
      }

      if (!data || data?.users?.length === 0) {
        toast('Usuario o contraseña incorrectos', { type: 'error' })
      }
      if (data?.users?.length > 0) {
        router.push('/eventos/')
      }
    }
  }

  return <LoginLayout onSubmit={onSubmit} loading={loading} />
}

export default Login

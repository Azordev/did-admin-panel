import { NextPage } from 'next'

import { LoginInput } from '@/services/GraphQL/users/types'

import Centered from '../Shared/Layouts/Centered'
import LogoDID from '../SVGs/LogoDID/LogoDID'
import LoginForm from './LoginForm'

import styles from './Login.module.scss'

interface LoginFormProps {
  onSubmit: (_formData: LoginInput) => void
  loading: boolean
}
const LoginLayout: NextPage<LoginFormProps> = ({ onSubmit, loading }) => (
  <Centered>
    <div className={`shadow-md ${styles['login-container']}`}>
      <LogoDID className={styles.image} />
      <LoginForm onSubmit={onSubmit} loading={loading} />
    </div>
  </Centered>
)

export default LoginLayout

import PropTypes from 'prop-types'
import { Component, ErrorInfo, ReactNode } from 'react'

import client from '@/services/GraphQL/client'
import { CREATE_ERROR } from '@/services/GraphQL/errors/mutations'

import Fallback from './Fallback'

interface ErrorBoundaryProps {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
  errorInfo: ErrorInfo | null
  hasError: boolean
  errorId?: string
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static propTypes: { children: PropTypes.ReactComponentLike }
  // Constructor for initializing Variables etc in a state
  // Just similar to initial line of useState if you are familiar
  // with Functional Components
  constructor(props: ErrorBoundaryProps) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, error: null, errorInfo: null, errorId: '' }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    if (error) {
      return { hasError: true }
    }
  }

  // This method is called if any error is encountered
  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const userId = window.sessionStorage.getItem('userId')
    // You can use your own error logging service here
    const variables = {
      codeLocation: 'ErrorBoundary::componentDidCatch',
      error: { error: error.message, errorInfo },
      userId,
      type: 'UNEXPECTED',
    }
    let errorId = ''
    if (process.env.NODE_ENV !== 'production') {
      console.error(JSON.stringify(variables, null, 4))
    } else {
      const stringError = JSON.stringify({ error: error.message, errorInfo })
      const {
        data: {
          error: { id },
        },
        errors,
      } = await client.mutate({
        mutation: CREATE_ERROR,
        variables: {
          ...variables,
          error: stringError,
          origin: 'ADMIN',
        },
      })
      if (errors) {
        console.error(JSON.stringify(errors, null, 4))
      }
      errorId = id
    }
    // Catch errors in any components below and
    // re-render with error message
    this.setState(state => ({
      ...state,
      errorId,
      errorInfo,
      error,
    }))
  }

  render() {
    const { hasError, errorInfo, errorId } = this.state
    const { children } = this.props
    // Check if the error is thrown
    if (hasError) {
      // You can render any custom fallback UI
      return <Fallback errorInfo={errorInfo} errorId={errorId} />
    }

    // Normally, just render children, i.e. in
    // case no error is Found
    return children
  }
}

export default ErrorBoundary

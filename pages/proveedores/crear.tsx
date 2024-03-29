import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import Swal from 'sweetalert2'

import useLogger from '@/hooks/useLogger'
import { ProviderUserEditable } from '@/services/GraphQL/users/types'
import CreateProviderLayout from '@/views/Providers/Create'

const Create: NextPage = () => {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)
  const { error: logError } = useLogger()

  const submitHandler: SubmitHandler<ProviderUserEditable> = async newProvider => {
    setLoading(true)
    try {
      const provider: typeof newProvider = {
        ...newProvider,
        b2bPhone: newProvider.b2bPhone ?? 'NA',
        address: newProvider.address ?? 'NA',
        b2bEmail: newProvider.b2bEmail ? newProvider.b2bEmail : newProvider.salesEmail || 'NA',
        salesEmail: newProvider.salesEmail ?? 'NA',
        legalName: newProvider.legalName ?? 'NA',
      }

      const formdata = new FormData()

      Object.entries(provider).forEach(([key, value]) => formdata.append(key, value as string))

      await axios.post('/api/providers', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      Swal.fire({
        title: 'Proveedor creado',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
      push('/proveedores')
      setLoading(false)
    } catch (error) {
      logError(error as Error, 'pages/proveedores/crear.tsx', 'Error al crear el proveedor')
      setLoading(false)
    }
  }

  return <CreateProviderLayout onSubmit={submitHandler} loading={loading} />
}

export default Create

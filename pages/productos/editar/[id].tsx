import { useMutation } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

import UpdateFormContainer from '@/components/UpdateForm'
import useAuth from '@/hooks/useAuth'
import useLogger from '@/hooks/useLogger'
import { UPDATE_PRODUCT } from '@/services/GraphQL/products/mutations'
import { PRODUCT_BY_ID } from '@/services/GraphQL/products/queries'
import { ProductEditable } from '@/services/GraphQL/products/types'
import EditProductForm from '@/views/Products/Edit'

const EditProduct: NextPage = () => {
  const { user, isProvider } = useAuth()
  const { push, query } = useRouter()
  const { error: logError } = useLogger()

  const [updateProduct, { loading, error: mutationError }] = useMutation(UPDATE_PRODUCT)

  const submitHandler = async (updatedProduct: ProductEditable) => {
    await updateProduct({ variables: { ...updatedProduct, providerId: isProvider, id: query.id } })
    Swal.fire({
      title: 'Producto actualizado',
      icon: 'success',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    push('/productos')
  }

  if (mutationError) logError(mutationError, 'pages/productos/[id].tsx', 'Error al actualizar el producto')

  return (
    <UpdateFormContainer
      currentDataQuery={PRODUCT_BY_ID}
      submitHandler={submitHandler}
      isSubmitLoading={loading}
      UpdateForm={EditProductForm}
      parentImageUrl={user?.providerInfo.logoUrl}
      commercialName={user?.providerInfo.commercialName}
      queryName="product"
    />
  )
}

export default EditProduct

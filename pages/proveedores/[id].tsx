import { useQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import EmptyList from '@/components/EmptyList'
import ListHeader from '@/components/ListHeader'
import Loading from '@/components/Loading'
import useLogger from '@/hooks/useLogger'
import { Product } from '@/services/GraphQL/products/types'
import { PROVIDER_BY_ID } from '@/services/GraphQL/providers/queries'
import { Provider as ProviderFields } from '@/services/GraphQL/providers/types'
import ProductList from '@/views/Products/List'
import ProviderDetail from '@/views/Providers/Detail'
import ClientOnly from '@/views/Shared/ClientOnly'

interface ProviderWithProducts extends ProviderFields {
  products: Product[]
}

const Provider: NextPage = () => {
  const { push, query } = useRouter()
  const {
    data,
    loading,
    error: queryError,
  } = useQuery<{ provider: ProviderWithProducts }>(PROVIDER_BY_ID, {
    variables: {
      id: query.id,
    },
  })
  const { error: LogError } = useLogger()

  if (queryError) {
    LogError(queryError, 'Provider.tsx', 'useQuery(PROVIDER_BY_ID)', 'UNEXPECTED')
    push('/proveedores')
  }

  if (loading) return <Loading />
  if (!data || !data.provider) return <EmptyList text="El proveedor esta vacío o es invalido." />
  return (
    <ClientOnly>
      <>
        <ListHeader
          createPath={`/productos/crear?provider=${query.id}&provider-url=${data.provider.logoUrl}`}
          createText="Añadir nuevo producto"
          logoUrl={data.provider.logoUrl}
          altLogo={data.provider.commercialName}
        />
        <ProviderDetail provider={data.provider} />
        <ProductList products={data.provider.products} />
      </>
    </ClientOnly>
  )
}

export default Provider

import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'

import { SUBSCRIPTIONS } from '@/services/GraphQL/subscriptions/queries'
import { Subscription } from '@/services/GraphQL/subscriptions/types'
import ClientOnly from '@/views/Shared/ClientOnly'

const Subscriptions: NextPage = () => {
  const { data, loading } = useQuery(SUBSCRIPTIONS)

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (!data) {
    return <h2>No hay suscripciones</h2>
  }

  return (
    <ClientOnly>
      <>
        <h1>Suscripciones</h1>

        <ul>
          {data.subscriptions.map((subscription: Subscription) => (
            <li key={subscription.id}>{subscription.id}</li>
          ))}
        </ul>
      </>
    </ClientOnly>
  )
}

export default Subscriptions
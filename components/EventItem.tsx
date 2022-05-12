import type { NextPage } from 'next'
import type { Event } from '../services/GraphQL/types/events'
import { useRouter } from 'next/router'
import styles from '../styles/Events.module.css'

const EventItem: NextPage<{ event: Event }> = ({ event }) => {
  const { push } = useRouter()

  const toEdit = () => {
    push(`/eventos/editar/${event.id}`)
  }

  return (
    <div className={styles['event-item']}>
      <h2 className={styles['event-header']}>{event.title}</h2>

      <section className={styles['event-content']}>
        <p className={styles['event-date']}>Fecha: {new Date(event.date).toLocaleDateString()}</p>

        <p className={styles['event-description']}>{event.description}</p>

        <footer>
          <button className={styles['event-item-edit']} onClick={toEdit}>
            Editar
          </button>
        </footer>
      </section>
    </div>
  )
}

export default EventItem

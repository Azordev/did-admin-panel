import Link from 'next/link'
import { FC, ReactNode } from 'react'

import useAuth from '@/hooks/useAuth'
import LogoDID from '@/views/SVGs/LogoDID/LogoDID'

import Icons8 from '../../Icons8'
import Image from '../../Image'

import stylesIcons8 from '../../Icons8/Icons8.module.scss'
import styles from './Dashboard.module.scss'
import iconProv from './ic_prov.svg'

interface Props {
  children: ReactNode
}
const Dashboard: FC<Props> = ({ children }) => {
  const { logOut } = useAuth()
  const classNameInherited = styles.icons ? ' ' + styles.icons : '' // creates space before class if needed
  return (
    <>
      <aside className={styles.sidebar}>
        <nav>
          <Link href="/" passHref>
            <a className={styles.logo}>
              <LogoDID />
            </a>
          </Link>
          <Link href="/eventos" passHref>
            <a className={styles.link}>
              <Icons8 size={48} className={styles.icons} color="ffffff" iconStyle="ios-filled" name="health-calendar" />
              <span className={styles.line}>Eventos</span>
            </a>
          </Link>
          <Link href="/proveedores" passHref>
            <a className={styles.link}>
              <Image
                src={iconProv}
                alt={`shopaholic icon`}
                className={`${stylesIcons8.icon} ${styles.icons}`}
                imgClassName={`icon shopaholic`}
              />
              <span className={styles.line}>Proveedores</span>
            </a>
          </Link>
          <Link href="/socios" passHref>
            <a className={styles.link}>
              <Icons8 size={48} className={styles.icons} color="ffffff" iconStyle="ios-filled" name="groups" />
              <span className={styles.line}>Socios</span>
            </a>
          </Link>
        </nav>
        <button className={styles.button} onClick={logOut}>
          Cerrar Sesión
        </button>
      </aside>
      <main className={styles.main}>{children}</main>
    </>
  )
}

export default Dashboard

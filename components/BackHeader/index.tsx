/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC } from 'react'

import styles from './BackHeader.module.scss'

export interface BackHeaderProps {
  to?: string
  commercialName?: string
  parentImageUrl?: string
}

const BackHeader: FC<BackHeaderProps> = ({ to, commercialName, parentImageUrl }) => {
  const { push, back } = useRouter()

  return (
    <nav className={styles.nav}>
      <div className={styles['container-btn-logo']} onClick={() => (to ? push(to) : back())}>
        <a>
          <img
            className={styles.logo}
            src="https://icons.veryicon.com/png/o/application/yitao-wireless-icon-library/back-23.png"
            alt=""
          />
          <span className={styles.button}>Regresar</span>
        </a>
      </div>
      {parentImageUrl ? (
        <Image src={parentImageUrl} alt={commercialName} width={36} height={48} objectFit="contain" />
      ) : (
        <div className={styles.title}>{commercialName}</div>
      )}
    </nav>
  )
}

export default BackHeader

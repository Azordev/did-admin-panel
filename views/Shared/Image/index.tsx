import Img from 'next/image'
import { FC } from 'react'

import styles from './Image.module.scss'

interface Props {
  src: string
  alt: string
  [key: string]: string
}

const Image: FC<Props> = ({ src, alt, className, imgClassName, ...rest }) => (
  <div className={`${styles.container}${className ? ' ' + className : ''}`}>
    <Img src={src} alt={alt} layout="fill" {...rest} className={imgClassName} />
  </div>
)

export default Image

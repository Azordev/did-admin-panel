import React from 'react'

import Image from '../Image'

import styles from './Icons8.module.scss'

interface Icons8Props {
  name: string
  color?: string
  size?: string | number // Please if you change the size on CSS file, please change the size here too.
  className?: string
  iconStyle?:
    | 'ios'
    | 'win'
    | 'win8'
    | 'material'
    | 'android'
    | 'color'
    | 'office'
    | 'ultraviolet'
    | 'dotty'
    | 'nolan'
    | 'dusk'
    | string
}
const Icons8: React.FC<Icons8Props> = ({ color, iconStyle, name, className = '', size = 96 }) => {
  const stylePartial = iconStyle ? iconStyle + '/' : ''
  const colorPartial = color ? (color !== 'color' ? color.replace('#', '') + '/' : color + '/') : ''
  // reference: https://img.icons8.com/
  const src = `https://img.icons8.com/${stylePartial}${size}/${colorPartial}/${name}.png`
  /** @desc Creates space before class if needed */
  const classNameInherited = className ? ' ' + className : ''
  return (
    <Image
      src={src}
      alt={`${name} icon`}
      className={`${styles.icon}${classNameInherited}`}
      imgClassName={`icon ${name}`}
    />
  )
}

export default Icons8

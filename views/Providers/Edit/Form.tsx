import axios from 'axios'
import { useRouter } from 'next/router'
import { FC, memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Button from '@/components/Button'
import btnStyles from '@/components/Button/Button.module.scss'
import CustomInput from '@/components/CustomInput'
import DeleteModal from '@/components/DeleteModal'
import { MutableProviderFormProps, ProviderEditable } from '@/services/GraphQL/providers/types'

import ClientOnly from '../../Shared/ClientOnly'

import styles from '../Create/ProviderCreateForm.module.scss'

const EditProviderForm: FC<MutableProviderFormProps> = ({ onSubmit, loading, originalData: originalProvider }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProviderEditable>()
  const router = useRouter()
  const submitHandler = handleSubmit(onSubmit)
  const buttonText = loading ? 'Enviando' : 'Enviar'
  const showModal = () => {
    const message = originalProvider?.commercialName
      ? `el proveedor "${originalProvider?.commercialName}"`
      : 'proveedor'

    DeleteModal(message, async (confirmed: boolean) => {
      if (confirmed) {
        await axios.delete(`/api/providers/${originalProvider?.id}`)
        router.push('/proveedores')
      }
    })
  }

  useEffect(() => {
    setValue('userId', originalProvider?.user_info?.id)
    setValue('commercialName', originalProvider?.commercialName)
    setValue('startDate', originalProvider?.startDate)
    setValue('memberCode', originalProvider?.user_info?.memberCode)
    setValue('salesEmail', originalProvider?.b2bEmail)
    setValue('password', originalProvider?.user_info?.password)
  }, [originalProvider, setValue])

  return (
    <ClientOnly>
      <form onSubmit={submitHandler} className={styles.container} noValidate>
        <input type="hidden" defaultValue={originalProvider?.user_info?.id || ''} {...register('userId')} />
        <div className={styles['input-container']}>
          <CustomInput
            id="name"
            placeholder="Escriba el nombre de la empresa"
            label="Nombre de la empresa"
            register={register}
            name="commercialName"
            defaultValue={originalProvider?.commercialName || ''}
          >
            {errors.commercialName && <span>El nombre es requerido.</span>}
          </CustomInput>
        </div>
        <div className={styles['input-container']}>
          <CustomInput
            id="date"
            placeholder="DD/MM/AA"
            label="Fecha de inicio"
            register={register}
            name="startDate"
            type="date"
            defaultValue={originalProvider?.startDate?.split('T')[0] || ''}
          >
            {errors.startDate && <span>La fecha de inicio es requerida.</span>}
          </CustomInput>
        </div>
        <div className={styles['input-container']}>
          <CustomInput
            id="userName"
            placeholder="Escriba el usuario"
            label="Usuario"
            register={register}
            name="memberCode"
            defaultValue={originalProvider?.user_info?.memberCode || ''}
          >
            {errors.memberCode && <span>El nombre de usuario es requerido.</span>}
          </CustomInput>
        </div>
        <div className={styles['input-container']}>
          <CustomInput
            id="email"
            placeholder="Escriba el correo"
            label="Correo Electrónico"
            register={register}
            name="salesEmail"
            type="email"
            defaultValue={originalProvider?.b2bEmail || ''}
          >
            {errors.salesEmail && <span>El correo es requerido.</span>}
          </CustomInput>
        </div>
        <div className={styles['input-container']}>
          <CustomInput
            id="password"
            placeholder="Escriba la contraseña"
            label="Contraseña"
            register={register}
            name="password"
            defaultValue={originalProvider?.user_info?.password || ''}
          >
            {errors.password && <span>La contraseña es requerida</span>}
          </CustomInput>
        </div>
        <div className={btnStyles['buttons-container']}>
          <Button type="submit" className={btnStyles['button-save']}>
            {buttonText}
          </Button>
          <Button onClick={showModal} className={btnStyles['button-delete']}>
            Eliminar
          </Button>
        </div>
      </form>
    </ClientOnly>
  )
}

export default memo(EditProviderForm)

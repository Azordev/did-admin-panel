import { FC } from 'react'
import { useForm } from 'react-hook-form'

import { MutableProductFormProps, ProductEditable } from '@/services/GraphQL/products/types'

const EditProductForm: FC<MutableProductFormProps> = ({ onSubmit, loading, originalData: originalProduct }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductEditable>()
  const submitHandler = handleSubmit(onSubmit)
  const buttonText = loading ? 'Enviando' : 'Enviar'

  return (
    <>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="name"
          defaultValue={originalProduct?.name}
          {...register('name', { required: true })}
        />
        {errors.name && <small className="text-red-500">{errors.name.message}</small>}
        <input
          type="text"
          placeholder="description"
          defaultValue={originalProduct?.description}
          {...register('description', { required: true })}
        />
        {errors.description && <small className="text-red-500">{errors.description.message}</small>}
        <input
          type="text"
          placeholder="image_url"
          defaultValue={originalProduct?.imageUrl}
          {...register('imageUrl', { required: true })}
        />
        {errors.imageUrl && <small className="text-red-500">{errors.imageUrl.message}</small>}
        <input
          type="text"
          placeholder="base_price_sol"
          defaultValue={originalProduct?.basePriceSol}
          {...register('basePriceSol', { required: true })}
        />
        {errors.basePriceSol && <small className="text-red-500">{errors.basePriceSol.message}</small>}
        <button type="submit">{buttonText}</button>
      </form>
    </>
  )
}

export default EditProductForm

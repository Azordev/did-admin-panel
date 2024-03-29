import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, FC, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { SubmitHandler, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

import Button from '@/components/Button'
import { MutableProductFormProps, ProductEditable } from '@/services/GraphQL/products/types'
import stylesInput from '@/styles/EditEvent.module.scss'
import Picture from '@/views/SVGs/Picture'

interface ProductEditableWithImg extends ProductEditable {
  image?: FileList
}

const CreateProductForm: FC<MutableProductFormProps> = ({ onSubmit, loading }) => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const MAX_FILE_SIZE = 8000000
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductEditableWithImg>()
  const submitHandler = handleSubmit(onSubmit as unknown as SubmitHandler<ProductEditableWithImg>)
  const router = useRouter()
  const handleFile = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (file && file.size >= MAX_FILE_SIZE) {
      return Swal.fire('Error', 'Imagen excede el tamaño maximo (8MB)', 'error')
    }
    if (file?.type.includes('image')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          setImageUrl(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrice = (e: { value: any }) => setValue('basePriceSol', e.value)

  return (
    <form className="form-product" onSubmit={submitHandler}>
      <label className="text-size label" htmlFor="name">
        Nombre del Producto
      </label>
      <input
        className={`input-product font-visby ${errors.name && 'error'}`}
        id="name"
        type="text"
        placeholder="Escriba el nombre del evento..."
        {...register('name', { required: { value: true, message: 'El campo no puede estar vacio' } })}
      />
      {errors.name && <small className={stylesInput['error-message']}>{errors.name.message}</small>}

      <label className="text-size label" htmlFor="basePriceSol">
        Precio del producto
      </label>
      <div className="container-price">
        <p className="price">S/.</p>
        <CurrencyFormat
          fixedDecimalScale={true}
          decimalScale={2}
          className={`input-product font-visby ${errors.basePriceSol && 'error'}`}
          type="text"
          allowNegative={false}
          isNumericString={true}
          id="basePriceSol"
          placeholder="00.00"
          onValueChange={handlePrice}
          {...register('basePriceSol', {
            required: true,
            validate: value => value !== 0,
          })}
        />
      </div>
      <label className="text-size label" htmlFor="description">
        Descripción del producto
      </label>
      <textarea
        className={`textarea font-visby ${errors.description && 'error'}`}
        id="description"
        placeholder="Escribe aquí..."
        {...register('description', { required: { value: true, message: 'El campo no puede estar vacio' } })}
      />
      {errors.description && <small className={stylesInput['error-message']}>{errors.description.message}</small>}

      <label className="text-size label">Añadir imagen del producto</label>

      <div>
        <div className={stylesInput['container-input']}>
          <input
            id="image-file"
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            className={stylesInput['input-file']}
            {...register('image')}
            onChange={handleFile}
          />
          <label htmlFor="image-file" className={stylesInput.image}>
            <figure>
              {imageUrl ? (
                <Image width={300} height={200} objectFit="contain" src={imageUrl} alt="Imagen del producto" />
              ) : (
                <Picture />
              )}
            </figure>
            <span className={stylesInput.label}>{imageFile?.name ? 'Cambiar imagen' : 'Añadir imagen'}</span>
            <span className={stylesInput.label}>*Max 8MB Size</span>
          </label>
        </div>
      </div>
      {errors.imageUrl && <small className={stylesInput['error-message']}>{errors.imageUrl.message}</small>}
      <div className="button-container">
        <Button disabled={loading} className={stylesInput['button-save']} type="submit">
          {loading ? 'Guardando' : 'Guardar'}
        </Button>
        <Button className={stylesInput['button-cancel']} onClick={() => router.push('/productos')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default CreateProductForm

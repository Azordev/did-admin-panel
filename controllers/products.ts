import { ApolloError } from '@apollo/client'
import formidable from 'formidable'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

import client from '@/services/GraphQL/client'
import { CREATE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT } from '@/services/GraphQL/products/mutations'
import { PRODUCT_BY_ID, PRODUCTS, PRODUCTS_BY_PROVIDER } from '@/services/GraphQL/products/queries'
import { Product } from '@/services/GraphQL/products/types'

import { addObject } from '../services/AWS/s3'

interface GetParams {
  limit?: number
  offset?: number
  query?: string
}

export const getProduct = async (
  productId: string | string[],
): Promise<{ product: Product | undefined; error: ApolloError | undefined }> => {
  const { data, error } = await client.query<{ product: Product }>({
    query: PRODUCT_BY_ID,
    variables: {
      id: productId,
    },
  })

  return { product: data.product, error }
}

export const getProducts = async (
  params?: GetParams,
): Promise<{ products: Product[] | undefined; error: ApolloError | undefined }> => {
  const { data, error } = await client.query<{ products: Product[] }>({
    query: PRODUCTS,
    variables: {
      offset: params?.offset || 0,
      limit: params?.limit || 24,
      query: params?.query || '%',
    },
  })

  return { products: data.products, error }
}

export const getProviderProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req

    if (!query.providerId) {
      return res.status(400).json({ error: 'Missing providerId' })
    }

    const { data } = await client.query({
      query: PRODUCTS_BY_PROVIDER,
      variables: {
        offset: Number(query?.offset) || 0,
        limit: Number(query?.limit) || 24,
        query: query?.query || '%',
        providerId: query.providerId,
      },
    })

    res.json(data)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getProductsAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  try {
    const { query } = req
    const { data } = await client.query({
      query: PRODUCTS,
      variables: {
        offset: Number(query?.offset) || 0,
        limit: Number(query?.limit) || 24,
        query: query?.query || '%',
      },
    })

    res.json(data)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const createProduct = (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable()

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json(err)
      }

      const file = files.image as formidable.File
      const { Location: imageUrl } = await addObject(file, 'products')

      await client.mutate({
        mutation: CREATE_PRODUCT,
        variables: { ...fields, imageUrl },
      })
      res.json({
        msg: 'Product created successfully',
        data: { ...fields, imageUrl },
      })
    } catch (error) {
      res.status(500).json(error)
    }
  })
}

export const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable()
  form.parse(req, async (err, fields, files) => {
    try {
      const productId = req.query?.id
      const productDataBase = await getProduct(productId)
      const { product: productDefault, error: errEventDataBase } = productDataBase ?? {}

      if (err || errEventDataBase) {
        return res.status(500).json(err)
      }

      let imageUrl = productDefault?.imageUrl ?? ''

      if (files.image) {
        const file = files.image as formidable.File
        const { Location } = await addObject(file, 'products')
        imageUrl = Location ?? ''
      }

      const { data } = await client.mutate({
        mutation: UPDATE_PRODUCT,
        variables: { ...fields, imageUrl, id: productId },
      })

      if (!data?.update_products_by_pk) {
        return res.status(404).json({ msg: 'Product not found' })
      }

      res.status(204).json({
        msg: 'Product updated successfully',
        data: { ...fields, imageUrl },
      })
    } catch (error) {
      return res.status(500).json(error)
    }
  })
}

export const deleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req
    const { id } = query

    if (!id) {
      return res.status(400).json({ msg: 'Product id is required' })
    }

    await client.mutate({
      mutation: DELETE_PRODUCT,
      variables: { id },
    })

    return res.status(204).json({ msg: 'Product deleted successfully' })
  } catch (error) {
    return res.status(500).json(error)
  }
}

import { gql } from '@apollo/client'

export const categoryInfo = gql`
  fragment CategoryInfoFragment on categories {
    isActive
    name
  }
`

export interface CategoryBase {
  name: string
}

export interface CategoryEditable extends CategoryBase {
  isActive?: boolean
}

export interface Category extends CategoryBase {
  id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  products: {
    stats: {
      count: number
    }
  }
}

export interface MutableCategoryFormProps {
  onSubmit: (_formData: CategoryEditable) => void
  loading: boolean
  originalData?: Category
}

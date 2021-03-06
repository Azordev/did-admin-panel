import Link from 'next/link'
import { FC } from 'react'

import { Category } from '@/services/GraphQL/categories/types'

const CategoryDetail: FC<{ category: Category }> = ({ category }) => (
  <div>
    <h1>{category.name}</h1>

    {category.isActive ? <p>Activo</p> : <p>Desactivado</p>}

    {category.products.stats.count > 0 && <Link href={`/categorias/`}>{category.products.stats.count}</Link>}
  </div>
)

export default CategoryDetail

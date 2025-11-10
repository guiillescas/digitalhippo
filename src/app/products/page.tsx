'use client'

import { ReactElement, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import ProductReel from '@/components/ProductReel'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

import { PRODUCT_CATEGORIES } from '@/config'

const BREADCRUMBS = [
  {
    id: 1,
    name: 'Home',
    href: '/',
  },
  {
    id: 2,
    name: 'Products',
    href: '/products',
  },
]

export default function ProductsPage(): ReactElement {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  function getTitle() {
    if (!selectedCategory) {
      return 'Todos os Produtos'
    }

    const category = PRODUCT_CATEGORIES.find(
      (cat) => cat.value === selectedCategory
    )
    return category?.label || 'Todos os Produtos'
  }

  function getSubtitle() {
    if (!selectedCategory) {
      return 'Navegue por nossa coleção completa de ativos digitais de alta qualidade'
    }

    const category = PRODUCT_CATEGORIES.find(
      (cat) => cat.value === selectedCategory
    )
    return `Explore nossa coleção premium de ${category?.label.toLowerCase()}`
  }

  function getQuery() {
    if (selectedCategory) {
      return { category: selectedCategory, limit: 12, sort: 'desc' as const }
    }
    return { limit: 12, sort: 'desc' as const }
  }

  return (
    <MaxWidthWrapper>
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <ol className='flex items-center space-x-2'>
          {BREADCRUMBS.map((breadcrumb, index) => (
            <li key={breadcrumb.id}>
              <div className='flex items-center text-sm'>
                <Link
                  href={breadcrumb.href}
                  className='text-sm font-medium text-muted-foreground hover:text-gray-900'
                >
                  {breadcrumb.name}
                </Link>
                {index !== BREADCRUMBS.length - 1 ? (
                  <svg
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    aria-hidden='true'
                    className='ml-2 h-5 w-5 flex-shrink-0 text-gray-300'
                  >
                    <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                  </svg>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <div className='mt-8'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            Navegue pelos Produtos
          </h1>
          <p className='mt-4 max-w-xl text-lg text-muted-foreground'>
            Descubra ativos digitais de alta qualidade para seu próximo projeto.
          </p>
        </div>

        <div className='mt-8 flex flex-wrap gap-2'>
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {PRODUCT_CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant={
                selectedCategory === category.value ? 'default' : 'outline'
              }
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className='mt-6'>
          <ProductReel
            title={getTitle()}
            subTitle={getSubtitle()}
            query={getQuery()}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

'use client'

import { ReactElement } from 'react'
import Link from 'next/link'

import { TQueryValidator } from '../lib/validators/query'

import { Product } from '../payload-types'

import ProductListing from './ProductListing'
import { trpc } from '../trpc/client'

interface ProductReelProps {
  title: string
  subTitle?: string
  href?: string
  query: TQueryValidator
}

const FALLBACK_LIMIT = 4

export default function ProductReel(props: ProductReelProps): ReactElement {
  const { title, subTitle, href, query } = props

  const timelineProcedure: any = trpc.getInfiniteProducts

  const { data: queryResults, isLoading } = timelineProcedure.useInfiniteQuery(
    {
      limit: query.limit ?? FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: (lastPage: { nextPage: number }) => lastPage.nextPage,
    }
  )

  const products = queryResults?.pages.flatMap(
    (page: { items: Product[] }) => page.items
  )

  let map: (Product | null)[] = []
  if (products && products.length) {
    map = products
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
  }

  return (
    <section className='py-12'>
      <div className='mb-4 md:flex md:items-center md:justify-between'>
        <div className='max-w-2xl px-4 lg:max-w-4xl lg:px-0'>
          {title ? (
            <h1 className='to-gray-900 text-2xl font-bold sm:text-3xl'>
              {title}
            </h1>
          ) : null}
          {subTitle ? (
            <p className='mt-2 text-sm text-muted-foreground'>{subTitle}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className='hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block'
          >
            Shop the collection <span aria-hidden='true'>&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className='relative'>
        <div className='mt-6 w-full items-center'>
          <div className='grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8'>
            {map.map((product, index) => (
              <ProductListing
                product={product}
                index={index}
                key={`product-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

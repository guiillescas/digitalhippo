import { z } from 'zod'

import { QueryValidator } from '../lib/validators/query'

import { publicProcedure, router } from './trpc'
import { productRouter } from './product-router'
import { paymentRouter } from './payment-router'
import { authRouter } from './auth-router'
import { getPayloadClient } from '../get-payload'

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  product: productRouter,

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        query: QueryValidator,
      })
    )
    .query(async ({ input }: { input: { query: any } }) => {
      const { query } = input
      const { sort, limit, ...queryOptions } = query

      const payload = await getPayloadClient()

      const parsedQueryOptions: Record<string, { equals: string }> = {}

      Object.entries(queryOptions).forEach(([key, value]) => {
        parsedQueryOptions[key] = {
          equals: value as string,
        }
      })

      const page = 1

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'products',
        where: {
          approvedForSale: {
            equals: 'approved',
          },
          ...parsedQueryOptions,
        },
        sort,
        depth: 1,
        limit,
        page,
      })

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      }
    }),
})

export type AppRouter = typeof appRouter

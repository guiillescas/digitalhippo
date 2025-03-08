import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { getStripeInstance } from '../lib/server/stripe'

import { router, privateProcedure } from './trpc'

export const productRouter = router({
  createStripeProduct: privateProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = getStripeInstance()
      if (!stripe) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

      const { name, price } = input

      const createdProduct = await stripe.products.create({
        name,
        default_price_data: {
          currency: 'USD',
          unit_amount: Math.round(price * 100),
        },
      })

      return {
        stripeId: createdProduct.id,
        priceId: createdProduct.default_price as string,
      }
    }),

  updateStripeProduct: privateProcedure
    .input(
      z.object({
        stripeId: z.string(),
        name: z.string(),
        priceId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = getStripeInstance()
      if (!stripe) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

      const { stripeId, name, priceId } = input

      const updatedProduct = await stripe.products.update(stripeId, {
        name,
        default_price: priceId,
      })

      return {
        stripeId: updatedProduct.id,
        priceId: updatedProduct.default_price as string,
      }
    }),
})

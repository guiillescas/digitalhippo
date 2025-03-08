import { stripe } from './stripe'

export async function createStripeProduct(name: string, price: number) {
  if (typeof window !== 'undefined') return null

  return await stripe.products.create({
    name,
    default_price_data: {
      currency: 'USD',
      unit_amount: Math.round(price * 100),
    },
  })
}

export async function updateStripeProduct(
  stripeId: string,
  name: string,
  priceId: string
) {
  if (typeof window !== 'undefined') return null

  return await stripe.products.update(stripeId, {
    name,
    default_price: priceId,
  })
}

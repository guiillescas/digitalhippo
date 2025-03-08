import { stripe } from '../../lib/stripe'

export const stripeActions = {
  async createProduct(name: string, price: number) {
    return await stripe.products.create({
      name,
      default_price_data: {
        currency: 'USD',
        unit_amount: Math.round(price * 100),
      },
    })
  },

  async updateProduct(stripeId: string, name: string, priceId: string) {
    return await stripe.products.update(stripeId, {
      name,
      default_price: priceId,
    })
  },
}

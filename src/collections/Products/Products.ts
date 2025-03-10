import { BeforeChangeHook } from 'payload/dist/collections/config/types'
import { PRODUCT_CATEGORIES } from '../../config'

import { CollectionConfig } from 'payload/types'
import { Product } from '../../payload-types'

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user
  return { ...data, user: user.id }
}

const syncWithStripe: BeforeChangeHook<Product> = async ({
  req,
  data,
  operation,
}) => {
  try {
    // Importação dinâmica para evitar que o Payload bundle o código do Stripe
    const { stripeActions } = await import('./stripe-actions')

    if (operation === 'create') {
      if (!data.name || !data.price) {
        throw new Error('Missing required fields: name or price')
      }

      const createdProduct = await stripeActions.createProduct(
        data.name,
        data.price
      )

      return {
        ...data,
        stripeId: createdProduct.id,
        priceId: createdProduct.default_price as string,
      }
    }

    if (operation === 'update' && data.stripeId) {
      if (!data.name) {
        throw new Error('Missing required field: name')
      }

      const updatedProduct = await stripeActions.updateProduct(
        data.stripeId,
        data.name,
        data.priceId!
      )

      return {
        ...data,
        stripeId: updatedProduct.id,
        priceId: updatedProduct.default_price as string,
      }
    }

    return data
  } catch (err) {
    console.error('Error syncing with Stripe:', err)
    return data
  }
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {},
  hooks: {
    beforeChange: [addUser, syncWithStripe],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product details',
    },
    {
      name: 'price',
      label: 'Price in USD',
      min: 0,
      max: 1000,
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: 'product_files',
      label: 'Product file(s)',
      type: 'relationship',
      required: true,
      relationTo: 'product_files',
      hasMany: false,
    },
    {
      name: 'approvedForSale',
      label: 'Product Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        { label: 'Pending verification', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Denied', value: 'denied' },
      ],
    },
    {
      name: 'priceId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'stripeId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}

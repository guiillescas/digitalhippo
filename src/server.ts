import { IncomingMessage } from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import * as trpcExpress from '@trpc/server/adapters/express'
import { inferAsyncReturnType } from '@trpc/server'

import { stripeWebhookHandler } from './webhooks'

import { nextApp, nextHandler } from './next-utils'

import { appRouter } from './trpc'
import { getPayloadClient } from './get-payload'

const app = express()
const port = Number(process.env.PORT) || 3000

function createContext({ req, res }: trpcExpress.CreateExpressContextOptions) {
  return { req, res }
}

export type ExpressContext = inferAsyncReturnType<typeof createContext>

export type WebhookRequest = IncomingMessage & { rawBody: Buffer }

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buf) => {
      req.rawBody = buf
      return true
    },
  })

  app.post('/api/webhooks/stripe', webhookMiddleware, stripeWebhookHandler)

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`)
      },
    },
  })

  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  )

  app.use((req, res) => nextHandler(req, res))

  nextApp.prepare().then(() => {
    payload.logger.info('Next.js started')

    app.listen(port, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      )
    })
  })
}

start()

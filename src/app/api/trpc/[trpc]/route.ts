import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/trpc'

function handler(req: Request) {
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    // @ts-expect-error Context already passed from ecpress middleware
    createContext: () => ({}),
  })
}

export { handler as GET, handler as POST }

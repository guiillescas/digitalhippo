import { NextRequest } from 'next/server'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

import { User } from '../payload-types'

export async function getServerSideUser(
  cookies: NextRequest['cookies'] | ReadonlyRequestCookies
) {
  const token = cookies.get('payload-token')?.value

  try {
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    )

    if (!userResponse.ok) {
      return { user: null }
    }

    const { user } = (await userResponse.json()) as { user: User | null }

    return { user }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return { user: null }
  }
}

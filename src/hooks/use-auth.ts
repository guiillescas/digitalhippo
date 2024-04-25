import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

export function useAuth() {
  const router = useRouter()

  async function signOut() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error()
      }

      toast.success('Signed out successfully!')

      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error(`Coundn't sign out. Please try again.`)
    }
  }

  return { signOut }
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/trpc/client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import Icons from '@/components/Icons'

import {
  AuthCredentialsProps,
  AuthCredentialsValidator,
} from '@/lib/validators/account-credentials'
import { cn } from '@/lib/utils'

export default function SignIn() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isSeller = searchParams.get('as') === 'seller'
  const origin = searchParams.get('origin')

  function continueAsSeller() {
    router.push('?as=seller')
  }

  function continueAsBuyer() {
    router.replace('/sign-in', undefined)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentialsProps>({
    resolver: zodResolver(AuthCredentialsValidator),
  })

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success('Sign in successfully')

      router.refresh()

      if (origin) {
        router.push(`/${origin}`)

        return
      }

      if (isSeller) {
        router.push('/sell')

        return
      }

      router.push('/')
      router.refresh()
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        toast.error('Invalid email or password.')
      }
    },
  })

  function handleSignIn({ email, password }: AuthCredentialsProps) {
    signIn({ email, password })
  }

  return (
    <div className='container relative flex flex-col items-center justify-center pt-20 lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <Icons.logo className='h-20 w-20' />

          <h1 className='text-2xl font-bold'>
            Sign in to your {isSeller ? 'seller' : ''} account
          </h1>

          <Link
            className={buttonVariants({
              variant: 'link',
              className: 'gap-1.5',
            })}
            href='/sign-up'
          >
            Don&apos;t have an account? <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='grid gap-6'>
          <form onSubmit={handleSubmit(handleSignIn)}>
            <div className='grid gap-2'>
              <div className='grid gap-1 py-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  {...register('email')}
                  className={cn({
                    'focus-visible:ring-red-500': errors.email,
                  })}
                  placeholder='john-doe@example.com'
                />
                {errors?.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>

              <div className='grid gap-1 py-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  {...register('password')}
                  className={cn({
                    'focus-visible:ring-red-500': errors.password,
                  })}
                  placeholder='Password'
                  type='password'
                />
                {errors?.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type='submit'>Sign in</Button>
            </div>
          </form>

          <div className='relative'>
            <div
              className='absolute inset-0 flex items-center'
              aria-hidden='true'
            >
              <span className='w-full border-t' />
            </div>

            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                or
              </span>
            </div>
          </div>

          {isSeller ? (
            <Button
              onClick={continueAsBuyer}
              variant='secondary'
              disabled={isLoading}
            >
              Continue as customer
            </Button>
          ) : (
            <Button
              onClick={continueAsSeller}
              variant='secondary'
              disabled={isLoading}
            >
              Continue as seller
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

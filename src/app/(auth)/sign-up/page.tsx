'use client'

import Link from 'next/link'

import { useForm } from 'react-hook-form'
import { ArrowRight } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/trpc/client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import Icons from '@/components/Icons'

import {
  SignUpFormProps,
  AuthCredentialsValidator,
} from '@/lib/validators/account-credentials'
import { cn } from '@/lib/utils'

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormProps>({
    resolver: zodResolver(AuthCredentialsValidator),
  })

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({})

  function handleSignUp({ email, password }: SignUpFormProps) {
    mutate({ email, password })
  }

  return (
    <div className='container relative flex flex-col items-center justify-center pt-20 lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <Icons.logo className='h-20 w-20' />

          <h1 className='text-2xl font-bold'>Create an account</h1>

          <Link
            className={buttonVariants({
              variant: 'link',
              className: 'gap-1.5',
            })}
            href='/sing-in'
          >
            Already have an account? Sign-in <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='grid gap-6'>
          <form onSubmit={handleSubmit(handleSignUp)}>
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
              </div>

              <Button type='submit'>Sign up</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

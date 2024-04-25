'use client'

import { ReactElement } from 'react'
import Link from 'next/link'

import { useAuth } from '@/hooks/use-auth'

import { User } from '../payload-types'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'

interface UserAccountNavProps {
  user: User
}

export default function UserAccountNav({
  user,
}: UserAccountNavProps): ReactElement {
  const { signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='overflow-visible'>
        <Button variant='ghost' size='sm' className='relative'>
          My account
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-60 bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            <p className='text-sm font-medium text-black'>{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/sell'>Seller Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className='cursor-pointer' onClick={signOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

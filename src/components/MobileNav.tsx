'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Menu } from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import Cart from './Cart'

const MobileNav = () => {
  const pathname = usePathname()

  // whenever we click an item in the menu and navigate away, we want to close the menu
  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      return true
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' className='lg:hidden'>
          <Menu className='h-6 w-6' aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-4/5 pr-0'>
        <div className='flex flex-col gap-4 px-2'>
          <Link
            onClick={() => closeOnCurrent('/sign-in')}
            href='/sign-in'
            className='text-sm font-medium text-gray-900 transition-colors hover:text-gray-600'
          >
            Sign in
          </Link>
          <Link
            onClick={() => closeOnCurrent('/sign-up')}
            href='/sign-up'
            className='text-sm font-medium text-gray-900 transition-colors hover:text-gray-600'
          >
            Sign up
          </Link>
          <div className='flex'>
            <Cart />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav

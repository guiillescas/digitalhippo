'use client'

import { ReactElement, useEffect, useRef, useState } from 'react'

import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import { PRODUCT_CATEGORIES } from '@/config'

import NavItem from './NavItem'

export default function NavItems(): ReactElement {
  const [activeIndex, setActiveIndex] = useState<null | number>(null)

  const isAnyOpen = activeIndex !== null

  const navRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(navRef, () => setActiveIndex(null))

  useEffect(() => {
    const escHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      }
    }

    document.addEventListener('keydown', escHandler)

    return () => {
      document.removeEventListener('keydown', escHandler)
    }
  }, [])

  return (
    <div className='flex h-full gap-4' ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, index) => {
        const handleOpen = () => {
          if (activeIndex === index) {
            setActiveIndex(null)
          } else {
            setActiveIndex(index)
          }
        }

        const isOpen = index === activeIndex

        return (
          <NavItem
            key={category.value}
            category={category}
            handleOpen={handleOpen}
            isAnyOpen={isAnyOpen}
            isOpen={isOpen}
          />
        )
      })}
    </div>
  )
}

'use client'

import { ReactElement, useEffect, useState } from 'react'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import type SwiperType from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ImageSliderProps {
  urls: string[]
}

export default function ImageSlider({ urls }: ImageSliderProps): ReactElement {
  const [swiper, setSwiper] = useState<null | SwiperType>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  })

  useEffect(() => {
    swiper?.on('slideChange', ({ activeIndex }) => {
      setActiveIndex(activeIndex)
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      })
    })
  }, [swiper, urls])

  const activeStyles =
    'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 items-center justify-center rounded-full border-2 bg-white border-zinc-300'
  const inactiveStyles = 'hidden text-gray-400'

  return (
    <div className='group relative aspect-square overflow-hidden rounded-xl bg-zinc-100'>
      <div className='absolute inset-0 opacity-0 transition zoom-in-100 group-hover:opacity-100'>
        <button
          onClick={(event) => {
            event.preventDefault()
            swiper?.slideNext()
          }}
          className={cn(activeStyles, 'right-3 transition', {
            [inactiveStyles]: slideConfig.isEnd,
            'hover:bg-primary-300 text-primary-800 opacity-100':
              !slideConfig.isEnd,
          })}
          aria-label='Next image'
        >
          <ChevronRight className='h-4 w-4 text-zinc-700' />
        </button>

        <button
          onClick={(event) => {
            event.preventDefault()
            swiper?.slidePrev()
          }}
          className={cn(activeStyles, 'left-3 transition', {
            [inactiveStyles]: slideConfig.isBeginning,
            'hover:bg-primary-300 text-primary-800 opacity-100':
              !slideConfig.isBeginning,
          })}
          aria-label='Previous image'
        >
          <ChevronLeft className='h-4 w-4 text-zinc-700' />
        </button>
      </div>

      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`
          },
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        modules={[Pagination]}
        slidesPerView={1}
        className='h-full w-full'
      >
        {urls.map((url, index) => (
          <SwiperSlide key={index} className='relative -z-10 h-full w-full'>
            <Image
              fill
              loading='eager'
              className='-z-10 h-full w-full object-cover object-center'
              src={url}
              alt='product image'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

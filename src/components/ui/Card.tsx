'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  padding = 'md',
  hover = false,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E8D5D5]/50 rounded-2xl shadow-soft',
        'transition-all duration-200',
        hover && 'hover:-translate-y-1 hover:shadow-hover hover:border-mauve-light',
        paddingClasses[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

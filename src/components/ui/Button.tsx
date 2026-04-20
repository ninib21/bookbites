'use client'

import Link from 'next/link'
import { ButtonHTMLAttributes, ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonAsLink = BaseProps & {
  href: string
  target?: string
  rel?: string
  onClick?: never
  type?: never
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-300 text-white border-2 border-transparent shadow-soft hover:bg-primary-400 hover:shadow-hover active:bg-primary-500',
  secondary:
    'bg-white text-primary-300 border-2 border-primary-300 hover:bg-cream hover:border-primary-400',
  ghost:
    'bg-transparent text-charcoal border-2 border-[#E8D5D5] hover:bg-white hover:border-mauve-light',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2.5 text-sm',
  md: 'min-h-[48px] px-5.5 py-3.5 text-[15px]',
  lg: 'min-h-[56px] px-7 py-4 text-base',
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...restProps
  } = props
  const buttonRef = useRef<HTMLElement>(null)

  const classes = cn(
    'inline-flex items-center justify-center gap-2.5 rounded-full font-semibold leading-none',
    'transition-all duration-200 cursor-pointer text-center whitespace-nowrap',
    'hover:-translate-y-0.5 active:translate-y-0',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  )

  if ('href' in props && props.href) {
    return (
      <Link
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={classes}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      {...restProps}
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      className={cn(
        classes,
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 font-[inherit]'
      )}
    >
      {children}
    </button>
  )
}

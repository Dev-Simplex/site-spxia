"use client"

import type * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface UnderlineLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Classes extras aplicadas ao traço que aparece no hover/foco. */
  underlineClassName?: string
}

/**
 * Link com traço vermelho que cresce da esquerda no hover/foco.
 * Usa `next/link` para rotas internas e `<a>` para âncoras, mailto e externos.
 * A animação usa `transform` (scaleX) e é neutralizada em `prefers-reduced-motion`.
 */
export function UnderlineLink({
  href,
  children,
  className,
  underlineClassName,
  ...props
}: UnderlineLinkProps) {
  const isRoute = href.startsWith("/")

  const content = (
    <>
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary",
          "transition-transform duration-300 ease-out",
          "group-hover/underline:scale-x-100 group-focus-visible/underline:scale-x-100",
          "motion-reduce:transition-none",
          underlineClassName,
        )}
      />
    </>
  )

  const classes = cn(
    "group/underline relative inline-flex items-center transition-colors duration-300 ease-out",
    "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
    "outline-none focus-visible:ring-0",
    className,
  )

  if (isRoute) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  )
}

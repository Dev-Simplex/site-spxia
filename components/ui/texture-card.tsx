import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Adaptado do registry cult-ui (nolly-studio) para o tema dark único da SPXIA.
 * O original alterna via `dark:`; aqui o tema é fixo, então as camadas de borda
 * aninhadas usam valores diretos sobre o card #212121.
 */

const TextureCardStyled = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[24px] border border-white/[0.06]",
      "bg-gradient-to-b from-secondary to-card",
      className
    )}
    {...props}
  >
    {/* Bordas aninhadas — dão o relevo característico do componente */}
    <div className="rounded-[23px] border border-black/40">
      <div className="rounded-[22px] border border-black/60">
        <div className="rounded-[21px] border border-white/[0.04]">
          <div className="w-full rounded-[20px] border border-white/[0.05] text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
))
TextureCardStyled.displayName = "TextureCardStyled"

const TextureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-[calc(var(--radius))] border border-white/[0.06]", className)}
      {...props}
    >
      <div className="rounded-[calc(var(--radius)-1px)] border border-black/40">
        <div className="rounded-[calc(var(--radius)-2px)] border border-black/60">
          <div className="rounded-[calc(var(--radius)-3px)] border border-white/[0.04]">
            <div className="w-full rounded-[calc(var(--radius)-4px)] border border-white/[0.05] bg-gradient-to-b from-card to-secondary/60 text-muted-foreground">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
TextureCard.displayName = "TextureCard"

const TextureCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("first:pt-6 last:pb-6", className)} {...props} />
))
TextureCardHeader.displayName = "TextureCardHeader"

const TextureCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("pl-2 text-lg font-semibold leading-tight text-foreground", className)}
    {...props}
  />
))
TextureCardTitle.displayName = "TextureCardTitle"

const TextureCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("pl-2 text-sm text-muted-foreground", className)} {...props} />
))
TextureCardDescription.displayName = "TextureCardDescription"

const TextureCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
))
TextureCardContent.displayName = "TextureCardContent"

const TextureCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between gap-2 px-6 py-4", className)}
    {...props}
  />
))
TextureCardFooter.displayName = "TextureCardFooter"

const TextureSeparator = () => {
  return (
    <div className="border border-l-transparent border-r-transparent border-t-black/60 border-b-white/[0.05]" />
  )
}

export {
  TextureCard,
  TextureCardHeader,
  TextureCardStyled,
  TextureCardFooter,
  TextureCardTitle,
  TextureSeparator,
  TextureCardDescription,
  TextureCardContent,
}

export default TextureCard

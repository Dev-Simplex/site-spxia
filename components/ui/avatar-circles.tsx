"use client"

import { cn } from "@/lib/utils"

// AvatarCircles (MagicUI) adaptado: círculos com iniciais em vez de fotos —
// o site não usa imagens reais de clientes, então cada avatar recebe apenas
// as iniciais e as cores vêm dos tokens do tema.
interface Avatar {
  initials: string
}

interface AvatarCirclesProps {
  className?: string
  numPeople?: number
  avatars: Avatar[]
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatars,
}: AvatarCirclesProps) => {
  return (
    // -space-x-2: com -space-x-4 o círculo seguinte invadia a área central e
    // cortava as iniciais (2 letras ≈ 15px centralizados num círculo de 40px).
    <div className={cn("z-10 flex -space-x-2 rtl:space-x-reverse", className)}>
      {avatars.map((avatar, index) => (
        <span
          key={index}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-secondary text-center font-mono text-xs font-medium text-foreground"
          aria-hidden="true"
        >
          {avatar.initials}
        </span>
      ))}
      {(numPeople ?? 0) > 0 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary-btn text-center font-mono text-xs font-medium text-primary-foreground">
          +{numPeople}
        </span>
      )}
    </div>
  )
}

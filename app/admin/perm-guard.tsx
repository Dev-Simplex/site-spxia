"use client"

import type { ReactNode } from "react"

import { usePermissions } from "@/hooks/use-permissions"

/** Equivalente ao PermGuard que ficava nas rotas do App.jsx do legado. */
export function PermGuard({ perm, children }: { perm: string; children: ReactNode }) {
  const { can, loading } = usePermissions()

  if (loading) return null
  if (!can(perm)) {
    return (
      <div className="admin-page">
        <h1>Acesso negado</h1>
        <p className="admin-page-desc">Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }
  return <>{children}</>
}

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function usePermissions() {
  const { profile } = useAuth()
  const [permissions, setPermissions] = useState({})
  const [userProducts, setUserProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) { setLoading(false); return }

    async function load() {
      // Admin tem tudo
      if (profile.role === 'admin') {
        setPermissions({
          dashboard: true, comunidade: true, mentorias: true, formacoes: true,
          suporte: true, financeiro: true, produtos: true, usuarios: true, permissoes: true,
        })
      } else if (profile.group_id) {
        const { data } = await supabase.from('permission_groups').select('permissions').eq('id', profile.group_id).single()
        setPermissions(data?.permissions || getDefaultPerms(profile.role))
      } else {
        setPermissions(getDefaultPerms(profile.role))
      }

      // Carregar produtos do usuário
      const { data: prods } = await supabase
        .from('user_products')
        .select('*, products(title, slug, type, category)')
        .eq('user_id', profile.id)
        .eq('status', 'active')
      setUserProducts(prods || [])

      setLoading(false)
    }
    load()
  }, [profile])

  function can(section) {
    if (profile?.role === 'admin') return true
    if (profile?.status !== 'active') return section === 'dashboard'
    return !!permissions[section]
  }

  function isAdmin() {
    return profile?.role === 'admin'
  }

  function isStaff() {
    return profile?.role === 'admin' || profile?.role === 'mentor'
  }

  function isActive() {
    return profile?.status === 'active'
  }

  function isPending() {
    return profile?.status === 'pending'
  }

  function hasProduct(productId) {
    return userProducts.some(p => p.product_id === productId)
  }

  return { permissions, can, isAdmin, isStaff, isActive, isPending, hasProduct, userProducts, loading }
}

function getDefaultPerms(role) {
  if (role === 'mentor') {
    return { dashboard: true, comunidade: true, mentorias: true, formacoes: true, suporte: true, financeiro: false, produtos: false, usuarios: false, permissoes: false }
  }
  return { dashboard: true, comunidade: true, mentorias: true, formacoes: true, suporte: true, financeiro: true, produtos: false, usuarios: false, permissoes: false }
}

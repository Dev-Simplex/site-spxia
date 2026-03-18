import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { I18nProvider } from './i18n/context'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import usePermissions from './hooks/usePermissions'
import Site from './pages/Site'
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Comunidade from './pages/admin/Comunidade'
import Mentorias from './pages/admin/Mentorias'
import Formacoes from './pages/admin/Formacoes'
import Suporte from './pages/admin/Suporte'
import Financeiro from './pages/admin/Financeiro'
import Produtos from './pages/admin/Produtos'
import Usuarios from './pages/admin/Usuarios'
import Permissoes from './pages/admin/Permissoes'
import Checkout from './pages/Checkout'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="admin-loading-full">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PermGuard({ perm, children }) {
  const { can, loading } = usePermissions()
  if (loading) return null
  if (!can(perm)) return <div className="admin-page"><h1>Acesso negado</h1><p className="admin-page-desc">Você não tem permissão para acessar esta página.</p></div>
  return children
}

export default function App() {
  return (
    <I18nProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Site />} />
          <Route path="/checkout/:slug" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="comunidade" element={<PermGuard perm="comunidade"><Comunidade /></PermGuard>} />
            <Route path="mentorias" element={<PermGuard perm="mentorias"><Mentorias /></PermGuard>} />
            <Route path="formacoes" element={<PermGuard perm="formacoes"><Formacoes /></PermGuard>} />
            <Route path="suporte" element={<PermGuard perm="suporte"><Suporte /></PermGuard>} />
            <Route path="financeiro" element={<PermGuard perm="financeiro"><Financeiro /></PermGuard>} />
            <Route path="produtos" element={<PermGuard perm="produtos"><Produtos /></PermGuard>} />
            <Route path="usuarios" element={<PermGuard perm="usuarios"><Usuarios /></PermGuard>} />
            <Route path="permissoes" element={<PermGuard perm="permissoes"><Permissoes /></PermGuard>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </I18nProvider>
  )
}

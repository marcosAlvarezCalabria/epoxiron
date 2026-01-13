import { useAuthStore } from '@/features/auth/stores/authStore'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { label: '📋 Albaranes', path: '/delivery-notes' },
    { label: '👥 Clientes', path: '/customers' },
    { label: '💰 Tarifas', path: '/rates' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Epoxiron</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">👤 {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ✅ ¡Bienvenido al Dashboard!
          </h2>
          <p className="text-gray-600 mb-8">
            Has iniciado sesión correctamente como <strong>{user?.email.getValue()}</strong>
          </p>

          <h3 className="text-xl font-bold text-gray-800 mb-4">Menú Principal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <p className="text-lg font-semibold text-blue-700">{item.label}</p>
              </button>
            ))}
          </div>  
        </div>
      </main>
    </div>
  )
}

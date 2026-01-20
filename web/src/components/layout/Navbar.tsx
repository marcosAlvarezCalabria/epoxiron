
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/authStore'

export function Navbar() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path: string) => {
        return location.pathname.startsWith(path)
    }

    const navItems = [
        { label: 'Resumen', path: '/dashboard', icon: false },
        { label: 'Albaranes', path: '/delivery-notes', icon: false },
        { label: 'Clientes', path: '/customers', icon: false }
    ]

    return (
        <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center p-4 justify-between max-w-7xl mx-auto w-full">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 6l-8 4-8-4V4l8 4 8-4v2zM2 8l8 4v8l-8-4V8zm12 12V12l8-4v8l-8 4z" />
                        </svg>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Epoxiron</h2>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 px-4 flex-1 justify-center">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-1 font-bold text-sm transition-colors ${isActive(item.path)
                                    ? 'text-blue-500'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-2">
                    <div className="hidden sm:block text-sm text-gray-300 mr-2">
                        Hola, {user?.email?.getValue().split('@')[0]}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-10 h-10 items-center justify-center rounded-lg bg-transparent text-gray-200 hover:bg-gray-700 transition-colors"
                        title="Cerrar sesión"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex border-t border-gray-700 px-4 gap-6 bg-gray-800 overflow-x-auto">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center justify-center border-b-[3px] pb-[10px] pt-3 whitespace-nowrap transition-colors ${isActive(item.path)
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">{item.label}</p>
                    </button>
                ))}
            </div>
        </header>
    )
}

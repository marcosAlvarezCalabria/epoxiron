import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class AppErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900 text-white">
                    <div className="rounded-xl border border-red-800 bg-red-900/10 p-8 text-center max-w-md w-full">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-900/30 text-red-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold">Algo salió mal</h2>
                        <p className="mb-6 text-gray-400">
                            Ha ocurrido un error inesperado en la aplicación. Por favor, recarga la página.
                        </p>
                        {this.state.error && (
                            <div className="mb-6 bg-black/50 p-3 rounded text-left overflow-auto max-h-32 text-xs font-mono text-red-300 border border-red-900/30">
                                {this.state.error.message}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                        >
                            Recargar Página
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

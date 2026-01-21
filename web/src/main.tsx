import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query'
import { NotificationService } from './infrastructure/services/NotificationService'
import { AppErrorBoundary } from './components/ui/AppErrorBoundary'
import './index.css'
import App from './App.tsx'

// 🎓 PRÁCTICA: Domain Layer
// Ejecuta las prácticas de Domain (revisa la consola del navegador)
// import './domain/playground'



// Crear el cliente de React Query con manejo global de errores
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: any) => {
      // Show toast on mutation failure (Create, Update, Delete)
      const message = error.message || 'Error executing action'
      NotificationService.error(message)
    },
  }),
  queryCache: new QueryCache({
    onError: (error: any) => {
      // Show toast on query failure (Fetch)
      // We might filter out some errors (like 404s we handle in UI) if needed
      const message = error.message || 'Error fetching data'
      NotificationService.error(message)
    },
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>,
)

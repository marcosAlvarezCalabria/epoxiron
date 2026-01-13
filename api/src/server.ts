// 📝 IMPORTS - Traemos las herramientas que necesitamos
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import customerRoutes from './routes/customerRoutes'
import rateRoutes from './routes/rateRoutes'
import deliveryNoteRoutes from './routes/deliveryNoteRoutes'

// 📝 CONFIGURACIÓN - Cargar variables de entorno
dotenv.config()

// 📝 CREAR LA APP - 
const app = express()
const PORT = process.env.PORT || 3000

// 📝 MIDDLEWARE -
// cors() = Permite que el frontend (puerto 5173) hable con el backend (puerto 3000)
app.use(cors())

// express.json() = Lee el cuerpo de las peticiones en formato JSON
app.use(express.json())

// 📝 RUTAS -
// Todas las rutas de authRoutes estarán bajo /api/auth
app.use('/api/auth', authRoutes)

// Todas las rutas de customerRoutes estarán bajo /api/customers
app.use('/api/customers', customerRoutes)

// Todas las rutas de rateRoutes estarán bajo /api/rates
app.use('/api/rates', rateRoutes)

// Todas las rutas de deliveryNoteRoutes estarán bajo /api/delivery-notes
app.use('/api/delivery-notes', deliveryNoteRoutes)

// 📝 RUTA DE PRUEBA - Para verificar que el servidor funciona
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running okkkkkk' })
})

// 📝 INICIAR EL SERVIDOR - 
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})


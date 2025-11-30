import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


//COFIGURACION CARGA DE VARIABLES DE ENTORNO
dotenv.config();

//CREACION DEL SERVIDOR
const app = express();
const PORT = process.env.PORT || 3000;

//MIDDLEWARES
app.use(cors());
app.use(express.json());

// 📝 RUTA DE PRUEBA - Para verificar que el servidor funciona
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

//RUTAS
app.get('/', (req, res) => {
  res.send('API is running');
});


//INICIAR EL SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
});

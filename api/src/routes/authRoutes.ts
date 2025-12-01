import { Router } from 'express';
import { login } from '../controllers/authController';

// Crear el router
const router = Router();

//ruta POST /auth/login
router.post('/login', login);

// Exportar el router
export default router;
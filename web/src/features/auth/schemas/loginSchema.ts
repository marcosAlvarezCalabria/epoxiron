import { z } from 'zod'

// Schema = "molde" o "plantilla" que define cómo deben ser los datos
export const loginSchema = z.object({
  // z.object() = crear un objeto con propiedades

  email: z
    .string()                                    // Debe ser texto
    .min(1, 'Email es requerido')                // Mínimo 1 carácter
    .email('Email no es válido'),                // Formato email válido

  password: z
    .string()                                    // Debe ser texto
    .min(1, 'Contraseña es requerida')           // Mínimo 1 carácter
    .min(6, 'Contraseña debe tener al menos 6 caracteres')  // Mínimo 6
})

// TypeScript automático: extrae el tipo del schema
// Es como hacer: type LoginFormData = { email: string, password: string }
export type LoginFormData = z.infer<typeof loginSchema>

import { z } from 'zod';

/**
 * SCHEMA: Delivery Note (Blueprint / Plano)
 * 
 * 🏗️ ANALOGÍA DE CONSTRUCCIÓN:
 * Este archivo es el "Plano Aprobado" por el arquitecto.
 * Antes de construir nada (enviar datos al servidor), el inspector (Zod)
 * revisa que cada medida, material y especificación coincida con este plano.
 * Si algo no cuadra (ej: cantidad negativa, falta cliente), la obra se detiene.
 */

// Schema para un item individual (un material en la lista)
const deliveryNoteItemSchema = z.object({
    description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
    color: z.string().min(1, 'El color es obligatorio'),
    measurements: z.object({
        linearMeters: z.number().positive('Debe ser positivo').optional(),
        squareMeters: z.number().positive('Debe ser positivo').optional(),
        thickness: z.number().positive('Debe ser positivo').optional()
    }).refine(
        (data) => data.linearMeters || data.squareMeters,
        'Debes especificar metros lineales o cuadrados (una de las dos medidas)'
    ),
    quantity: z.number().int().positive('La cantidad debe ser un número positivo')
});

// Schema para el albarán completo (la hoja de pedido completa)
export const deliveryNoteSchema = z.object({
    customerId: z.string().min(1, 'Debes seleccionar un cliente'),
    date: z.string().min(1, 'La fecha es obligatoria'),
    items: z.array(deliveryNoteItemSchema).min(1, 'Debes añadir al menos un item al albarán'),
    notes: z.string().optional()
});

// Exportamos el tipo (Type) inferido del schema
// Esto es como sacar una fotocopia del plano para dársela a los constructores (TypeScript)
export type DeliveryNoteFormData = z.infer<typeof deliveryNoteSchema>;

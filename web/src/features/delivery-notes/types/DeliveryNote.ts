/**
 * TYPES: DeliveryNote - Tipos para albaranes y sus items
 */

export interface DeliveryNoteItem {
  id: string
  name: string
  quantity: number
  linearMeters?: number
  squareMeters?: number
  thickness?: number
  racColor?: string
  specialColor?: string
  unitPrice?: number
  totalPrice: number
  notes?: string
}

export interface DeliveryNote {
  id: string
  customerId: string
  status: 'draft' | 'pending' | 'reviewed'
  items: DeliveryNoteItem[]
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDeliveryNoteRequest {
  customerId: string
  items: Omit<DeliveryNoteItem, 'id'>[]
  notes?: string
}

export interface UpdateDeliveryNoteRequest {
  customerId?: string
  status?: 'draft' | 'pending' | 'reviewed'
  items?: DeliveryNoteItem[]
  notes?: string
}

/**
 * TYPES: DeliveryNote - Tipos para albaranes y sus items
 */

export interface MeasurementData {
  linearMeters?: number
  squareMeters?: number
  thickness?: number
}

export interface DeliveryNoteItem {
  id: string
  name: string // In some places used as description?
  description: string // UI uses description
  quantity: number
  color: string // UI uses color
  racColor?: string
  specialColor?: string
  measurements: MeasurementData
  unitPrice?: number
  totalPrice: number
  notes?: string
  hasPrimer?: boolean
  isHighThickness?: boolean
}

export interface DeliveryNote {
  id: string
  number?: string // Human-readable number like ALB-2026-001
  customerId: string
  customerName: string
  date: string
  status: 'draft' | 'validated' | 'finalized'
  items: DeliveryNoteItem[]
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDeliveryNoteRequest {
  customerId: string
  date: string
  items: Omit<DeliveryNoteItem, 'id'>[]
  notes?: string
}

export interface UpdateDeliveryNoteRequest {
  customerId?: string
  date?: string
  status?: 'draft' | 'validated' | 'finalized'
  items?: DeliveryNoteItem[]
  notes?: string
}

// Form Data for the Frontend Form (might differ slightly from API request)
export interface DeliveryNoteFormData {
  customerId: string
  date: string
  items: Array<{
    description: string
    color: string
    quantity: number
    measurements: MeasurementData
  }>
  notes?: string
}

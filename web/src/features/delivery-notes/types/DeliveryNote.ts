/**
 * TYPES: DeliveryNote
 *
 * Domain types for delivery note management
 */

export interface DeliveryNoteItem {
  id: string
  description: string
  color: string
  measurements: {
    linearMeters?: number
    squareMeters?: number
    thickness?: number
  }
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface DeliveryNote {
  id: string
  customerId: string
  customerName: string
  date: string
  status: 'draft' | 'pending' | 'reviewed'
  items: DeliveryNoteItem[]
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDeliveryNoteRequest {
  customerId: string
  date?: string
  items: Omit<DeliveryNoteItem, 'id' | 'unitPrice' | 'totalPrice'>[]
  notes?: string
}

export interface UpdateDeliveryNoteRequest {
  customerId?: string
  date?: string
  status?: 'draft' | 'pending' | 'reviewed'
  items?: DeliveryNoteItem[]
  notes?: string
}

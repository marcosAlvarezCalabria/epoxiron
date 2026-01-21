/**
 * DOMAIN TYPES: DeliveryNote (Albarán)
 *
 * Types for delivery notes in the epoxy coating workshop.
 * A delivery note contains items painted for a customer with calculated prices.
 *
 * Location: Backend - Types (Domain Layer)
 * Reason: Core business entity representing work done for a customer
 */

// 📦 ITEM WITHIN A DELIVERY NOTE
// Each painted piece/item in the delivery note
export interface DeliveryNoteItem {
  id: string                    // Unique item ID
  name: string                  // Item name (e.g. "Viga 5m")
  description: string           // What was painted (e.g., "Metal door", "Window frame")
  color: string                 // RAC color code (e.g., "RAL9016", "RAL7016")
  measurements: {
    linearMeters?: number       // Length in meters (e.g., 10.5)
    squareMeters?: number       // Area in square meters (e.g., 25.3)
    thickness?: number          // Coating thickness in microns (e.g., 100)
  }
  quantity: number              // Number of pieces (e.g., 5 doors)
  unitPrice: number             // Price per unit in euros (calculated from rate)
  totalPrice: number            // Total price for this item (unitPrice * quantity)
  hasPrimer?: boolean           // Whether primer (imprimación) is applied (doubles price)
  isHighThickness?: boolean     // Whether extra thickness is applied (+70% price)
}

// 📋 COMPLETE DELIVERY NOTE
// The full delivery note with all information
export interface DeliveryNote {
  id: string                    // Unique delivery note ID (internal use)
  number: string                // Human-readable number (e.g., ALB-2026-001)
  customerId: string            // Reference to the customer
  customerName: string          // Customer name (for display, cached from Customer)
  date: Date                    // Delivery note date
  status: 'draft' | 'validated' | 'finalized'  // Current status
  items: DeliveryNoteItem[]     // All items in this delivery note
  totalAmount: number           // Total amount in euros (sum of all item totals)
  notes?: string                // Optional notes or comments
  createdAt: Date               // Creation timestamp
  updatedAt: Date               // Last update timestamp
}

// ✏️ DATA TO CREATE A NEW DELIVERY NOTE
// Data needed when creating a delivery note
// Note: unitPrice and totalPrice are calculated automatically
export interface CreateDeliveryNoteRequest {
  customerId: string            // REQUIRED - which customer
  date?: Date | string          // OPTIONAL - defaults to today, accepts Date or ISO string
  items: Omit<DeliveryNoteItem, 'id' | 'unitPrice' | 'totalPrice'>[]  // Items without calculated fields
  notes?: string                // OPTIONAL - additional notes
}

// 🔄 DATA TO UPDATE AN EXISTING DELIVERY NOTE
// Data that can be modified in an existing delivery note
export interface UpdateDeliveryNoteRequest {
  customerId?: string           // OPTIONAL - can change customer
  date?: Date | string          // OPTIONAL - can change date
  status?: 'draft' | 'validated' | 'finalized'  // OPTIONAL - can change status
  items?: DeliveryNoteItem[]    // OPTIONAL - can modify items
  notes?: string                // OPTIONAL - can change notes
}

// 📊 RESPONSE TYPES
export type DeliveryNotesListResponse = DeliveryNote[]

export interface DeliveryNoteResponse {
  id: string
  number: string  // Human-readable number
  customerId: string
  customerName: string
  date: string  // ISO string format for JSON
  status: 'draft' | 'validated' | 'finalized'
  items: DeliveryNoteItem[]
  totalAmount: number
  notes?: string
  createdAt: string  // ISO string format for JSON
  updatedAt: string  // ISO string format for JSON
}

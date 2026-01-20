// 📝 WHAT: Type definitions for Customer entity
// 🎯 WHY: TypeScript needs to know the data structure
// 🔍 HOW: Define interfaces (blueprints) that describe the shape

// 🏠 COMPLETE CUSTOMER
export interface SpecialPiece {
  name: string
  price: number
}

// Like the complete blueprint of a house with all specifications
export interface Customer {
  id: string              // Unique address (like cadastral ID)
  name: string            // Customer name (e.g., "John Doe", "Metal Workshop Inc")
  email?: string          // OPTIONAL - Customer email
  phone?: string          // OPTIONAL - Customer phone
  address?: string        // OPTIONAL - Address
  notes?: string          // OPTIONAL - Notes

  // PRICING (Embedded Rate)
  pricePerLinearMeter: number
  pricePerSquareMeter: number
  minimumRate: number // Renamed from minimumPrice to minimumRate for consistency
  specialPieces: SpecialPiece[]

  createdAt: Date         // Creation date (when registered)
  updatedAt: Date         // Last modification date
}

// 📝 DATA TO CREATE A NEW CUSTOMER
// Like the form you fill when registering a new customer
export interface CreateCustomerRequest {
  name: string            // REQUIRED
  email?: string          // OPTIONAL
  phone?: string          // OPTIONAL
  address?: string        // OPTIONAL
  notes?: string          // OPTIONAL

  // PRICING (Now required directly on customer)
  pricePerLinearMeter?: number
  pricePerSquareMeter?: number
  minimumRate?: number
  specialPieces?: SpecialPiece[]
}

// ✏️ DATA TO UPDATE AN EXISTING CUSTOMER
// Like when you modify data of an existing customer
export interface UpdateCustomerRequest {
  name?: string           // OPTIONAL
  email?: string          // OPTIONAL
  phone?: string          // OPTIONAL
  address?: string        // OPTIONAL
  notes?: string          // OPTIONAL

  // PRICING
  pricePerLinearMeter?: number
  pricePerSquareMeter?: number
  minimumRate?: number
  specialPieces?: SpecialPiece[]
}

// 📋 RESPONSE WHEN LISTING CUSTOMERS
// Array of customers (list)
export type CustomersListResponse = Customer[]

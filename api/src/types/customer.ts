// 📝 WHAT: Type definitions for Customer entity
// 🎯 WHY: TypeScript needs to know the data structure
// 🔍 HOW: Define interfaces (blueprints) that describe the shape

// 🏠 COMPLETE CUSTOMER
// Like the complete blueprint of a house with all specifications
export interface Customer {
  id: string              // Unique address (like cadastral ID)
  name: string            // Customer name (e.g., "John Doe", "Metal Workshop Inc")
  email?: string          // OPTIONAL - Customer email
  phone?: string          // OPTIONAL - Customer phone
  rateId?: string         // Assigned rate (OPTIONAL - may not have one yet)
  createdAt: Date         // Creation date (when registered)
  updatedAt: Date         // Last modification date
}

// 📝 DATA TO CREATE A NEW CUSTOMER
// Like the form you fill when registering a new customer
// Only need the name at the beginning (rate is assigned later)
export interface CreateCustomerRequest {
  name: string            // REQUIRED - can't create customer without name
  email?: string          // OPTIONAL
  phone?: string          // OPTIONAL
}

// ✏️ DATA TO UPDATE AN EXISTING CUSTOMER
// Like when you modify data of an existing customer
export interface UpdateCustomerRequest {
  name?: string           // OPTIONAL - can change the name
  email?: string          // OPTIONAL
  phone?: string          // OPTIONAL
  rateId?: string         // OPTIONAL - can assign/change the rate
}

// 📋 RESPONSE WHEN LISTING CUSTOMERS
// Array of customers (list)
export type CustomersListResponse = Customer[]

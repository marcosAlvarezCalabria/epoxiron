// 📝 WHAT: Routes for Customer API endpoints
// 🎯 WHY: Define which URLs call which controller functions
// 🔍 HOW: Map HTTP methods + URLs → Controller functions

import { Router } from 'express'
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController'

// Create the router
const router = Router()

// 🏗️ ANALOGY: Routes are like the ENTRANCE SIGNS to different workshops
// Each sign says: "For this type of work, go to this workshop (controller)"

// 📋 GET /customers - List all customers
router.get('/', listCustomers)

// 🔍 GET /customers/:id - Get one customer
router.get('/:id', getCustomer)

// ➕ POST /customers - Create new customer
router.post('/', createCustomer)

// ✏️ PUT /customers/:id - Update existing customer
router.put('/:id', updateCustomer)

// 🗑️ DELETE /customers/:id - Delete customer
router.delete('/:id', deleteCustomer)

// Export the router
export default router

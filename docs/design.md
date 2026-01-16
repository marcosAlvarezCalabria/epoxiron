# /**
#  * PAGE: DailySummaryPage - Control diario de albaranes
#  * Reemplaza DashboardPage con funcionalidad de resumen diario
#  */
# 
# import { useState } from 'react'
# import { useNavigate } from 'react-router-dom'
# import { useAuthStore } from '../features/auth/stores/authStore'
# import { useDeliveryNotes } from '../features/delivery-notes/hooks/useDeliveryNotes'
# import { useCustomers } from '../features/customers/hooks/useCustomers'
# 
# export function DailySummaryPage() {
#   const { user, logout } = useAuthStore()
#   const navigate = useNavigate()
#   const { data: deliveryNotes } = useDeliveryNotes()
#   const { data: customers } = useCustomers()
# 
#   // Filtros
#   const [selectedDate, setSelectedDate] = useState(() => {
#     const today = new Date()
#     return today.toISOString().split('T')[0] // YYYY-MM-DD
#   })
#   const [selectedCustomer, setSelectedCustomer] = useState('')
#   const [selectedStatus, setSelectedStatus] = useState('')
# 
#   // Date presets
#   const getDatePreset = (preset: string) => {
#     const today = new Date()
#     switch (preset) {
#       case 'today':
#         return today.toISOString().split('T')[0]
#       case 'yesterday':
#         const yesterday = new Date(today)
#         yesterday.setDate(today.getDate() - 1)
#         return yesterday.toISOString().split('T')[0]
#       case 'week':
#         const weekStart = new Date(today)
#         weekStart.setDate(today.getDate() - today.getDay())
#         return weekStart.toISOString().split('T')[0]
#       default:
#         return selectedDate
#     }
#   }
# 
#   // Filtrar albaranes
#   const filteredNotes = deliveryNotes?.filter(note => {
#     const noteDate = note.createdAt?.split('T')[0]
#     const matchesDate = !selectedDate || noteDate === selectedDate
#     const matchesCustomer = !selectedCustomer || note.customerId === selectedCustomer
#     const matchesStatus = !selectedStatus || note.status === selectedStatus
#     
#     return matchesDate && matchesCustomer && matchesStatus
#   }) || []
# 
#   // Stats del día
#   const todayNotes = deliveryNotes?.filter(note => {
#     const today = new Date().toISOString().split('T')[0]
#     const noteDate = note.createdAt?.split('T')[0]
#     return noteDate === today
#   }) || []
# 
#   const stats = {
#     total: todayNotes.length,
#     drafts: todayNotes.filter(n => n.status === 'draft').length,
#     pending: todayNotes.filter(n => n.status === 'pending').length,
#     completed: todayNotes.filter(n => n.status === 'completed').length,
#     missingPrices: todayNotes.filter(n => n.items?.some(item => !item.price)).length
#   }
# 
#   const getCustomerName = (customerId: string) => {
#     const customer = customers?.find(c => c.id === customerId)
#     return customer?.name || 'Cliente desconocido'
#   }
# 
#   const getStatusColor = (status: string) => {
#     switch (status) {
#       case 'draft': return 'bg-gray-900/30 text-gray-400 border-gray-800/30'
#       case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800/30'
#       case 'validated': return 'bg-blue-900/30 text-blue-400 border-blue-800/30'
#       case 'completed': return 'bg-green-900/30 text-green-400 border-green-800/30'
#       default: return 'bg-gray-900/30 text-gray-400 border-gray-800/30'
#     }
#   }
# 
#   const getStatusText = (status: string) => {
#     switch (status) {
#       case 'draft': return 'Borrador'
#       case 'pending': return 'Validado'
#       case 'validated': return 'Finalizado'
#       case 'completed': return 'Correcto'
#       default: return 'Desconocido'
#     }
#   }
# 
#   const handleLogout = () => {
#     logout()
#     navigate('/login')
#   }
# 
#   const handleMarkAsCorrect = (noteId: string) => {
#     // TODO: Implementar actualización de estado
#     console.log('Marcar como correcto:', noteId)
#   }
# 
#   return (
#     <div className="bg-gray-900 font-sans text-gray-200 min-h-screen">
#       {/* Header */}
#       <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
#         <div className="flex items-center p-4 justify-between max-w-7xl mx-auto w-full">
#           {/* Logo */}
#           <div className="flex items-center gap-2">
#             <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
#               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
#                 <path d="M22 6l-8 4-8-4V4l8 4 8-4v2zM2 8l8 4v8l-8-4V8zm12 12V12l
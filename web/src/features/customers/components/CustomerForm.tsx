/**
 * COMPONENT: CustomerForm
 *
 * Simple form to create/edit customers
 * (Styles will be updated with Figma design later)
 */

import { useState } from 'react'

interface CustomerFormProps {
  initialName?: string
  onSubmit: (name: string) => void
  onCancel: () => void
  isLoading: boolean
}

export function CustomerForm({ initialName = '', onSubmit, onCancel, isLoading }: CustomerFormProps) {
  const [name, setName] = useState(initialName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length >= 2) {
      onSubmit(name.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Customer Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          minLength={2}
          required
        />
      </div>

      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  )
}

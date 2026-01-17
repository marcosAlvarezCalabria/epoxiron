/**
 * ENTITY: User
 * 
 * Represents a user with unique identity and business logic.
 * 
 * Location: Domain Layer
 * Reason: Core business entity with identity and behavior
 * Dependencies: Email (Value Object)
 */

import { Email } from '../value-objects/Email'

export type UserRole = 'admin' | 'user' | 'guest'

export interface UserProps {
  id: string
  email: Email
  name: string
  role: UserRole
}

export class User {
  private readonly _id: string
  private _email: Email
  private _name: string
  private _role: UserRole

  constructor(props: UserProps) {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('User ID no puede estar vacío')
    }

    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Nombre de usuario debe tener al menos 2 caracteres')
    }

    this._id = props.id
    this._email = props.email
    this._name = props.name.trim()
    this._role = props.role
  }

  puedeEliminarClientes(): boolean {
    return this._role === 'admin'
  }



  puedeModificarDatos(): boolean {
    return this._role !== 'guest'
  }

  esAdmin(): boolean {
    return this._role === 'admin'
  }

  cambiarEmail(nuevoEmail: Email): void {
    this._email = nuevoEmail
  }

  cambiarNombre(nuevoNombre: string): void {
    if (!nuevoNombre || nuevoNombre.trim().length < 2) {
      throw new Error('Nombre debe tener al menos 2 caracteres')
    }

    this._name = nuevoNombre.trim()
  }

  promoverAAdmin(): void {
    this._role = 'admin'
  }

  get id(): string {
    return this._id
  }

  get email(): Email {
    return this._email
  }

  get name(): string {
    return this._name
  }

  get role(): UserRole {
    return this._role
  }

  equals(other: User): boolean {
    return this._id === other._id
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      email: this._email.getValue(),
      name: this._name,
      role: this._role,
    }
  }

  static fromJSON(data: Record<string, unknown>): User {
    if (typeof data.id !== 'string' || typeof data.email !== 'string') {
      throw new Error('Datos de usuario inválidos')
    }

    return new User({
      id: data.id,
      email: new Email(data.email),
      name: data.name as string,
      role: (data.role as UserRole) || 'user',
    })
  }
}

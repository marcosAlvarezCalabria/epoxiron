/**
 * 🔴 RED PHASE: Tests for User Entity
 *
 * 📝 QUÉ: Tests que definen cómo debe comportarse la entidad User
 * 🎯 POR QUÉ: TDD - escribimos el test ANTES del código
 * 🔍 CÓMO: Definimos todas las reglas de negocio que debe cumplir
 *
 * 🏗️ ANALOGÍA: Como el inspector que define los requisitos ANTES de construir
 */

import { describe, it, expect } from 'vitest'
import { User } from '../User'
import { Email } from '../../value-objects/Email'

describe('User Entity', () => {
  // 🧪 TEST 1: Crear un user básico
  describe('Constructor', () => {
    it('should create a user with required fields', () => {
      // Given: Datos mínimos para crear un user
      const userData = {
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user' as const
      }

      // When: Creamos el user
      const user = new User(userData)

      // Then: Debe tener las propiedades correctas
      expect(user.id).toBe('123')
      expect(user.email.getValue()).toBe('juan@example.com')
      expect(user.name).toBe('Juan Pérez')
      expect(user.role).toBe('user')
    })

    it('should create an admin user', () => {
      // Given: Datos con rol admin
      const userData = {
        id: '123',
        email: new Email('admin@example.com'),
        name: 'Admin User',
        role: 'admin' as const
      }

      // When: Creamos el user
      const user = new User(userData)

      // Then: Debe ser admin
      expect(user.role).toBe('admin')
    })

    it('should create a guest user', () => {
      // Given: Datos con rol guest
      const userData = {
        id: '123',
        email: new Email('guest@example.com'),
        name: 'Guest User',
        role: 'guest' as const
      }

      // When: Creamos el user
      const user = new User(userData)

      // Then: Debe ser guest
      expect(user.role).toBe('guest')
    })

    it('should throw error if id is empty', () => {
      // Given: ID vacío
      const userData = {
        id: '',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user' as const
      }

      // When/Then: Debe lanzar error
      expect(() => new User(userData)).toThrow('User ID no puede estar vacío')
    })

    it('should throw error if id is only whitespace', () => {
      // Given: ID solo espacios
      const userData = {
        id: '   ',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user' as const
      }

      // When/Then: Debe lanzar error
      expect(() => new User(userData)).toThrow('User ID no puede estar vacío')
    })

    it('should throw error if name is empty', () => {
      // Given: Nombre vacío
      const userData = {
        id: '123',
        email: new Email('juan@example.com'),
        name: '',
        role: 'user' as const
      }

      // When/Then: Debe lanzar error
      expect(() => new User(userData)).toThrow('Nombre de usuario debe tener al menos 2 caracteres')
    })

    it('should throw error if name is too short', () => {
      // Given: Nombre de 1 carácter
      const userData = {
        id: '123',
        email: new Email('juan@example.com'),
        name: 'A',
        role: 'user' as const
      }

      // When/Then: Debe lanzar error
      expect(() => new User(userData)).toThrow('Nombre de usuario debe tener al menos 2 caracteres')
    })

    it('should trim whitespace from name', () => {
      // Given: Nombre con espacios
      const userData = {
        id: '123',
        email: new Email('juan@example.com'),
        name: '  Juan Pérez  ',
        role: 'user' as const
      }

      // When: Creamos el user
      const user = new User(userData)

      // Then: Debe eliminar espacios
      expect(user.name).toBe('Juan Pérez')
    })
  })

  // 🧪 TEST 2: Métodos de permisos
  describe('Permission Methods', () => {
    it('puedeEliminarClientes() should return true for admin', () => {
      // Given: User admin
      const user = new User({
        id: '123',
        email: new Email('admin@example.com'),
        name: 'Admin',
        role: 'admin'
      })

      // When/Then: Debe poder eliminar clientes
      expect(user.puedeEliminarClientes()).toBe(true)
    })

    it('puedeEliminarClientes() should return false for regular user', () => {
      // Given: User regular
      const user = new User({
        id: '123',
        email: new Email('user@example.com'),
        name: 'User',
        role: 'user'
      })

      // When/Then: No debe poder eliminar clientes
      expect(user.puedeEliminarClientes()).toBe(false)
    })

    it('puedeEliminarClientes() should return false for guest', () => {
      // Given: User guest
      const user = new User({
        id: '123',
        email: new Email('guest@example.com'),
        name: 'Guest',
        role: 'guest'
      })

      // When/Then: No debe poder eliminar clientes
      expect(user.puedeEliminarClientes()).toBe(false)
    })



    it('puedeModificarDatos() should return true for admin', () => {
      // Given: User admin
      const user = new User({
        id: '123',
        email: new Email('admin@example.com'),
        name: 'Admin',
        role: 'admin'
      })

      // When/Then: Debe poder modificar datos
      expect(user.puedeModificarDatos()).toBe(true)
    })

    it('puedeModificarDatos() should return true for regular user', () => {
      // Given: User regular
      const user = new User({
        id: '123',
        email: new Email('user@example.com'),
        name: 'User',
        role: 'user'
      })

      // When/Then: Debe poder modificar datos
      expect(user.puedeModificarDatos()).toBe(true)
    })

    it('puedeModificarDatos() should return false for guest', () => {
      // Given: User guest
      const user = new User({
        id: '123',
        email: new Email('guest@example.com'),
        name: 'Guest',
        role: 'guest'
      })

      // When/Then: No debe poder modificar datos
      expect(user.puedeModificarDatos()).toBe(false)
    })

    it('esAdmin() should return true for admin', () => {
      // Given: User admin
      const user = new User({
        id: '123',
        email: new Email('admin@example.com'),
        name: 'Admin',
        role: 'admin'
      })

      // When/Then: Debe ser admin
      expect(user.esAdmin()).toBe(true)
    })

    it('esAdmin() should return false for regular user', () => {
      // Given: User regular
      const user = new User({
        id: '123',
        email: new Email('user@example.com'),
        name: 'User',
        role: 'user'
      })

      // When/Then: No debe ser admin
      expect(user.esAdmin()).toBe(false)
    })

    it('esAdmin() should return false for guest', () => {
      // Given: User guest
      const user = new User({
        id: '123',
        email: new Email('guest@example.com'),
        name: 'Guest',
        role: 'guest'
      })

      // When/Then: No debe ser admin
      expect(user.esAdmin()).toBe(false)
    })
  })

  // 🧪 TEST 3: Métodos para modificar
  describe('Mutation Methods', () => {
    it('cambiarEmail() should update the email', () => {
      // Given: User existente
      const user = new User({
        id: '123',
        email: new Email('old@example.com'),
        name: 'Juan Pérez',
        role: 'user'
      })

      // When: Cambiamos el email
      const nuevoEmail = new Email('new@example.com')
      user.cambiarEmail(nuevoEmail)

      // Then: Debe tener el nuevo email
      expect(user.email.getValue()).toBe('new@example.com')
    })

    it('cambiarNombre() should update the name', () => {
      // Given: User existente
      const user = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user'
      })

      // When: Cambiamos el nombre
      user.cambiarNombre('Juan García')

      // Then: Debe tener el nuevo nombre
      expect(user.name).toBe('Juan García')
    })

    it('cambiarNombre() should throw error if new name is empty', () => {
      // Given: User existente
      const user = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user'
      })

      // When/Then: Debe lanzar error
      expect(() => user.cambiarNombre('')).toThrow('Nombre debe tener al menos 2 caracteres')
    })

    it('cambiarNombre() should throw error if new name is too short', () => {
      // Given: User existente
      const user = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user'
      })

      // When/Then: Debe lanzar error
      expect(() => user.cambiarNombre('A')).toThrow('Nombre debe tener al menos 2 caracteres')
    })

    it('cambiarNombre() should trim whitespace from new name', () => {
      // Given: User existente
      const user = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user'
      })

      // When: Cambiamos el nombre con espacios
      user.cambiarNombre('  Juan García  ')

      // Then: Debe eliminar espacios
      expect(user.name).toBe('Juan García')
    })

    it('promoverAAdmin() should change role to admin', () => {
      // Given: User regular
      const user = new User({
        id: '123',
        email: new Email('user@example.com'),
        name: 'User',
        role: 'user'
      })

      // When: Promovemos a admin
      user.promoverAAdmin()

      // Then: Debe ser admin
      expect(user.role).toBe('admin')
      expect(user.esAdmin()).toBe(true)
    })

    it('promoverAAdmin() should work for guest user', () => {
      // Given: User guest
      const user = new User({
        id: '123',
        email: new Email('guest@example.com'),
        name: 'Guest',
        role: 'guest'
      })

      // When: Promovemos a admin
      user.promoverAAdmin()

      // Then: Debe ser admin
      expect(user.role).toBe('admin')
      expect(user.esAdmin()).toBe(true)
    })
  })

  // 🧪 TEST 4: Comparación
  describe('Comparison', () => {
    it('equals() should return true for same ID', () => {
      // Given: Dos users con mismo ID
      const user1 = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user'
      })

      const user2 = new User({
        id: '123',
        email: new Email('otro@example.com'), // Diferente email, mismo ID
        name: 'Otro Nombre',
        role: 'admin'
      })

      // When/Then: Deben ser iguales (mismo ID)
      expect(user1.equals(user2)).toBe(true)
    })

    it('equals() should return false for different ID', () => {
      // Given: Dos users con diferente ID
      const user1 = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'user'
      })

      const user2 = new User({
        id: '456',
        email: new Email('juan@example.com'), // Mismo email, diferente ID
        name: 'Juan Pérez',
        role: 'user'
      })

      // When/Then: NO deben ser iguales (diferente ID)
      expect(user1.equals(user2)).toBe(false)
    })
  })

  // 🧪 TEST 5: Serialización
  describe('Serialization', () => {
    it('toJSON() should return correct JSON representation', () => {
      // Given: User existente
      const user = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'admin'
      })

      // When: Convertimos a JSON
      const json = user.toJSON()

      // Then: Debe tener la estructura correcta
      expect(json).toEqual({
        id: '123',
        email: 'juan@example.com',
        name: 'Juan Pérez',
        role: 'admin'
      })
    })

    it('fromJSON() should create user from JSON data', () => {
      // Given: Datos JSON válidos
      const jsonData = {
        id: '123',
        email: 'juan@example.com',
        name: 'Juan Pérez',
        role: 'admin'
      }

      // When: Creamos user desde JSON
      const user = User.fromJSON(jsonData)

      // Then: Debe tener las propiedades correctas
      expect(user.id).toBe('123')
      expect(user.email.getValue()).toBe('juan@example.com')
      expect(user.name).toBe('Juan Pérez')
      expect(user.role).toBe('admin')
    })

    it('fromJSON() should use default role "user" if not provided', () => {
      // Given: Datos JSON sin role
      const jsonData = {
        id: '123',
        email: 'juan@example.com',
        name: 'Juan Pérez'
      }

      // When: Creamos user desde JSON
      const user = User.fromJSON(jsonData)

      // Then: Debe tener role por defecto
      expect(user.role).toBe('user')
    })

    it('fromJSON() should throw error if id is missing', () => {
      // Given: Datos JSON sin id
      const jsonData = {
        email: 'juan@example.com',
        name: 'Juan Pérez',
        role: 'user'
      }

      // When/Then: Debe lanzar error
      expect(() => User.fromJSON(jsonData)).toThrow('Datos de usuario inválidos')
    })

    it('fromJSON() should throw error if email is missing', () => {
      // Given: Datos JSON sin email
      const jsonData = {
        id: '123',
        name: 'Juan Pérez',
        role: 'user'
      }

      // When/Then: Debe lanzar error
      expect(() => User.fromJSON(jsonData)).toThrow('Datos de usuario inválidos')
    })

    it('fromJSON() and toJSON() should be reversible', () => {
      // Given: User original
      const originalUser = new User({
        id: '123',
        email: new Email('juan@example.com'),
        name: 'Juan Pérez',
        role: 'admin'
      })

      // When: Convertimos a JSON y de vuelta
      const json = originalUser.toJSON()
      const reconstructedUser = User.fromJSON(json)

      // Then: Debe ser igual al original
      expect(reconstructedUser.id).toBe(originalUser.id)
      expect(reconstructedUser.email.getValue()).toBe(originalUser.email.getValue())
      expect(reconstructedUser.name).toBe(originalUser.name)
      expect(reconstructedUser.role).toBe(originalUser.role)
    })
  })
})

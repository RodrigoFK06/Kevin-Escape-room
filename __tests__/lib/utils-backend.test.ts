import { validateRequiredFields } from '@/lib/utils-backend'

describe('Utility Functions - utils-backend', () => {
  describe('validateRequiredFields', () => {
    it('debe validar que todos los campos requeridos estén presentes', () => {
      const data = {
        nombre: 'Juan',
        email: 'juan@example.com',
        telefono: '987654321',
      }
      const required = ['nombre', 'email', 'telefono']

      const result = validateRequiredFields(data, required)

      expect(result).toBeNull()
    })

    it('debe retornar el campo faltante', () => {
      const data = {
        nombre: 'Juan',
        email: 'juan@example.com',
      }
      const required = ['nombre', 'email', 'telefono']

      const result = validateRequiredFields(data, required)

      expect(result).toBe('telefono')
    })

    it('debe retornar el primer campo faltante si hay varios', () => {
      const data = {
        nombre: 'Juan',
      }
      const required = ['nombre', 'email', 'telefono']

      const result = validateRequiredFields(data, required)

      expect(result).toBe('email')
    })

    it('debe considerar valores vacíos como faltantes', () => {
      const data = {
        nombre: 'Juan',
        email: '',
        telefono: '987654321',
      }
      const required = ['nombre', 'email', 'telefono']

      const result = validateRequiredFields(data, required)

      expect(result).toBe('email')
    })

    it('debe considerar null como campo faltante', () => {
      const data = {
        nombre: 'Juan',
        email: null,
        telefono: '987654321',
      }
      const required = ['nombre', 'email', 'telefono']

      const result = validateRequiredFields(data, required)

      expect(result).toBe('email')
    })

    it('debe considerar undefined como campo faltante', () => {
      const data = {
        nombre: 'Juan',
        telefono: '987654321',
      }
      const required = ['nombre', 'email', 'telefono']

      const result = validateRequiredFields(data, required)

      expect(result).toBe('email')
    })
  })
})

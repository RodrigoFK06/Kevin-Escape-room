import { cn } from '@/lib/utils'

describe('Utility Functions - utils', () => {
  describe('cn (classNames utility)', () => {
    it('debe combinar clases simples', () => {
      const result = cn('text-red-500', 'font-bold')
      expect(result).toContain('text-red-500')
      expect(result).toContain('font-bold')
    })

    it('debe manejar valores condicionales', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('debe ignorar valores falsy', () => {
      const result = cn('text-red-500', false, null, undefined, '')
      expect(result).toBe('text-red-500')
    })

    it('debe fusionar clases de Tailwind con conflictos', () => {
      // tailwind-merge debe resolver conflictos
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
    })

    it('debe manejar arrays de clases', () => {
      const result = cn(['text-red-500', 'font-bold'])
      expect(result).toContain('text-red-500')
      expect(result).toContain('font-bold')
    })

    it('debe manejar objetos de clases condicionales', () => {
      const result = cn({
        'text-red-500': true,
        'text-blue-500': false,
      })
      expect(result).toContain('text-red-500')
      expect(result).not.toContain('text-blue-500')
    })
  })
})

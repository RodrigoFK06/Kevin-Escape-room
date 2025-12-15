import { DELETE } from '@/app/api/equipos/eliminar/[id]/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    equipo: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    ranking: {
      deleteMany: jest.fn(),
    },
    integrante: {
      deleteMany: jest.fn(),
    },
  },
}))

describe('API /api/equipos/eliminar/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe eliminar un equipo exitosamente', async () => {
    const mockEquipo = {
      id: 1,
      nombre: 'Team Alpha',
      codigo: 'ABC123',
      rankings: [],
      integrantes: [{ id: 1, nombre: 'Juan' }],
    }

    ;(prisma.equipo.findUnique as jest.Mock).mockResolvedValue(mockEquipo)
    ;(prisma.integrante.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })
    ;(prisma.equipo.delete as jest.Mock).mockResolvedValue(mockEquipo)

    const request = new NextRequest('http://localhost:3000/api/equipos/eliminar/1', {
      method: 'DELETE',
    })

    const params = Promise.resolve({ id: '1' })
    const response = await DELETE(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.mensaje).toContain('eliminados exitosamente')
    expect(prisma.equipo.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('debe eliminar rankings asociados antes de eliminar el equipo', async () => {
    const mockEquipo = {
      id: 1,
      nombre: 'Team Alpha',
      codigo: 'ABC123',
      rankings: [
        { id: 1, puntaje: 1000 },
        { id: 2, puntaje: 950 },
      ],
      integrantes: [],
    }

    ;(prisma.equipo.findUnique as jest.Mock).mockResolvedValue(mockEquipo)
    ;(prisma.ranking.deleteMany as jest.Mock).mockResolvedValue({ count: 2 })
    ;(prisma.integrante.deleteMany as jest.Mock).mockResolvedValue({ count: 0 })
    ;(prisma.equipo.delete as jest.Mock).mockResolvedValue(mockEquipo)

    const request = new NextRequest('http://localhost:3000/api/equipos/eliminar/1', {
      method: 'DELETE',
    })

    const params = Promise.resolve({ id: '1' })
    await DELETE(request, { params })

    expect(prisma.ranking.deleteMany).toHaveBeenCalledWith({
      where: { equipo_id: 1 },
    })
  })

  it('debe retornar error si el equipo no existe', async () => {
    ;(prisma.equipo.findUnique as jest.Mock).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/equipos/eliminar/999', {
      method: 'DELETE',
    })

    const params = Promise.resolve({ id: '999' })
    const response = await DELETE(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toContain('no existe')
  })

  it('debe manejar errores de base de datos', async () => {
    ;(prisma.equipo.findUnique as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new NextRequest('http://localhost:3000/api/equipos/eliminar/1', {
      method: 'DELETE',
    })

    const params = Promise.resolve({ id: '1' })
    const response = await DELETE(request, { params })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })
})

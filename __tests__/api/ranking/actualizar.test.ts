import { PUT } from '@/app/api/ranking/actualizar/[id]/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    ranking: {
      update: jest.fn(),
    },
  },
}))

describe('API /api/ranking/actualizar/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe actualizar un ranking exitosamente', async () => {
    const mockUpdatedRanking = {
      id: 1,
      equipo_id: 1,
      sala_id: 1,
      puntaje: 1200,
      tiempo: 40,
      cantidad_integrantes: 5,
    }

    ;(prisma.ranking.update as jest.Mock).mockResolvedValue(mockUpdatedRanking)

    const request = new NextRequest('http://localhost:3000/api/ranking/actualizar/1', {
      method: 'PUT',
      body: JSON.stringify({
        puntaje: 1200,
        tiempo: 40,
        cantidad_integrantes: 5,
      }),
    })

    const params = Promise.resolve({ id: '1' })
    const response = await PUT(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data).toHaveProperty('mensaje')
    expect(prisma.ranking.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        puntaje: 1200,
        tiempo: 40,
        cantidad_integrantes: 5,
      },
    })
  })

  it('debe validar campos requeridos', async () => {
    const request = new NextRequest('http://localhost:3000/api/ranking/actualizar/1', {
      method: 'PUT',
      body: JSON.stringify({
        puntaje: 1200,
        // Falta tiempo y cantidad_integrantes
      }),
    })

    const params = Promise.resolve({ id: '1' })
    const response = await PUT(request, { params })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data).toHaveProperty('error')
  })

  it('debe manejar errores de base de datos', async () => {
    ;(prisma.ranking.update as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    )

    const request = new NextRequest('http://localhost:3000/api/ranking/actualizar/1', {
      method: 'PUT',
      body: JSON.stringify({
        puntaje: 1200,
        tiempo: 40,
        cantidad_integrantes: 5,
      }),
    })

    const params = Promise.resolve({ id: '1' })
    const response = await PUT(request, { params })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data).toHaveProperty('error')
  })

  it('debe convertir correctamente los tipos de datos', async () => {
    ;(prisma.ranking.update as jest.Mock).mockResolvedValue({})

    const request = new NextRequest('http://localhost:3000/api/ranking/actualizar/1', {
      method: 'PUT',
      body: JSON.stringify({
        puntaje: '1200.5',
        tiempo: '40',
        cantidad_integrantes: '5',
      }),
    })

    const params = Promise.resolve({ id: '1' })
    await PUT(request, { params })

    expect(prisma.ranking.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        puntaje: 1200.5,
        tiempo: 40,
        cantidad_integrantes: 5,
      },
    })
  })
})

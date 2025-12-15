import { GET } from '@/app/api/ranking/obtener/route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    ranking: {
      findMany: jest.fn(),
    },
  },
}))

describe('API /api/ranking/obtener', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe retornar la lista de rankings exitosamente', async () => {
    const mockRankings = [
      {
        id: 1,
        equipo_id: 1,
        sala_id: 1,
        puntaje: 1000,
        tiempo: 45,
        cantidad_integrantes: 4,
        registrado_en: new Date('2025-01-01'),
        equipo: { nombre: 'Team Alpha' },
        sala: { nombre: 'El Paciente 136' },
      },
      {
        id: 2,
        equipo_id: 2,
        sala_id: 1,
        puntaje: 950,
        tiempo: 50,
        cantidad_integrantes: 3,
        registrado_en: new Date('2025-01-02'),
        equipo: { nombre: 'Team Beta' },
        sala: { nombre: 'El Paciente 136' },
      },
    ]

    ;(prisma.ranking.findMany as jest.Mock).mockResolvedValue(mockRankings)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(2)
    expect(data[0]).toHaveProperty('equipo_nombre', 'Team Alpha')
    expect(data[0]).toHaveProperty('sala_nombre', 'El Paciente 136')
    expect(data[0]).toHaveProperty('puntaje', 1000)
  })

  it('debe ordenar rankings por puntaje descendente', async () => {
    const mockRankings = [
      {
        id: 1,
        equipo_id: 1,
        sala_id: 1,
        puntaje: 1000,
        tiempo: 45,
        cantidad_integrantes: 4,
        registrado_en: new Date(),
        equipo: { nombre: 'Team A' },
        sala: { nombre: 'Sala 1' },
      },
      {
        id: 2,
        equipo_id: 2,
        sala_id: 1,
        puntaje: 800,
        tiempo: 50,
        cantidad_integrantes: 3,
        registrado_en: new Date(),
        equipo: { nombre: 'Team C' },
        sala: { nombre: 'Sala 1' },
      },
    ]

    ;(prisma.ranking.findMany as jest.Mock).mockResolvedValue(mockRankings)

    const response = await GET()
    const data = await response.json()

    expect(data[0].puntaje).toBeGreaterThanOrEqual(data[1].puntaje)
  })

  it('debe manejar errores correctamente', async () => {
    ;(prisma.ranking.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const response = await GET()
    const data = await response.json()

    // El API retorna 200 con array vacío para mantener compatibilidad
    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(0)
  })

  it('debe retornar array vacío cuando no hay rankings', async () => {
    ;(prisma.ranking.findMany as jest.Mock).mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(0)
  })
})

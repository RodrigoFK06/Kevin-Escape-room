import { fetchHorariosDisponibles } from '@/lib/api-horarios'

// Mock global fetch
global.fetch = jest.fn()

describe('API Client - api-horarios', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('debe obtener horarios disponibles exitosamente', async () => {
    const mockResponse = {
      horarios: [
        { id: 1, hora: '10:00:00' },
        { id: 2, hora: '12:00:00' },
        { id: 3, hora: '14:00:00' },
      ],
      ocupados: [2],
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await fetchHorariosDisponibles('1', '2025-12-07')

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/horarios/disponibles?sala_id=1&fecha=2025-12-07',
      expect.objectContaining({
        headers: expect.any(Object),
        cache: 'no-store',
      })
    )
    expect(result).toEqual(mockResponse)
    expect(result.horarios).toHaveLength(3)
    expect(result.ocupados).toContain(2)
  })

  it('debe retornar arrays vacíos si la respuesta no es exitosa', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const result = await fetchHorariosDisponibles('999', '2025-12-07')
    
    // La función captura el error y retorna arrays vacíos
    expect(result).toEqual({ horarios: [], ocupados: [] })
  })

  it('debe retornar arrays vacíos en caso de error de red', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(
      new Error('Network error')
    )

    const result = await fetchHorariosDisponibles('1', '2025-12-07')
    
    // La función captura el error y retorna arrays vacíos
    expect(result).toEqual({ horarios: [], ocupados: [] })
  })

  it('debe construir correctamente la URL con parámetros', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ horarios: [], ocupados: [] }),
    })

    await fetchHorariosDisponibles('3', '2025-12-25')

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/horarios/disponibles?sala_id=3&fecha=2025-12-25',
      expect.objectContaining({
        headers: expect.any(Object),
        cache: 'no-store',
      })
    )
  })
})

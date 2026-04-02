import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import supabase from '../config/supabase.js';
import app from '../app.js';

// 1. Mock do Supabase
vi.mock('../config/supabase.js', () => ({
  default: {
    from: vi.fn(),
  },
}));

// 2. Mock do Middleware de Autenticação 
vi.mock('../middleware/auth.js', () => ({
  default: (req: any, res: any, next: any) => {
    req.user = { id: 'user-123', name: 'Utilizador Teste' };
    next();
  },
}));

const mockChain = (overrides: Record<string, any> = {}) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    ...overrides,
  };
  vi.mocked(supabase.from).mockReturnValue(chain as any);
  return chain;
};

describe('Carsharing Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TESTE 1: Cálculo de CO2 (Lógica Matemática)
  it('Deve calcular corretamente a poupança de CO2 ao partilhar carro', async () => {
    const payload = { km: 100, passengers: 4, car_type: 'gasolina' };
    // Lógica: 100km * 0.21 = 21kg sozinho. 21 / 4 = 5.25kg partilhado. Poupança = 15.75kg.
    
    mockChain({
      insert: vi.fn().mockResolvedValue({ error: null })
    });

    const response = await request(app)
      .post('/carsharing/calculate') 
      .send(payload)
      .set('Authorization', 'Bearer token');

    expect(response.status).toBe(200);
    expect(response.body.co2_alone).toBe(21);
    expect(response.body.co2_shared).toBe(5.25);
    expect(response.body.saved_co2).toBe(15.75);
  });

  // TESTE 2: Listagem de Boleias (Filtro gt seats)
  it('Deve listar boleias disponíveis formatando a hora', async () => {
    const mockRides = [
      { id: 1, origin: 'Lisboa', seats: 3, time: '14:30:00', date: '2026-04-01' }
    ];

    mockChain({
        gt: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockRides, error: null })
    });

    const response = await request(app)
      .get('/carsharing/available')
      .set('Authorization', 'Bearer token');

    expect(response.status).toBe(200);
    expect(response.body[0].time).toBe('14:30'); // Verifica se o substring(0,5) funcionou
    expect(response.body[0].origin).toBe('Lisboa');
  });

  // TESTE 3: Reserva
  it('Deve reservar um lugar com sucesso decrementando os assentos', async () => {
  const chainSearch = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { seats: 2 }, error: null })
  };

  const chainUpdate = {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({ error: null }), 
    error: null
  };

  vi.mocked(supabase.from)
    .mockReturnValueOnce(chainSearch as any)  // Para o .select()
    .mockReturnValueOnce(chainUpdate as any); // Para o .update()

  const response = await request(app)
    .patch('/carsharing/book/1')
    .set('Authorization', 'Bearer token');

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Lugar reservado com sucesso!');
});


  // TESTE 4: Erro ao reservar sem lugares
  it('Deve retornar erro 400 se não houver lugares disponíveis', async () => {
    mockChain({
      single: vi.fn().mockResolvedValue({ data: { seats: 0 }, error: null })
    });

    const response = await request(app)
      .patch('/carsharing/book/1')
      .set('Authorization', 'Bearer token');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Sem lugares disponíveis');
  });
});
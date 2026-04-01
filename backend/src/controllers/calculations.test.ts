import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import supabase from '../config/supabase.js';
import app from '../app.js';

vi.mock('../config/supabase.js', () => ({
  default: {
    from: vi.fn(),
  
  auth:{signInWithPassword: vi.fn()}
  },
}));

vi.mock('../middleware/auth.js', () => ({
  default: (req, res, next) => {
    req.user = { id: '123', name: 'Test User' };
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
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(), // Adicionado para o list
    limit: vi.fn().mockReturnThis(), // Adicionado para o compare
    maybeSingle: vi.fn().mockReturnThis(), // Adicionado para o compare
    ...overrides,
  };

  vi.mocked(supabase.from).mockReturnValue(chain as any);
  return chain;
};

describe('calculations - get', () => {

  beforeEach(() => {
    vi.clearAllMocks(); 
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {user: 'ola'},
      error: null
    }as any)
  });

  it('Deve retornar a lista de cálculos de produção de CO2', async () => {
    const mockCalculations = [{ car_km: '100', flights: '4', diet: 'vegan', kwh: '50' }];
    
     vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {user: 'ola'},
      error: null
    }as any)
    
    mockChain({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCalculations, error: null })
    });

    const response = await request(app)
      .get('/calculations')
      .set('Authorization', 'Bearer token');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockCalculations);
  });


describe('calculations - insert', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Deve retornar o erro ', async () => {
    const mockCalculations = [{ car_km: '100', flights: '4', diet: 'vegan', kwh: '50' }];
    

    mockChain({
      insert: vi.fn().mockResolvedValue({ data: mockCalculations, error: null }),
    });

    const response = await request(app).post('/calculations').send({}).set('Authorization', 'Bearer token')

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Todos os campos são obrigatórios' });
    });
})
})

  

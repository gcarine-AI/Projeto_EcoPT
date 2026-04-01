import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import supabase from '../config/supabase.js';
import app from '../app.js';

vi.mock('../config/supabase.js', () => ({
  default: {
    from: vi.fn(),
  },
}));

const mockChain = (overrides: Record<string, any> = {}) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    auth: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    ...overrides,
  };

  vi.mocked(supabase.from).mockReturnValue(chain as any);
  return chain;
};

describe('calculations - get', () => {

  beforeEach(() => { mockChain({
      auth: vi.fn().mockResolvedValue({ data: {id: 1}, error: null }),
    });
    vi.clearAllMocks();
  });

  it('Deve retornar a lista de cálculos de produção de CO2', async () => {
    const mockCalculations = [{ car_km: '100', flights: '4', diet: 'vegan', kwh: '50' }];
    

    mockChain({
      select: vi.fn().mockResolvedValue({ data: mockCalculations, error: null }),
    });

    const response = await request(app).get('/calculations');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockCalculations);
    });
})

describe('calculations - insert', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Deve retornar o erro ', async () => {
    const mockCalculations = [{ car_km: '100', flights: '4', diet: 'vegan', kwh: '50' }];
    

    mockChain({
      insert: vi.fn().mockResolvedValue({ data: mockCalculations, error: null }),
    });

    const response = await request(app).post('/calculations').send({})

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({ error: 'Todos os campos são obrigatórios' });
    });
})


   /*  expect(supabase.from).toHaveBeenCalledWith('calculations');
    expect(response.status).toEqual(mockCalculations);
  });
 */
  /* it('Caso o supabase retorna um erro, deve retornar o erro', async () => {
    const responseData = { data: null, error: { message: "error" } }
    const error = new Error(responseData.error.message)
    mockChain({
      select: vi.fn().mockResolvedValue(responseData)
    });

    const response = await userService.getUsers();

    expect(supabase.from).toHaveBeenCalledWith('users');
    expect(response).toEqual(error);
  });
}); */


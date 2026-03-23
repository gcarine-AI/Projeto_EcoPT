import { calculateCO2 } from '../src/controllers/calculations.controller.js'

describe('Fórmula CO₂ — fatores portugueses', () => {
  test('dieta vegan com carro mínimo dá pegada baixa', () => {
    const result = calculateCO2(50, 0, 'vegan', 100)
    expect(result).toBeLessThan(2)
  })

  test('dieta carnívora com muitos voos dá pegada alta', () => {
    const result = calculateCO2(500, 10, 'carnivora', 500)
    expect(result).toBeGreaterThan(8)
  })

  test('resultado correto para valores conhecidos', () => {
    // carro: 200km × 52 × 0.21 / 1000 = 2.184
    // voos: 2 × 0.255 = 0.51
    // dieta omnívora: 2.5
    // energia: 200kWh × 12 × 0.233 / 1000 = 0.5592
    // total: 5.7532 → arredondado: 5.75
    const result = calculateCO2(200, 2, 'omnivora', 200)
    expect(result).toBe(5.75)
  })
})
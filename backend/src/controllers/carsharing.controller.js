import supabase from '../config/supabase.js'

// Emissões por km por tipo de carro (kgCO2/km)
const emissionFactors = {
  gasolina: 0.21,
  diesel:   0.17,
  hibrido:  0.11,
  eletrico: 0.05
}

export const calculate = async (req, res) => {
  const { km, passengers, car_type } = req.body

  if (!km || !passengers || !car_type) {
    return res.status(400).json({ error: 'km, passengers e car_type são obrigatórios' })
  }

  const factor = emissionFactors[car_type] ?? 0.21

  const co2_alone  = Math.round(km * factor * 100) / 100
  const co2_shared = Math.round((km * factor / passengers) * 100) / 100
  const saved_co2  = Math.round((co2_alone - co2_shared) * 100) / 100

  // Guardar o log no Supabase
  await supabase.from('carsharing_logs').insert({
    user_id:    req.user.id,
    km,
    passengers,
    car_type,
    co2_alone,
    co2_shared,
    saved_co2
  })

  res.json({
    co2_alone,
    co2_shared,
    saved_co2,
    message: `Ao partilhar a viagem poupas ${saved_co2} kg de CO₂`
  })
}
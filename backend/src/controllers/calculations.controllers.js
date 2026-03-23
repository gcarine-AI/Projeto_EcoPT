import supabase from '../config/supabase.js'

// Fórmula com fatores portugueses (DGEG 2023)
export const calculateCO2 = (car_km, flights, diet, kwh) => {
  const dietValues = { vegan: 0.5, vegetariana: 1.7, omnivora: 2.5, carnivora: 3.3 }
  const car    = (car_km * 52 * 0.21) / 1000
  const air    = flights * 0.255
  const food   = dietValues[diet] ?? 2.5
  const energy = (kwh * 12 * 0.233) / 1000
  return Math.round((car + air + food + energy) * 100) / 100
}

export const create = async (req, res) => {
  const { car_km, flights, diet, kwh } = req.body

  if (car_km == null || flights == null || !diet || kwh == null) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
  }

  const total_co2 = calculateCO2(car_km, flights, diet, kwh)

  const { data, error } = await supabase.from('calculations').insert({
    user_id: req.user.id, car_km, flights, diet, kwh, total_co2
  }).select().single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json(data)
}

export const list = async (req, res) => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const getOne = async (req, res) => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Cálculo não encontrado' })
  res.json(data)
}

export const update = async (req, res) => {
  const { car_km, flights, diet, kwh } = req.body
  const total_co2 = calculateCO2(car_km, flights, diet, kwh)

  const { data, error } = await supabase
    .from('calculations')
    .update({ car_km, flights, diet, kwh, total_co2 })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)  // ← segurança: só o dono pode editar
    .select().single()

  if (error || !data) return res.status(404).json({ error: 'Cálculo não encontrado' })
  res.json(data)
}

export const remove = async (req, res) => {
  const { error } = await supabase
    .from('calculations')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)  // ← segurança: só o dono pode eliminar

  if (error) return res.status(404).json({ error: 'Cálculo não encontrado' })
  res.status(204).send()
}

export const compare = async (req, res) => {
  const { data } = await supabase
    .from('calculations')
    .select('total_co2')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  res.json({
    user_total: data?.total_co2 ?? null,
    pt_average: 5.8,
    eu_average: 8.4,
    source: 'Eurostat 2022'
  })
}
import supabase from '../config/supabase.js'

export const list = async (req, res) => {
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .order('impact_kg', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

export const listByCategory = async (req, res) => {
  const { category } = req.params

  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .eq('category', category)
    .order('impact_kg', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}
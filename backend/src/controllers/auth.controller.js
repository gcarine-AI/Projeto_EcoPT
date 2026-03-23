import supabase from '../config/supabase.js'

export const register = async (req, res) => {
  const { email, password, name, role = 'personal' } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password são obrigatórios' })
  }

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return res.status(400).json({ error: error.message })

  // Criar perfil após registo
  await supabase.from('profiles').insert({
    user_id: data.user.id,
    name,
    role
  })

  res.status(201).json({ message: 'Conta criada com sucesso', user: data.user })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password são obrigatórios' })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return res.status(401).json({ error: 'Credenciais inválidas' })

  res.json({
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email
    }
  })
}
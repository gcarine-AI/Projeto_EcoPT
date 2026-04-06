import supabase from "../config/supabase.js";

export const list = async (req, res) => {
  try {
    const { category, type } = req.query;

    let query = supabase
      .from("marketplace_items")
      .select("*")
      .eq("status", "disponivel")
      .order("created_at", { ascending: false });

    if (category) query = query.eq("category", category);
    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  const { title, description, category, type, price, location } = req.body;

  if (!title || !category || !type) {
    return res
      .status(400)
      .json({ error: "título, categoria e tipo são obrigatórios" });
  }

  try {
    const { data, error } = await supabase
      .from("marketplace_items")
      .insert({
        user_id: req.user.id,
        title,
        description,
        category,
        type,
        price: type === "venda" ? price : null,
        location,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, type, price, location, status } =
    req.body;

  try {
    const { data, error } = await supabase
      .from("marketplace_items")
      .update({ title, description, category, type, price, location, status })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Item não encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("marketplace_items")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const interest = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: item, error: fetchError } = await supabase
      .from("marketplace_items")
      .select("status, user_id, title")
      .eq("id", id)
      .single();

    if (fetchError || !item)
      return res.status(404).json({ error: "Item não encontrado" });
    if (item.user_id === req.user.id)
      return res
        .status(400)
        .json({ error: "Não podes mostrar interesse no teu próprio item" });
    if (item.status !== "disponivel")
      return res.status(400).json({ error: "Item já não está disponível" });

    const { error: updateError } = await supabase
      .from("marketplace_items")
      .update({ status: "reservado" })
      .eq("id", id);

    if (updateError) throw updateError;

        const { data: profile } = await supabase
      .from('Profiles')
      .select('name')
      .eq('id', req.user.id)
      .single();

    const interestedName = profile?.name || 'Alguém';

      await supabase.from('notifications').insert({
      user_id: item.user_id,
      message: `${interestedName} mostrou interesse no teu item "${item.title}"!`,
    });

    res.json({ message: "Interesse registado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const myItems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("marketplace_items")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

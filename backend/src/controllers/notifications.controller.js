import supabase from "../config/supabase.js";

export const list = async (req, res) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const markRead = async (req, res) => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Notificações marcadas como lidas" });
};

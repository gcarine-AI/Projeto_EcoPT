import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Emissões por km por tipo de carro (kgCO2/km)
const emissionFactors = {
  gasolina: 0.21,
  diesel: 0.17,
  hibrido: 0.11,
  eletrico: 0.05,
};

export const calculate = async (req, res) => {
  const { km, passengers, car_type } = req.body;

  if (!km || !passengers || !car_type) {
    return res
      .status(400)
      .json({ error: "km, passengers e car_type são obrigatórios" });
  }

  const factor = emissionFactors[car_type] ?? 0.21;

  const co2_alone = Math.round(km * factor * 100) / 100;
  const co2_shared = Math.round(((km * factor) / passengers) * 100) / 100;
  const saved_co2 = Math.round((co2_alone - co2_shared) * 100) / 100;

  // Guardar o log no Supabase
  await supabase.from("carsharing_logs").insert({
    user_id: req.user.id,
    km,
    passengers,
    car_type,
    co2_alone,
    co2_shared,
    saved_co2,
  });

  res.json({
    co2_alone,
    co2_shared,
    saved_co2,
    message: `Ao partilhar a viagem poupas ${saved_co2} kg de CO₂`,
  });
};

export const getAvailableRides = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Available_rides")
      .select("*")
      .gt("seats", 0) // Apenas com lugares disponíveis
      .order("date", { ascending: true });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar boleias", error: error.message });
  }
};

export const bookRide = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Buscar a boleia atual
    const { data: ride, error: fetchError } = await supabase
      .from("Available_rides")
      .select("seats")
      .eq("id", id)
      .single();

    if (fetchError || !ride)
      return res.status(404).json({ message: "Boleia não encontrada" });

    if (ride.seats > 0) {
      const { error: updateError } = await supabase
        .from("Available_rides")
        .update({ seats: ride.seats - 1 })
        .eq("id", id);

      if (updateError) throw updateError;
      res.status(200).json({ message: "Lugar reservado com sucesso!" });
    } else {
      res.status(400).json({ error: "Sem lugares disponíveis" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar reserva" });
  }
};

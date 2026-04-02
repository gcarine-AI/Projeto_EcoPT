import supabase from '../config/supabase.js'

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
  if (km <= 0 || passengers <= 0) {
  return res.status(400).json({ error: "km e passengers devem ser maiores que 0" });
  }

  const factor = emissionFactors[car_type] ?? 0.21;
  if (!emissionFactors[car_type]) {
  return res.status(400).json({ error: "car_type inválido. Use: gasolina, diesel, hibrido ou eletrico" });
}
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
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("Available_rides")
      .select("*")
      .gt("seats", 0)
      .gte("date", today)
      .order("date", { ascending: true });

    if (error) throw error;
    const formattedData = data.map(ride => ({
      ...ride,
      time: ride.time ? ride.time.substring(0, 5) : '--:--' 
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar boleias", error: error.message });
  }
};

export const bookRide = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Buscar a boleia atual para saber quantos lugares tem
    const { data: ride, error: fetchError } = await supabase
      .from("Available_rides")
      .select("seats")
      .eq("id", id)
      .single();

    if (fetchError || !ride) {
      return res.status(404).json({ message: "Boleia não encontrada" });
    }

    // 2. Verificar se ainda há lugares
    if (ride.seats <= 0) {
      return res.status(400).json({ error: "Sem lugares disponíveis" });
    }

    // 3. Decrementar o lugar (seats - 1)
    const { error: updateError } = await supabase
      .from("Available_rides")
      .update({ seats: ride.seats - 1 }) // <--- O DECREMENTO ACONTECE AQUI
      .eq("id", id)
      .gt("seats", 0);

    if (updateError) throw updateError;

    // 4. Sucesso!
    return res.status(200).json({ message: "Lugar reservado com sucesso!" });

  } catch (error) {
    console.error("Erro na reserva:", error);
    return res.status(500).json({ error: "Erro ao atualizar reserva no servidor" });
  }
};



export const createRide = async (req, res) => {
  const { origin, destination, seats, cost, date, time } = req.body;

  if (!origin || !destination || !seats || !cost || !date || !time) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const driver = req.user?.name || "Utilizador Eco";

  try {
    const { data, error } = await supabase
      .from("Available_rides")
      .insert([{ driver, origin, destination, seats, cost, date, time }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Boleia criada com sucesso!", ride: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
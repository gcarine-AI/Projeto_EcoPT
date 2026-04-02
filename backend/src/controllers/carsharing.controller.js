import supabase from '../config/supabase.js';
import fetch from 'node-fetch';

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
  const userId = req.user.id;

  try {
    // 1. Buscar a boleia atual
    const { data: ride, error: fetchError } = await supabase
      .from("Available_rides")
      .select("seats, origin, destination, km")
      .eq("id", id)
      .single();

    if (fetchError || !ride) {
      return res.status(404).json({ message: "Boleia não encontrada" });
    }

    // 2. Verificar se ainda há lugares
    if (ride.seats <= 0) {
      return res.status(400).json({ error: "Sem lugares disponíveis" });
    }

    // 3. Decrementar o lugar
    const { error: updateError } = await supabase
      .from("Available_rides")
      .update({ seats: ride.seats - 1 })
      .eq("id", id)
      .gt("seats", 0);

    if (updateError) throw updateError;

     // Calcular CO2 poupado (factor gasolina por defeito: 0.21 kgCO2/km)
    const saved_co2 = ride.km
      ? Math.round(ride.km * 0.21 * 100) / 100
      : null;

    // 4. Guardar registo da reserva
    const { error: bookingError } = await supabase
      .from("ride_bookings")
      .insert({
        user_id: userId,
        ride_id: id,
        saved_co2,
      });

    if (bookingError) console.error("Erro ao guardar reserva:", bookingError.message);

    return res.status(200).json({ message: "Lugar reservado com sucesso!", saved_co2 });

  } catch (error) {
    console.error("Erro na reserva:", error);
    return res.status(500).json({ error: "Erro ao atualizar reserva no servidor" });
  }
};

// Função para calcular distância entre duas cidades via OpenRouteService
const getDistanceKm = async (origin, destination) => {
  try {
    console.log(`A calcular distância: ${origin} → ${destination}`);
    const url = `https://api.openrouteservice.org/geocode/search`;

    // Geocodificar origem
    const originRes = await fetch(
      `${url}?api_key=${process.env.ORS_API_KEY}&text=${encodeURIComponent(origin)}&size=1`
    );
    const originData = await originRes.json();
    const originCoords = originData.features[0]?.geometry?.coordinates;

    // Geocodificar destino
    const destRes = await fetch(
      `${url}?api_key=${process.env.ORS_API_KEY}&text=${encodeURIComponent(destination)}&size=1`
    );
    const destData = await destRes.json();
    const destCoords = destData.features[0]?.geometry?.coordinates;

    if (!originCoords || !destCoords) return null;

    // Calcular rota
    const routeRes = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      {
        method: 'POST',
        headers: {
          'Authorization': process.env.ORS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [originCoords, destCoords],
        }),
      }
      
    );
    const routeData = await routeRes.json();
    console.log('Resposta da rota:', JSON.stringify(routeData));
    const distanceMeters = routeData.routes[0]?.summary?.distance;
    console.log('Distância em metros:', distanceMeters);

    if (!distanceMeters) return null;

    return Math.round(distanceMeters / 1000); // Converte para km
  } catch (error) {
    console.error('Erro ao calcular distância:', error);
    return null;
  }
  
};

export const createRide = async (req, res) => {
  const { origin, destination, seats, cost, date, time } = req.body;

  if (!origin || !destination || !seats || !cost || !date || !time) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
   try {
    // Buscar o nome do utilizador na tabela Profiles
    const { data: profile } = await supabase
      .from('Profiles')
      .select('name')
      .eq('id', req.user.id)
      .single();

  const driver = profile?.name || "Utilizador Eco";

    // Calcular distância automaticamente
    const km = await getDistanceKm(origin, destination);

    const { data, error } = await supabase
      .from("Available_rides")
      .insert([{ driver, driver_id: req.user.id, origin, destination, seats, cost, date, time, km }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Boleia criada com sucesso!", ride: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


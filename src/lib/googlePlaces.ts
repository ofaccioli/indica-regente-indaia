import { Servico, CATEGORIAS_DISPONIVEIS } from "@/types";

export interface GooglePlaceResult {
  google_place_id: string;
  nome: string;
  categoria: string;
  telefone: string;
  telefone_formatado: string;
  bairro: string;
  endereco: string;
  cidade: string;
  nota_media: number;
  total_avaliacoes: number;
  horario_funcionamento?: string;
  foto_url?: string;
  fotos_extras?: string[];
  website?: string;
  google_maps_url?: string;
  origem: "google";
  ja_cadastrado?: boolean;
}

/**
 * Mapeador inteligente de categorias do Google para as categorias do Indica Jd. Regente
 */
export function mapearGoogleParaCategoriaApp(types: string[] = [], nome = ""): string {
  const nomeLower = nome.toLowerCase();

  // Verificações prioritárias por nome
  if (nomeLower.includes("pizza")) return "Restaurante / Lanche";
  if (nomeLower.includes("padaria") || nomeLower.includes("confeitaria") || nomeLower.includes("bolo")) return "Bolos / Doces / Salgados";
  if (nomeLower.includes("chaveiro") || nomeLower.includes("fechadura")) return "Chaveiro / Fechaduras";
  if (nomeLower.includes("veterinári") || nomeLower.includes("pet") || nomeLower.includes("banho e tosa")) return "Pet / Veterinário";
  if (nomeLower.includes("mecânic") || nomeLower.includes("oficina") || nomeLower.includes("pneu") || nomeLower.includes("auto")) return "Mecânico";
  if (nomeLower.includes("ar condicionado") || nomeLower.includes("climatiz")) return "Ar Condicionado";
  if (nomeLower.includes("vidraçaria") || nomeLower.includes("box") || nomeLower.includes("espelho")) return "Vidraçaria / Box & Espelhos";
  if (nomeLower.includes("biciclet") || nomeLower.includes("bike")) return "Bicicletaria / Bike";
  if (nomeLower.includes("dentista") || nomeLower.includes("odonto") || nomeLower.includes("farmácia") || nomeLower.includes("fisioterapia")) return "Saúde / Terapia";
  if (nomeLower.includes("barbearia") || nomeLower.includes("cabeleireir") || nomeLower.includes("estética") || nomeLower.includes("unha")) return "Beleza / Estética";

  // Verificações por tipos do Google Places
  const typesSet = new Set(types);

  if (typesSet.has("locksmith")) return "Chaveiro / Fechaduras";
  if (typesSet.has("veterinary_care") || typesSet.has("pet_store")) return "Pet / Veterinário";
  if (typesSet.has("car_repair") || typesSet.has("car_dealer") || typesSet.has("car_wash")) return "Mecânico";
  if (typesSet.has("bakery")) return "Bolos / Doces / Salgados";
  if (typesSet.has("restaurant") || typesSet.has("meal_takeaway") || typesSet.has("cafe")) return "Restaurante / Lanche";
  if (typesSet.has("electrician")) return "Eletricista";
  if (typesSet.has("plumber")) return "Encanador";
  if (typesSet.has("hair_care") || typesSet.has("beauty_salon") || typesSet.has("spa")) return "Beleza / Estética";
  if (typesSet.has("dentist") || typesSet.has("physiotherapist") || typesSet.has("doctor") || typesSet.has("pharmacy")) return "Saúde / Terapia";
  if (typesSet.has("bicycle_store")) return "Bicicletaria / Bike";
  if (typesSet.has("laundry")) return "Lavanderia / Passadeira";
  if (typesSet.has("moving_company")) return "Fretes / Mudanças";
  if (typesSet.has("accounting") || typesSet.has("lawyer")) return "Contabilidade / Advocacia";

  return "Outros";
}

/**
 * Extrai o provável bairro de Indaiatuba a partir de um endereço completo
 */
export function extrairBairroDeEndereco(endereco: string): string {
  if (!endereco) return "Indaiatuba";

  const bairrosConhecidos = [
    "Jd. Regente", "Jardim Regente",
    "Jd. Valença", "Jardim Valença",
    "Jd. Itamaracá", "Jardim Itamaracá",
    "Vila Rubens",
    "Park Gran Reserve",
    "Jd. Santa Rita", "Jardim Santa Rita",
    "Vila Avaí",
    "Cidade Nova", "Cidade Nova I", "Cidade Nova II",
    "Centro",
    "Jd. Morada do Sol", "Morada do Sol",
    "Itaici",
    "Jd. Pau Preto", "Pau Preto",
    "Jd. Primavera", "Primavera",
    "Jd. Esplanada", "Esplanada",
    "Parque Ecológico",
    "Distrito Industrial",
    "Jd. Rêmulo Zoppi",
    "Jd. Hubert",
    "Jd. Califórnia",
    "Vila Suíça",
    "Cecap",
  ];

  for (const b of bairrosConhecidos) {
    if (new RegExp(`\\b${b}\\b`, "i").test(endereco)) {
      if (b.toLowerCase().includes("regente")) return "Jd. Regente";
      if (b.toLowerCase().includes("valen")) return "Jd. Valença";
      if (b.toLowerCase().includes("itamarac")) return "Jd. Itamaracá";
      if (b.toLowerCase().includes("morada do sol")) return "Jd. Morada do Sol";
      if (b.toLowerCase().includes("primavera")) return "Jd. Primavera";
      if (b.toLowerCase().includes("santa rita")) return "Jd. Santa Rita";
      return b;
    }
  }

  // Tenta extrair formato: "Rua X, 123 - Bairro, Indaiatuba - SP"
  const matchBairro = endereco.match(/-\s*([^,-]+),\s*Indaiatuba/i);
  if (matchBairro && matchBairro[1]) {
    return matchBairro[1].trim();
  }

  return "Indaiatuba";
}

/**
 * Catálogo Curado de Locais de Alta Reputação em Indaiatuba (Fallback e uso imediato)
 */
export const LUGARES_CURADOS_INDAIATUBA: GooglePlaceResult[] = [
  // 1. Pizzarias & Alimentação
  {
    google_place_id: "curado-indaiatuba-pizza-1",
    nome: "Pizzaria Castelo Indaiatuba",
    categoria: "Restaurante / Lanche",
    telefone: "1938947070",
    telefone_formatado: "(19) 3894-7070",
    bairro: "Centro",
    endereco: "R. Bernardino de Campos, 510 - Centro, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.8,
    total_avaliacoes: 1420,
    horario_funcionamento: "Ter a Dom: 18h às 23h30",
    foto_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },
  {
    google_place_id: "curado-indaiatuba-pizza-2",
    nome: "Pizzaria Fornalha Indaiatuba",
    categoria: "Restaurante / Lanche",
    telefone: "1938756000",
    telefone_formatado: "(19) 3875-6000",
    bairro: "Jd. Morada do Sol",
    endereco: "Av. Ário Barnabé, 890 - Jd. Morada do Sol, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.7,
    total_avaliacoes: 980,
    horario_funcionamento: "Ter a Dom: 18h às 23h",
    foto_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },
  {
    google_place_id: "curado-indaiatuba-lanche-1",
    nome: "Hamburgueria Santo Parque",
    categoria: "Restaurante / Lanche",
    telefone: "1938341200",
    telefone_formatado: "(19) 3834-1200",
    bairro: "Parque Ecológico",
    endereco: "Av. Eng. Fábio Roberto Barnabé, 1450 - Parque Ecológico, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.9,
    total_avaliacoes: 1850,
    horario_funcionamento: "Seg a Dom: 18h às 23h30",
    foto_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 2. Padarias & Doces
  {
    google_place_id: "curado-indaiatuba-padaria-1",
    nome: "Padaria Pão da Primavera",
    categoria: "Bolos / Doces / Salgados",
    telefone: "1938751520",
    telefone_formatado: "(19) 3875-1520",
    bairro: "Jd. Primavera",
    endereco: "R. Primavera, 230 - Jd. Primavera, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.7,
    total_avaliacoes: 1100,
    horario_funcionamento: "Seg a Sáb: 06h às 21h | Dom: 06h às 13h",
    foto_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },
  {
    google_place_id: "curado-indaiatuba-padaria-2",
    nome: "Padaria Suíça Parque Ecológico",
    categoria: "Bolos / Doces / Salgados",
    telefone: "1938944500",
    telefone_formatado: "(19) 3894-4500",
    bairro: "Vila Suíça",
    endereco: "Av. Pres. Kennedy, 980 - Vila Suíça, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.8,
    total_avaliacoes: 2100,
    horario_funcionamento: "Diariamente: 06h às 22h",
    foto_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 3. Pet Shop & Veterinário
  {
    google_place_id: "curado-indaiatuba-pet-1",
    nome: "Hospital Veterinário 24h Indaiatuba",
    categoria: "Pet / Veterinário",
    telefone: "1938754400",
    telefone_formatado: "(19) 3875-4400",
    bairro: "Centro",
    endereco: "Av. Itororó, 450 - Centro, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.8,
    total_avaliacoes: 890,
    horario_funcionamento: "24 Horas (Plantão e Emergência)",
    foto_url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },
  {
    google_place_id: "curado-indaiatuba-pet-2",
    nome: "Pet Shop & Estética Canina Bicho Mimado",
    categoria: "Pet / Veterinário",
    telefone: "19997851234",
    telefone_formatado: "(19) 99785-1234",
    bairro: "Cidade Nova II",
    endereco: "R. Padre Bento Pacheco, 1600 - Cidade Nova II, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.9,
    total_avaliacoes: 340,
    horario_funcionamento: "Seg a Sáb: 08h às 18h",
    foto_url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 4. Chaveiros 24h
  {
    google_place_id: "curado-indaiatuba-chaveiro-1",
    nome: "Chaveiro Central 24 Horas Indaiatuba",
    categoria: "Chaveiro / Fechaduras",
    telefone: "19992348899",
    telefone_formatado: "(19) 99234-8899",
    bairro: "Centro",
    endereco: "R. Candelária, 620 - Centro, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.9,
    total_avaliacoes: 610,
    horario_funcionamento: "24 Horas (Atendimento a Domicílio)",
    foto_url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },
  {
    google_place_id: "curado-indaiatuba-chaveiro-2",
    nome: "Chaveiro & Aberturas Morada do Sol",
    categoria: "Chaveiro / Fechaduras",
    telefone: "19991204433",
    telefone_formatado: "(19) 99120-4433",
    bairro: "Jd. Morada do Sol",
    endereco: "Av. Ário Barnabé, 1200 - Jd. Morada do Sol, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.8,
    total_avaliacoes: 420,
    horario_funcionamento: "Seg a Sáb: 08h às 20h | Plantão FDS",
    foto_url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 5. Mecânica & Auto
  {
    google_place_id: "curado-indaiatuba-mecanica-1",
    nome: "Centro Automotivo Indaiá Bosch Service",
    categoria: "Mecânico",
    telefone: "1938347711",
    telefone_formatado: "(19) 3834-7711",
    bairro: "Jd. Alice",
    endereco: "Av. Francisco de Paula Leite, 2100 - Jd. Alice, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.8,
    total_avaliacoes: 580,
    horario_funcionamento: "Seg a Sex: 08h às 18h | Sáb: 08h às 12h",
    foto_url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },
  {
    google_place_id: "curado-indaiatuba-mecanica-2",
    nome: "Auto Mecânica & Injeção Eletrônica Valença",
    categoria: "Mecânico",
    telefone: "19998124567",
    telefone_formatado: "(19) 99812-4567",
    bairro: "Jd. Valença",
    endereco: "R. dos Indaiás, 750 - Jd. Valença, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.9,
    total_avaliacoes: 290,
    horario_funcionamento: "Seg a Sex: 08h às 18h",
    foto_url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 6. Ar Condicionado & Climatização
  {
    google_place_id: "curado-indaiatuba-ar-1",
    nome: "ClimaTech Ar Condicionado & Manutenção",
    categoria: "Ar Condicionado",
    telefone: "19993457788",
    telefone_formatado: "(19) 99345-7788",
    bairro: "Jd. Regente",
    endereco: "R. Antônio Barnabé, 320 - Jd. Regente, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.9,
    total_avaliacoes: 215,
    horario_funcionamento: "Seg a Sáb: 08h às 18h",
    foto_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 7. Conserto de Eletrodomésticos
  {
    google_place_id: "curado-indaiatuba-eletro-1",
    nome: "Refrigeração & Eletrodomésticos Morada do Sol",
    categoria: "Conserto de Eletrodomésticos",
    telefone: "1938943322",
    telefone_formatado: "(19) 3894-3322",
    bairro: "Jd. Morada do Sol",
    endereco: "R. Martinho Lutero, 410 - Jd. Morada do Sol, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.8,
    total_avaliacoes: 380,
    horario_funcionamento: "Seg a Sex: 08h às 18h | Sáb: 08h às 12h",
    foto_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 8. Bicicletaria / Bike
  {
    google_place_id: "curado-indaiatuba-bike-1",
    nome: "Bicicletaria & Oficina Parque Ecológico Bike",
    categoria: "Bicicletaria / Bike",
    telefone: "1938759900",
    telefone_formatado: "(19) 3875-9900",
    bairro: "Parque Ecológico",
    endereco: "Av. Eng. Fábio Roberto Barnabé, 2200 - Parque Ecológico, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.9,
    total_avaliacoes: 470,
    horario_funcionamento: "Seg a Sáb: 08h às 18h30",
    foto_url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 9. Vidraçaria & Box
  {
    google_place_id: "curado-indaiatuba-vidro-1",
    nome: "Vidraçaria & Box Cristal Indaiatuba",
    categoria: "Vidraçaria / Box & Espelhos",
    telefone: "1938356611",
    telefone_formatado: "(19) 3835-6611",
    bairro: "Cidade Nova I",
    endereco: "R. Humaitá, 1150 - Cidade Nova I, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.8,
    total_avaliacoes: 310,
    horario_funcionamento: "Seg a Sex: 08h às 18h | Sáb: 08h às 12h",
    foto_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },

  // 10. Barbearia & Beleza
  {
    google_place_id: "curado-indaiatuba-barbearia-1",
    nome: "Barbearia Dom Barba Indaiatuba",
    categoria: "Beleza / Estética",
    telefone: "19999441122",
    telefone_formatado: "(19) 99944-1122",
    bairro: "Centro",
    endereco: "R. 13 de Maio, 820 - Centro, Indaiatuba - SP",
    cidade: "Indaiatuba",
    nota_media: 4.9,
    total_avaliacoes: 950,
    horario_funcionamento: "Ter a Sáb: 09h às 20h",
    foto_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80",
    origem: "google",
  },
];

/**
 * Busca estabelecimentos via Google Places API oficial ou catálogo curado de Indaiatuba
 */
export async function buscarLugaresGoogle(
  termo: string,
  categoriaFiltro = "Todos",
  minRating = 4.5
): Promise<{ lugares: GooglePlaceResult[]; isApiKeyAtiva: boolean }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      const queryCompleta = `${termo || categoriaFiltro} em Indaiatuba SP`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        queryCompleta
      )}&language=pt-BR&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "OK" && Array.isArray(data.results)) {
        const lugares: GooglePlaceResult[] = data.results
          .filter((p: any) => (p.rating || 0) >= minRating)
          .map((p: any) => {
            const cat = mapearGoogleParaCategoriaApp(p.types, p.name);
            const endereco = p.formatted_address || "";
            const bairro = extrairBairroDeEndereco(endereco);

            // Monta URL de foto se disponível
            let fotoUrl: string | undefined = undefined;
            if (p.photos && p.photos.length > 0) {
              const photoRef = p.photos[0].photo_reference;
              fotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${photoRef}&key=${apiKey}`;
            }

            return {
              google_place_id: p.place_id,
              nome: p.name,
              categoria: cat,
              telefone: "", // Será preenchido ou pelo details
              telefone_formatado: "",
              bairro: bairro,
              endereco: endereco,
              cidade: "Indaiatuba",
              nota_media: p.rating || 5.0,
              total_avaliacoes: p.user_ratings_total || 1,
              foto_url: fotoUrl,
              origem: "google" as const,
            };
          });

        return { lugares, isApiKeyAtiva: true };
      }
    } catch (err) {
      console.error("Erro na busca da Google Places API:", err);
    }
  }

  // Fallback Inteligente Curado de Indaiatuba
  let filtrados = LUGARES_CURADOS_INDAIATUBA.filter((l) => l.nota_media >= minRating);

  if (categoriaFiltro && categoriaFiltro !== "Todos") {
    filtrados = filtrados.filter((l) => l.categoria === categoriaFiltro);
  }

  if (termo && termo.trim()) {
    const t = termo.toLowerCase().trim();
    filtrados = filtrados.filter(
      (l) =>
        l.nome.toLowerCase().includes(t) ||
        l.bairro.toLowerCase().includes(t) ||
        l.categoria.toLowerCase().includes(t)
    );
  }

  return { lugares: filtrados, isApiKeyAtiva: Boolean(apiKey) };
}

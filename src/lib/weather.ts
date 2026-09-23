/**
 * Serviço de Previsão do Tempo para o Jardim Regente • Indaiatuba - SP
 * Utiliza a API pública e gratuita Open-Meteo (Sem necessidade de chave)
 * Coordenadas do Jd. Regente: Lat -23.1044, Lng -47.2081
 */

export interface PrevisaoDia {
  data: string;
  diaSemana: string;
  tempMax: number;
  tempMin: number;
  probabilidadeChuva: number;
  codigoClima: number;
  descricao: string;
  icone: string;
}

export interface ClimaAtual {
  temperatura: number;
  sensacaoTermica: number;
  umidade: number;
  ventoKmH: number;
  probabilidadeChuvaHoje: number;
  tempMaxHoje: number;
  tempMinHoje: number;
  codigoClima: number;
  descricao: string;
  icone: string;
  dicaBairro: string;
  proximosDias: PrevisaoDia[];
  atualizadoEm: string;
}

export function decodificarCodigoClima(code: number): { descricao: string; icone: string } {
  switch (code) {
    case 0:
      return { descricao: "Céu Limpo", icone: "☀️" };
    case 1:
      return { descricao: "Predomínio de Sol", icone: "🌤️" };
    case 2:
      return { descricao: "Parcialmente Nublado", icone: "⛅" };
    case 3:
      return { descricao: "Nublado", icone: "☁️" };
    case 45:
    case 48:
      return { descricao: "Nevoeiro / Neblina", icone: "🌫️" };
    case 51:
    case 53:
    case 55:
      return { descricao: "Garoa / Chuvisco Fraco", icone: "🌦️" };
    case 61:
    case 63:
      return { descricao: "Chuva Fraca a Moderada", icone: "🌧️" };
    case 65:
      return { descricao: "Chuva Forte", icone: "🌧️" };
    case 80:
    case 81:
    case 82:
      return { descricao: "Pancadas de Chuva", icone: "🌦️" };
    case 95:
    case 96:
    case 99:
      return { descricao: "Temporal com Trovoadas", icone: "⛈️" };
    default:
      return { descricao: "Tempo Estável", icone: "🌤️" };
  }
}

let cacheClima: { dados: ClimaAtual; expiraEm: number } | null = null;

export async function obterPrevisaoTempoJdRegente(): Promise<ClimaAtual | null> {
  const agora = Date.now();
  if (cacheClima && cacheClima.expiraEm > agora) {
    return cacheClima.dados;
  }

  try {
    const lat = -23.1044;
    const lng = -47.2081;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FSao_Paulo`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.current || !data.daily) return null;

    const current = data.current;
    const daily = data.daily;

    const climaInfo = decodificarCodigoClima(current.weather_code);
    const probChuvaHoje = daily.precipitation_probability_max?.[0] || 0;
    const tempMaxHoje = Math.round(daily.temperature_2m_max?.[0] || current.temperature_2m + 3);
    const tempMinHoje = Math.round(daily.temperature_2m_min?.[0] || current.temperature_2m - 4);

    // Gera dica contextual da vizinhança
    let dicaBairro = "🌤️ Clima favorável para realizar serviços e passear pelo bairro!";
    if (probChuvaHoje >= 60 || current.weather_code >= 61) {
      dicaBairro = "☔ Chance de chuva alta hoje no Jd. Regente! Cuidado com o varal e evite podas ou pinturas externas.";
    } else if (current.temperature_2m >= 31) {
      dicaBairro = "☀️ Dia bem quente! Beba bastante água, atenção redobrada com pets no asfalto quente.";
    } else if (current.temperature_2m <= 15) {
      dicaBairro = "🧣 Friozinho no bairro! Dia gostoso para um café, sopa ou pedir uma pizza à noite.";
    }

    // Próximos dias
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const proximosDias: PrevisaoDia[] = [];

    const datas = daily.time || [];
    for (let i = 1; i < Math.min(datas.length, 6); i++) {
      const d = new Date(datas[i] + "T12:00:00");
      const code = daily.weather_code?.[i] || 0;
      const cInfo = decodificarCodigoClima(code);

      proximosDias.push({
        data: datas[i],
        diaSemana: diasSemana[d.getDay()],
        tempMax: Math.round(daily.temperature_2m_max?.[i] || 25),
        tempMin: Math.round(daily.temperature_2m_min?.[i] || 18),
        probabilidadeChuva: daily.precipitation_probability_max?.[i] || 0,
        codigoClima: code,
        descricao: cInfo.descricao,
        icone: cInfo.icone,
      });
    }

    const resultado: ClimaAtual = {
      temperatura: Math.round(current.temperature_2m),
      sensacaoTermica: Math.round(current.apparent_temperature),
      umidade: current.relative_humidity_2m,
      ventoKmH: Math.round(current.wind_speed_10m),
      probabilidadeChuvaHoje: probChuvaHoje,
      tempMaxHoje,
      tempMinHoje,
      codigoClima: current.weather_code,
      descricao: climaInfo.descricao,
      icone: climaInfo.icone,
      dicaBairro,
      proximosDias,
      atualizadoEm: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    // Salva em cache por 15 minutos
    cacheClima = {
      dados: resultado,
      expiraEm: agora + 15 * 60 * 1000,
    };

    return resultado;
  } catch (err) {
    console.error("Erro ao obter clima:", err);
    return null;
  }
}

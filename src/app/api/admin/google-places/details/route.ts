import { NextResponse } from "next/server";
import { isRequisicaoAdmin } from "@/lib/admin-auth";
import {
  extrairBairroDeEndereco,
  mapearGoogleParaCategoriaApp,
  resolverLinkGoogleMaps,
} from "@/lib/googlePlaces";

export async function POST(request: Request) {
  const autenticado = await isRequisicaoAdmin();
  if (!autenticado) {
    return NextResponse.json({ sucesso: false, erro: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, nomeQuery } = body;

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    let nomeExtraido = nomeQuery || "";

    // Se passou URL do Google Maps, tenta resolver o redirect para pegar o nome
    if (url && (url.includes("google.com/maps") || url.includes("goo.gl"))) {
      try {
        const headRes = await fetch(url, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        const finalUrl = headRes.url || url;

        // Tenta extrair nome do path: /maps/place/Nome+Do+Lugar/...
        const matchPlace = finalUrl.match(/\/maps\/place\/([^/@?]+)/);
        if (matchPlace && matchPlace[1]) {
          nomeExtraido = decodeURIComponent(matchPlace[1].replace(/\+/g, " "));
        }
      } catch (err) {
        console.error("Erro ao resolver URL do Maps:", err);
      }
    }

    if (!nomeExtraido && !url) {
      return NextResponse.json(
        { sucesso: false, erro: "Informe um link ou nome do local no Google Maps" },
        { status: 400 }
      );
    }

    // 1. Se temos a API key oficial do Google Places
    if (apiKey) {
      try {
        const query = `${nomeExtraido || url} Indaiatuba SP`;
        const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
          query
        )}&inputtype=textquery&fields=place_id,name,formatted_address,rating,user_ratings_total,types,photos&key=${apiKey}`;

        const findRes = await fetch(findUrl);
        const findData = await findRes.json();

        if (findData.candidates && findData.candidates.length > 0) {
          const candidate = findData.candidates[0];
          const placeId = candidate.place_id;

          // Busca detalhes completos com telefone e horários
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,international_phone_number,rating,user_ratings_total,opening_hours,photos,types,website,url&language=pt-BR&key=${apiKey}`;
          const detRes = await fetch(detailsUrl);
          const detData = await detRes.json();

          if (detData.result) {
            const p = detData.result;
            const endereco = p.formatted_address || candidate.formatted_address || "";
            const cat = mapearGoogleParaCategoriaApp(p.types || candidate.types, p.name);

            let fotoUrl: string | undefined = undefined;
            if (p.photos && p.photos.length > 0) {
              fotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${p.photos[0].photo_reference}&key=${apiKey}`;
            }

            const horarios = p.opening_hours?.weekday_text?.join(" | ") || "";

            return NextResponse.json({
              sucesso: true,
              lugar: {
                google_place_id: placeId,
                nome: p.name,
                categoria: cat,
                telefone: p.formatted_phone_number || "",
                telefone_numeros: (p.formatted_phone_number || "").replace(/\D/g, ""),
                bairro: extrairBairroDeEndereco(endereco),
                endereco: endereco,
                cidade: "Indaiatuba",
                nota_media: p.rating || 5.0,
                total_avaliacoes: p.user_ratings_total || 1,
                horario_funcionamento: horarios,
                foto_url: fotoUrl,
                website: p.website || p.url,
                origem: "google",
              },
            });
          }
        }
      } catch (err) {
        console.error("Erro ao puxar detalhes da API:", err);
      }
    }

    // 2. Inteligência Web e Extração Direta de Dados do Link / Nome (Garante telefone, fotos e endereço)
    const lugarResolvido = await resolverLinkGoogleMaps(url || nomeExtraido);

    return NextResponse.json({
      sucesso: true,
      lugar: lugarResolvido,
    });
  } catch (error) {
    console.error("Erro nos detalhes do Google Places:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro ao consultar dados no Google" },
      { status: 500 }
    );
  }
}

/**
 * Dicionário inteligente de sinônimos, problemas e termos populares
 * Mapeia termos coloquiais de moradores diretamente para suas categorias profissionais.
 */
export const SINONIMOS_BUSCA: Record<string, string[]> = {
  // Elétrica
  chuveiro: ["Eletricista"],
  tomada: ["Eletricista"],
  disjuntor: ["Eletricista"],
  fiação: ["Eletricista"],
  fiacao: ["Eletricista"],
  curto: ["Eletricista"],
  luz: ["Eletricista"],
  ventilador: ["Eletricista"],
  led: ["Eletricista"],
  lustre: ["Eletricista"],

  // Hidráulica
  vazamento: ["Encanador"],
  cano: ["Encanador"],
  torneira: ["Encanador"],
  infiltração: ["Encanador"],
  infiltracao: ["Encanador"],
  pia: ["Encanador"],
  ralo: ["Encanador"],
  "caixa d'água": ["Encanador"],
  caixa: ["Encanador"],
  esgoto: ["Encanador", "Desentupidora / Fossa"],
  sifão: ["Encanador"],
  sifao: ["Encanador"],
  registro: ["Encanador"],
  descarga: ["Encanador"],

  // Limpeza
  faxina: ["Diarista / Limpeza"],
  faxineira: ["Diarista / Limpeza"],
  passadeira: ["Diarista / Limpeza", "Lavanderia / Passadeira"],
  passar: ["Diarista / Limpeza", "Lavanderia / Passadeira"],
  lavar: ["Diarista / Limpeza", "Lavanderia / Passadeira"],
  lavadeira: ["Lavanderia / Passadeira"],

  // Transporte & Carretos
  carreto: ["Fretes / Mudanças"],
  mudança: ["Fretes / Mudanças"],
  mudanca: ["Fretes / Mudanças"],
  entulho: ["Fretes / Mudanças"],
  caçamba: ["Fretes / Mudanças"],
  frete: ["Fretes / Mudanças"],
  táxi: ["Uber / Táxi / Motorista"],
  taxi: ["Uber / Táxi / Motorista"],
  uber: ["Uber / Táxi / Motorista"],
  corrida: ["Uber / Táxi / Motorista"],
  motorista: ["Uber / Táxi / Motorista"],
  viracopos: ["Uber / Táxi / Motorista"],
  aeroporto: ["Uber / Táxi / Motorista"],
  carona: ["Uber / Táxi / Motorista"],

  // Festas, Buffet & Doces
  churrasco: ["Churrasqueiro"],
  churrasqueira: ["Churrasqueiro"],
  carne: ["Churrasqueiro"],
  espetinho: ["Churrasqueiro"],
  festa: ["Buffet / Festas & Eventos", "Churrasqueiro", "Bolos / Doces / Salgados"],
  aniversário: ["Buffet / Festas & Eventos", "Bolos / Doces / Salgados"],
  aniversario: ["Buffet / Festas & Eventos", "Bolos / Doces / Salgados"],
  bolo: ["Bolos / Doces / Salgados"],
  bolos: ["Bolos / Doces / Salgados"],
  doce: ["Bolos / Doces / Salgados"],
  doces: ["Bolos / Doces / Salgados"],
  docinho: ["Bolos / Doces / Salgados"],
  salgado: ["Bolos / Doces / Salgados"],
  salgadinho: ["Bolos / Doces / Salgados"],
  salgadinhos: ["Bolos / Doces / Salgados"],
  casamento: ["Buffet / Festas & Eventos", "Fotografia / Filmagem"],
  garçom: ["Buffet / Festas & Eventos"],
  garcom: ["Buffet / Festas & Eventos"],
  buffet: ["Buffet / Festas & Eventos"],

  // Jardim & Piscina
  grama: ["Jardinagem / Piscina"],
  poda: ["Jardinagem / Piscina"],
  podar: ["Jardinagem / Piscina"],
  árvore: ["Jardinagem / Piscina"],
  arvore: ["Jardinagem / Piscina"],
  piscina: ["Jardinagem / Piscina"],
  cloro: ["Jardinagem / Piscina"],
  limpar: ["Jardinagem / Piscina", "Diarista / Limpeza"],

  // Vidros, Chaves & Serralheria
  chave: ["Chaveiro / Fechaduras"],
  chaveiro: ["Chaveiro / Fechaduras"],
  tranca: ["Chaveiro / Fechaduras"],
  fechadura: ["Chaveiro / Fechaduras"],
  abrir: ["Chaveiro / Fechaduras"],
  cópia: ["Chaveiro / Fechaduras"],
  copia: ["Chaveiro / Fechaduras"],
  portão: ["Serralheria / Portões"],
  portao: ["Serralheria / Portões"],
  solda: ["Serralheria / Portões"],
  grade: ["Serralheria / Portões"],
  motor: ["Serralheria / Portões"],
  vidro: ["Vidraçaria / Box & Espelhos"],
  box: ["Vidraçaria / Box & Espelhos"],
  espelho: ["Vidraçaria / Box & Espelhos"],
  janela: ["Vidraçaria / Box & Espelhos"],

  // Eletrodomésticos & Estofados
  geladeira: ["Conserto de Eletrodomésticos"],
  máquina: ["Conserto de Eletrodomésticos"],
  maquina: ["Conserto de Eletrodomésticos"],
  lavadora: ["Conserto de Eletrodomésticos"],
  microondas: ["Conserto de Eletrodomésticos"],
  fogão: ["Conserto de Eletrodomésticos"],
  fogao: ["Conserto de Eletrodomésticos"],
  forno: ["Conserto de Eletrodomésticos"],
  sofá: ["Tapeçaria / Estofados"],
  sofa: ["Tapeçaria / Estofados"],
  colchão: ["Tapeçaria / Estofados"],
  colchao: ["Tapeçaria / Estofados"],
  estofado: ["Tapeçaria / Estofados"],
  higienização: ["Tapeçaria / Estofados"],
  higienizacao: ["Tapeçaria / Estofados"],

  // Água & Gás
  gás: ["Gás & Água Mineral"],
  gas: ["Gás & Água Mineral"],
  botijão: ["Gás & Água Mineral"],
  botijao: ["Gás & Água Mineral"],
  água: ["Gás & Água Mineral"],
  agua: ["Gás & Água Mineral"],
  galão: ["Gás & Água Mineral"],
  galao: ["Gás & Água Mineral"],

  // Segurança, Pragas & Desentupimento
  câmera: ["Segurança / Câmeras & Alarmes"],
  camera: ["Segurança / Câmeras & Alarmes"],
  alarme: ["Segurança / Câmeras & Alarmes"],
  cftv: ["Segurança / Câmeras & Alarmes"],
  interfone: ["Segurança / Câmeras & Alarmes"],
  cerca: ["Segurança / Câmeras & Alarmes"],
  barata: ["Dedetização / Pragas"],
  escorpião: ["Dedetização / Pragas"],
  escorpiao: ["Dedetização / Pragas"],
  cupim: ["Dedetização / Pragas"],
  rato: ["Dedetização / Pragas"],
  formiga: ["Dedetização / Pragas"],
  desentupir: ["Desentupidora / Fossa"],
  desentupimento: ["Desentupidora / Fossa"],
  fossa: ["Desentupidora / Fossa"],
  vaso: ["Desentupidora / Fossa", "Encanador"],

  // Carro, Moto & Bike
  mecânico: ["Mecânico"],
  mecanico: ["Mecânico"],
  pneu: ["Mecânico", "Bicicletaria / Bike"],
  óleo: ["Mecânico"],
  oleo: ["Mecânico"],
  freio: ["Mecânico"],
  bateria: ["Mecânico"],
  guincho: ["Mecânico"],
  bicicleta: ["Bicicletaria / Bike"],
  bike: ["Bicicletaria / Bike"],
  corrente: ["Bicicletaria / Bike"],

  // Saúde, Cuidado e Pets
  idoso: ["Cuidador / Enfermagem / Babá"],
  idosa: ["Cuidador / Enfermagem / Babá"],
  cuidadora: ["Cuidador / Enfermagem / Babá"],
  cuidador: ["Cuidador / Enfermagem / Babá"],
  enfermeira: ["Cuidador / Enfermagem / Babá"],
  babá: ["Cuidador / Enfermagem / Babá"],
  baba: ["Cuidador / Enfermagem / Babá"],
  criança: ["Cuidador / Enfermagem / Babá"],
  crianca: ["Cuidador / Enfermagem / Babá"],
  pet: ["Pet / Veterinário"],
  cachorro: ["Pet / Veterinário"],
  gato: ["Pet / Veterinário"],
  veterinário: ["Pet / Veterinário"],
  veterinario: ["Pet / Veterinário"],
  vacina: ["Pet / Veterinário"],
  tosa: ["Pet / Veterinário"],
  ração: ["Pet / Veterinário"],
  racao: ["Pet / Veterinário"],

  // Barbearia e Beleza
  cabelo: ["Barbearia / Cabeleireiro", "Beleza / Estética"],
  barba: ["Barbearia / Cabeleireiro"],
  barbearia: ["Barbearia / Cabeleireiro"],
  barbeiro: ["Barbearia / Cabeleireiro"],
  corte: ["Barbearia / Cabeleireiro"],
  degrade: ["Barbearia / Cabeleireiro"],
  degradê: ["Barbearia / Cabeleireiro"],
  escova: ["Barbearia / Cabeleireiro", "Beleza / Estética"],
  unha: ["Beleza / Estética"],
  manicure: ["Beleza / Estética"],
  pedicure: ["Beleza / Estética"],
  sobrancelha: ["Beleza / Estética"],

  // Lava Rápido & Carro
  "lava rápido": ["Lava Rápido / Estética Automotiva"],
  "lavarapido": ["Lava Rápido / Estética Automotiva"],
  "lavar carro": ["Lava Rápido / Estética Automotiva"],
  polimento: ["Lava Rápido / Estética Automotiva"],
  cristalização: ["Lava Rápido / Estética Automotiva"],
  cristalizacao: ["Lava Rápido / Estética Automotiva"],

  // Dentista & Odonto
  dentista: ["Dentista / Odontologia", "Saúde / Terapia"],
  dente: ["Dentista / Odontologia"],
  odonto: ["Dentista / Odontologia"],
  odontologia: ["Dentista / Odontologia"],
  canal: ["Dentista / Odontologia"],
  aparelho: ["Dentista / Odontologia"],
  clareamento: ["Dentista / Odontologia"],

  // Açougue & Carnes
  açougue: ["Açougue / Casa de Carnes", "Churrasqueiro"],
  acougue: ["Açougue / Casa de Carnes", "Churrasqueiro"],
  picanha: ["Açougue / Casa de Carnes", "Churrasqueiro"],
  costela: ["Açougue / Casa de Carnes", "Churrasqueiro"],
  linguiça: ["Açougue / Casa de Carnes", "Churrasqueiro"],
  linguica: ["Açougue / Casa de Carnes", "Churrasqueiro"],

  // Sorveteria & Açaí
  sorvete: ["Sorveteria / Açaí", "Bolos / Doces / Salgados"],
  sorveteria: ["Sorveteria / Açaí"],
  picolé: ["Sorveteria / Açaí"],
  picole: ["Sorveteria / Açaí"],
  açaí: ["Sorveteria / Açaí"],
  acai: ["Sorveteria / Açaí"],
  gelato: ["Sorveteria / Açaí"],

  ar: ["Ar Condicionado"],
  "ar-condicionado": ["Ar Condicionado"],
  climatizador: ["Ar Condicionado"],
  reforço: ["Aulas / Reforço"],
  reforco: ["Aulas / Reforço"],
  aula: ["Aulas / Reforço"],
  matemática: ["Aulas / Reforço"],
  inglês: ["Aulas / Reforço"],
  ingles: ["Aulas / Reforço"],
  costura: ["Costura / Roupas"],
  bainha: ["Costura / Roupas"],
  ajuste: ["Costura / Roupas"],
  zíper: ["Costura / Roupas"],
  ziper: ["Costura / Roupas"],
  impressão: ["Gráfica / Papelaria"],
  impressao: ["Gráfica / Papelaria"],
  xerox: ["Gráfica / Papelaria"],
  panfleto: ["Gráfica / Papelaria"],
  adesivo: ["Gráfica / Papelaria"],
  foto: ["Fotografia / Filmagem"],
  fotógrafo: ["Fotografia / Filmagem"],
  fotografo: ["Fotografia / Filmagem"],
  ensaio: ["Fotografia / Filmagem"],
  celular: ["Tecnologia / Celular"],
  computador: ["Tecnologia / Celular"],
  notebook: ["Tecnologia / Celular"],
  formatar: ["Tecnologia / Celular"],
  tela: ["Tecnologia / Celular"],
  imposto: ["Contabilidade / Advocacia"],
  advogado: ["Contabilidade / Advocacia"],
  contador: ["Contabilidade / Advocacia"],
  cnpj: ["Contabilidade / Advocacia"],
};

/**
 * Retorna as categorias relacionadas a um termo ou frase de busca digitado pelo morador.
 */
export function buscarCategoriasPorSinonimos(termoBusca: string): string[] {
  const normalizado = termoBusca.toLowerCase().trim();
  if (!normalizado) return [];

  const palavras = normalizado.split(/\s+/);
  const categoriasEncontradas = new Set<string>();

  for (const palavra of palavras) {
    if (SINONIMOS_BUSCA[palavra]) {
      SINONIMOS_BUSCA[palavra].forEach((cat) => categoriasEncontradas.add(cat));
    }
  }

  // Checa frases completas ou termos compostos
  for (const [chave, cats] of Object.entries(SINONIMOS_BUSCA)) {
    if (normalizado.includes(chave) || chave.includes(normalizado)) {
      cats.forEach((cat) => categoriasEncontradas.add(cat));
    }
  }

  return Array.from(categoriasEncontradas);
}

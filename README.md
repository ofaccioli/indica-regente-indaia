# 🌟 Indica Jd. Regente • Indaiatuba

> **Web App Mobile-First (PWA) Comunitário de Recomendações de Serviços, Profissionais e Mural do Bairro**, pronto para hospedar na **Vercel** e integrado ao **Supabase**.

O **Indica Jd. Regente** foi criado para acabar de vez com a troca desorganizada de contatos nos grupos de WhatsApp do condomínio e da vizinhança. Centraliza profissionais e comércios recomendados por moradores, possui validação inteligente de duplicidades, atalhos de 1 toque para WhatsApp e ligação, além de um mural de pedidos, achados/pets e classificados de desapego.

---

## 📱 Principais Funcionalidades

### 1. 📇 Guia Completo de Serviços e Profissionais
- **Catálogo Organizado por Mais de 35 Categorias**:
  - *Destaques*: **Uber / Táxi / Motorista**, **Churrasqueiro**, **Buffet / Festas & Eventos**, **Bolos / Doces / Salgados**, **Eletricista**, **Encanador**, **Diarista / Limpeza**, **Reformas / Pedreiro**, **Jardinagem / Piscina**, **Serralheria / Portões**, **Vidraçaria / Box & Espelhos**, **Conserto de Eletrodomésticos**, **Tapeçaria / Estofados**, **Fretes / Mudanças**, **Gás & Água Mineral**, **Segurança / Câmeras & Alarmes**, e muito mais.
- **Filtros Rápidos em 1 Toque**:
  - `🏡 Só Moradores do Bairro` (compre e contrate de quem é de casa).
  - `🏷️ Ofertas da Vizinhança` (descontos e condições especiais exclusivas para quem mora no bairro).
  - `🚨 Plantão FDS` (profissionais que atendem aos fins de semana e emergências).
  - `🛵 Vai a Domicílio` ou `🏢 Atendimento no Local / Loja`.
  - `❤️ Salvos / Meus Favoritos` (guardados localmente no seu aparelho).
- **Indicador em Tempo Real "🟢 Aberto Agora / 🔴 Fechado"**: Baseado no horário de funcionamento informado pelo prestador, com bolinha pulsante.

### 2. 🖼️ Mini-Galeria de Trabalhos nos Cards (Estilo Airbnb)
- Se o profissional cadastrou fotos dos trabalhos realizados (bolos, festas, jardins, reformas, artesanato), o card exibe uma **faixa visual elegante com as miniaturas** e o botão `📸 Ver fotos (X)`.
- Ao tocar na foto, abre uma galeria em tela cheia com fundo escuro (lightbox), zoom e setas de navegação.

### 3. 💬 WhatsApp Inteligente com Mensagens Contextuais
Ao tocar em **"Chamar no WhatsApp"**, o morador pode escolher mensagens pré-formatadas sob medida:
- **Para Uber / Táxi / Motorista**:
  - 🚗 *Agendar Corrida / Viagem* saindo do Jd. Regente.
  - ✈️ *Traslado para o Aeroporto de Viracopos (Campinas)*.
  - ⏱️ *Consulta de dias e horários de atendimento*.
- **Para Fretes / Mudanças**:
  - 📦 *Orçamento de frete/carreto*.
  - 🏠 *Mudança residencial completa (com consulta de ajudantes)*.
  - 🚨 *Frete urgente para o mesmo dia*.
- **Para Demais Categorias**:
  - 🏷️ *Aproveitar a condição especial para moradores*.
  - 📋 *Solicitar Orçamento*.
  - 🚨 *Atendimento Urgente / Emergência*.
  - ❓ *Tirar uma Dúvida rápida*.
- **Suporte a Múltiplos Números**: Se o profissional tiver 2 telefones, o usuário escolhe para qual deseja mandar mensagem.

### 4. 📢 Mural Comunitário "Alguém Indica?", Pets & Desapego
- Uma aba interativa integrada no topo da página:
  - 🙋 **Pedidos de Indicação**: *"Alguém conhece um bom encanador para hoje?"*
  - 🐾 **Pets Perdidos / Encontrados**: Com foto do animalzinho e contato direto do tutor.
  - 🏷️ **Desapego do Bairro**: Venda ou doação de móveis, eletrônicos e itens entre vizinhos.
- **Respostas Comunitárias**: Os vizinhos podem responder indicando um profissional já cadastrado no guia com link direto!

### 5. ✏️ Edição e Atualização de Informações
- **Edição Direta pelo Criador**: O aparelho que cadastrou o serviço reconhece o autor e exibe o botão `✏️ Editar`, permitindo atualizar telefones, fotos, horários e condições especiais sem burocracia.
- **"É o dono? Atualizar informações"**: Para outros aparelhos, abre o modal de contato direto no WhatsApp da moderação (**Otavio Faccioli - 19 99395-2651**) com os dados já preenchidos.

### 6. 🚨 SOS, Saúde & Calendário do Bairro
- **Telefones Úteis e Emergências com Discagem Direta**:
  - GCM (153), SAMU (192), Bombeiros (193), Polícia Militar (190), SAAE (Água), CPFL (Energia), UPA Morada do Sol.
  - **Hospitais & Farmácias 24h**: HAOC (Hospital Augusto de Oliveira Camargo), Hospital Santa Ignês e farmácias 24h de plantão (Droga Raia e Drogaria São Paulo).
- **Calendário de Coleta de Lixo**:
  - Horários e dias do caminhão de lixo comum, coleta seletiva e cata-bagulho no Jd. Regente e Valença.

### 7. 🧠 Busca Inteligente por Problemas e Sinônimos
- O morador não precisa adivinhar o nome técnico da profissão:
  - Digitar *"chuveiro queimou"* ou *"tomada"* acha **Eletricista**.
  - Digitar *"vazamento"*, *"cano"* ou *"torneira"* acha **Encanador**.
  - Digitar *"faxina"* ou *"passadeira"* acha **Diarista / Limpeza**.
  - Digitar *"viracopos"* ou *"aeroporto"* acha **Uber / Táxi / Motorista**.
  - Digitar *"carreto"* ou *"entulho"* acha **Fretes / Mudanças**.

### 8. 🧹 Faxina Colaborativa & Validade no Mural
- **Alerta "Número mudou / Não atende"**: Botão de 1 toque em qualquer serviço para avisar a moderação pelo WhatsApp sobre contatos inativos.
- **Validade de 30 Dias no Mural**: Selo `⏳ Expirado (+30d)` e botão para ocultar posts antigos com 1 clique, mantendo os desapegos e avisos sempre atualizados.
- **Exportação para Excel / CSV no `/admin`**: Download completo dos prestadores com telefones, notas e horários em UTF-8 formatado para Excel.

### 9. 🎨 Design, Layout & Experiência de Uso (UX)
- **Chips de Atalhos Rápidos**: Logo abaixo da barra de busca, tags deslizáveis (`🔥 Churrasco`, `⚡ Eletricista`, `🚖 Uber`, `🎂 Bolos`, etc.) para filtrar com 1 toque sem digitar.
- **Botão Flutuante "Voltar ao Topo"**: Surge suavemente ao rolar a página para baixo.
- **Notificações Toast**: Avisos elegantes e discretos ao favoritar ou copiar indicações.
- **Empty State Inteligente**: Ao pesquisar algo não encontrado, oferece botões diretos para *Pedir no Mural do Bairro* ou *Indicar um profissional*.
- **Compartilhamento no WhatsApp com Pré-visualização Oficial**: Banner Open Graph (1200x630) nas cores verde esmeralda com o logotipo oficial do **Indica Jd. Regente** (substituindo o ícone da Vercel).
- **PWA Instalável**: Funciona no navegador e permite instalar como aplicativo no Android (Chrome) e iPhone (Safari) com ícone próprio na tela de início.
- **Painel Administrativo (`/admin`)**: Área para moderadores gerenciarem cadastros, aprovarem avaliações, exportarem CSV para Excel e editarem qualquer serviço.
- **Importador do Google Maps (`/admin`)**: Ferramenta integrada com busca em massa por categoria e importação por link direto do Google Maps. Puxa nome, telefones, nota média ($\ge 4.5★$), horários, fotos e endereços reais de Indaiatuba com 1 clique (suporta catálogo curado offline ou Google Places API em tempo real).

---

## 🚀 Como Rodar Localmente

1. Clone o repositório e acesse a pasta do projeto:
   ```bash
   git clone https://github.com/ofaccioli/indica-regente-indaia.git
   cd indica-regente-indaia
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento com Next.js & Turbopack:
   ```bash
   npm run dev
   ```

4. Abra no navegador: [http://localhost:3000](http://localhost:3000)
   > **Dica Mobile**: No Chrome ou Edge, pressione `F12` e ative o modo de dispositivo (`Ctrl+Shift+M`) para visualizar a experiência de celular.

---

## 🗄️ Banco de Dados (Supabase)

O projeto está totalmente integrado ao Supabase (PostgreSQL) com suporte a fallback local offline inteligente.

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito.
2. Abra o **SQL Editor** do projeto.
3. Execute o script contido em [`supabase/schema.sql`](supabase/schema.sql):
   - Cria as tabelas `servicos`, `avaliacoes`, `pedidos_mural`, `respostas_mural`.
   - Cria índices para buscas por telefone, categoria e nota média.
   - Cria triggers para cálculo automático da média ponderada de estrelas.
   - Habilita Row Level Security (RLS) com políticas de leitura e gravação comunitárias.
4. Adicione as chaves no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica
   ```

---

## ☁️ Hospedagem na Vercel

O aplicativo está pronto para deploy contínuo via GitHub na Vercel:

1. Importe o repositório no dashboard da [Vercel](https://vercel.com).
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Clique em **Deploy**. A cada `git push origin main`, o build automático atualiza a aplicação em segundos.

---

## 🧠 Algoritmo de Inteligência de Recomendações

O ranking utiliza uma **Média Bayesiana Ponderada**:

$$\text{Score} = \frac{v \times R + m \times C}{v + m}$$

Onde:
- $v$ = quantidade de avaliações do profissional
- $R$ = nota média atual (1.0 a 5.0)
- $m$ = peso mínimo de confiança da comunidade
- $C$ = nota média geral base

Isso garante que profissionais consistentes recebam o selo **"⭐ TOP RECOMENDADO"** e fiquem em evidência, evitando que prestadores com apenas 1 indicação passem à frente de quem já atendeu dezenas de moradores com excelência.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Processamento de Imagens & OpenGraph**: [Sharp](https://sharp.pixelplumbing.com/)
- **Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL)
- **PWA**: Web App Manifest, Service Worker nativo e Ícones adaptativos
- **UX & Efeitos**: Canvas Confetti, Toasts Customizados e Modal Lightbox

---

## 👤 Desenvolvedor & Suporte Comunitário

Desenvolvido com carinho para os moradores do **Jd. Regente e Indaiatuba - SP**.

- **Responsável**: Otavio Faccioli
- **WhatsApp de Suporte / Moderação**: [(19) 99395-2651](https://wa.me/5519993952651)
- **E-mail**: [otavio.faccioli@gmail.com](mailto:otavio.faccioli@gmail.com)
- **Ano**: 2026

# 🌟 IndicaRegenteIndaia

> **Web App Mobile-First (PWA) de Recomendações de Serviços e Profissionais da Comunidade**, pronto para hospedar na **Vercel** e integrado ao **Supabase**.

Criado para acabar de vez com a troca desorganizada de contatos em grupos de WhatsApp. Centraliza profissionais recomendados por vizinhos, possui validação inteligente de duplicidades, atalhos de 1 toque para WhatsApp e ligação, além de um **algoritmo ponderado para ranquear os mais bem avaliados**.

---

## 📱 Principais Funcionalidades

- **📱 PWA Instalável no Celular**: Funciona no navegador e permite ao usuário clicar em *"Instalar"* (Android) ou *"Adicionar à Tela de Início"* (iOS), abrindo sem barra de navegador com visual de aplicativo nativo.
- **⭐ Inteligência dos Mais Bem Avaliados**: Algoritmo de Média Bayesiana Ponderada que leva em conta a nota média e o volume consistente de recomendações, destacando os profissionais com o selo dourado **"TOP RECOMENDADO"**.
- **🛡️ Prevenção Ativa de Duplicidades**: Ao digitar o telefone no cadastro, o app verifica em tempo real se o número já existe na base. Se existir, avisa quem é o profissional e oferece um botão para adicionar uma nova avaliação em vez de duplicar.
- **⚡ Ações de 1 Toque**:
  - **Chamar no WhatsApp**: Abre a conversa diretamente com o profissional com uma mensagem personalizada citando o IndicaRegenteIndaia e a categoria.
  - **Ligar**: Disca diretamente pelo telefone.
  - **Compartilhar**: Envia o card formatado da indicação de volta para os grupos de WhatsApp.
  - **Avaliar**: Modal interativo de 1 a 5 estrelas com depoimento e animação de confetes.
- **🔍 Filtros e Busca Instantânea**: Pesquise por nome, especialidade, bairro ou quem indicou, com carrossel de categorias e ordenação rápida.

---

## 🚀 Como Rodar Localmente

1. Abra o terminal na pasta do projeto:
   ```bash
   cd c:\projetos\indica-regente-indaia
   ```

2. Instale as dependências (já instaladas se você rodou o setup):
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra no navegador: [http://localhost:3000](http://localhost:3000)
   > **Dica para testar a experiência mobile**: No Chrome ou Edge, pressione `F12` e clique no ícone de celular (Toggle device toolbar - `Ctrl+Shift+M`) para simular a visualização de um iPhone ou Samsung Galaxy!

---

## 🗄️ Como Conectar ao Supabase (Gratuito)

O app já vem com dados de exemplo e suporte a testes locais imediatos. Para sincronizar em nuvem com todos os usuários:

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito.
2. No menu lateral esquerdo, vá em **SQL Editor**.
3. Clique em **New Query**, cole todo o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
   - Isso criará as tabelas `servicos` e `avaliacoes`, os índices de busca, a trigger de recálculo de nota e as permissões de acesso público (RLS).
4. No menu lateral esquerdo, vá em **Project Settings** > **API**.
5. Copie a **Project URL** e a **anon public key**.
6. Crie um arquivo `.env.local` na raiz do projeto (baseado em `.env.local.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-publica
   ```

---

## ☁️ Como Hospedar na Vercel para Terceiros Acessarem

A **Vercel** oferece hospedagem gratuita com certificado SSL (HTTPS) e alta performance global:

### Opção 1: Pelo GitHub (Recomendada e Mais Fácil)
1. Crie um repositório no seu [GitHub](https://github.com/new) (ex: `indica-regente-indaia`).
2. No seu computador, faça o commit e push dos arquivos:
   ```bash
   cd c:\projetos\indica-regente-indaia
   git add .
   git commit -m "feat: IndicaRegenteIndaia PWA completo"
   git remote add origin https://github.com/SEU_USUARIO/indica-regente-indaia.git
   git branch -M main
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e faça login.
4. Clique em **Add New...** > **Project** e importe o repositório `indica-regente-indaia`.
5. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique em **Deploy**. Em menos de 1 minuto seu link estará ativo (ex: `https://indica-regente-indaia.vercel.app`) para você compartilhar no grupo de WhatsApp!

### Opção 2: Pela CLI da Vercel (Direto do Terminal)
1. Instale a CLI globalmente: `npm i -g vercel`
2. Execute na pasta do projeto:
   ```bash
   vercel
   ```
3. Siga as instruções rápidas na tela e adicione as variáveis de ambiente quando solicitado.

---

## 🧠 Como Funciona o Algoritmo de Avaliações

O app não usa apenas a média aritmética simples (que permitiria um profissional com apenas 1 voto nota 5 ultrapassar um profissional com 30 avaliações de nota 4.9).

Ele utiliza uma **Média Bayesiana Ponderada**:
$$\text{Score} = \frac{v \times R + m \times C}{v + m}$$

Onde:
- $v$ = quantidade de avaliações do profissional
- $R$ = nota média atual (1.0 a 5.0)
- $m$ = peso mínimo de confiança da comunidade
- $C$ = nota média geral base

Profissionais que atingem consistência recebem automaticamente o selo dourado **"⭐ TOP RECOMENDADO"** e aparecem com prioridade na aba **Top Avaliados**.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 16 (App Router) com Turbopack
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Ícones**: Lucide React
- **Banco de Dados**: Supabase (PostgreSQL) com fallback local inteligente
- **PWA**: Web App Manifest, Service Worker e meta tags mobile
- **UX**: Canvas Confetti nas avaliações e cadastros

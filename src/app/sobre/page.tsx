"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Smartphone,
  Star,
  ShieldCheck,
  HeartHandshake,
  Mail,
  Download,
  ShieldAlert,
  Recycle,
  Phone,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { TelefonesUteisModal } from "@/components/TelefonesUteisModal";
import { ColetaLixoModal } from "@/components/ColetaLixoModal";

export default function SobrePage() {
  const [modalTelefonesAberto, setModalTelefonesAberto] = React.useState(false);
  const [modalColetaAberto, setModalColetaAberto] = React.useState(false);

  const handleInstalarApp = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("indica:open-pwa-install"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col justify-between">
      <div>
        {/* Header com Logo */}
        <header className="sticky top-0 z-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-full hover:bg-emerald-800/80 transition-colors"
              aria-label="Voltar para a página inicial"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs border-2 border-amber-300/80 flex-shrink-0 bg-emerald-950">
                <Image
                  src="/logo.png"
                  alt="Logo Indica Jd.Regente"
                  fill
                  sizes="36px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black leading-tight">
                  Como Funciona & <span className="text-amber-400">Ajuda</span>
                </h1>
                <p className="text-[11px] text-emerald-200 font-medium">Indica Jd. Regente • Indaiatuba</p>
              </div>
            </Link>
          </div>

          <button
            type="button"
            onClick={handleInstalarApp}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar App</span>
          </button>
        </header>

        <main className="max-w-xl mx-auto px-4 pt-5 space-y-4">
          {/* Banner Missão */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base mb-2">
              <HeartHandshake className="w-6 h-6 text-amber-500" />
              <h2>Chega de contatos perdidos no WhatsApp!</h2>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Quantas vezes alguém pergunta no grupo da rua: <em>&ldquo;Alguém conhece um bom eletricista ou diarista?&rdquo;</em> e a resposta se perde na conversa?
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mt-2">
              O <strong>Indica Jd. Regente</strong> foi feito para centralizar todas essas indicações da vizinhança em um só lugar acessível pelo celular, com botões para chamar direto no WhatsApp com um único toque.
            </p>
          </div>

          {/* Guia Rápido do Bairro: Telefones Úteis & Coleta de Lixo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card SOS Telefones */}
            <div className="bg-gradient-to-br from-red-50 to-rose-100/70 border border-red-200 rounded-3xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-1.5">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <h4>Telefones de Emergência</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  GCM 153, SAMU 192, Bombeiros 193, SAAE, CPFL e UPA Morada do Sol com discagem direta.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalTelefonesAberto(true)}
                className="mt-3.5 w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ver Telefones Úteis</span>
              </button>
            </div>

            {/* Card Coleta de Lixo */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-100/70 border border-emerald-200 rounded-3xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1.5">
                  <Recycle className="w-5 h-5 text-emerald-700" />
                  <h4>Coleta de Lixo & Reciclagem</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dias e horários do caminhão de lixo comum, coleta seletiva e cata-bagulho no Jd. Regente e Valença.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalColetaAberto(true)}
                className="mt-3.5 w-full py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
              >
                <Recycle className="w-3.5 h-3.5" />
                <span>Ver Calendário de Coleta</span>
              </button>
            </div>
          </div>

          {/* Como funciona a Inteligência */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <h3>Inteligência de Ranking dos Mais Bem Avaliados</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nosso sistema utiliza uma fórmula de <strong>média ponderada de confiança</strong>:
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 mt-2 list-disc pl-4">
              <li>
                Evita que um profissional com apenas 1 indicação de 5 estrelas passe na frente de quem já atendeu dezenas de moradores com excelência.
              </li>
              <li>
                Profissionais consistentes com notas altas recebem o selo dourado <strong>&ldquo;TOP RECOMENDADO&rdquo;</strong>.
              </li>
              <li>
                Qualquer morador pode clicar em <strong>&ldquo;Avaliar&rdquo;</strong> para dar de 1 a 5 estrelas e contar como foi o atendimento.
              </li>
            </ul>
          </div>

          {/* Como instalar no Celular (PWA) */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3>Como ter o App na Tela do seu Celular</h3>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                PWA Grátis
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              O Indica Jd. Regente é um <strong>PWA (Progressive Web App)</strong>. Você não precisa baixar nada de lojas pesadas:
            </p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <strong className="text-gray-900 font-semibold">No Android (Chrome):</strong>
                <p className="text-gray-600 mt-0.5">
                  Toque no banner &ldquo;Instalar&rdquo; no topo do site ou no menu de três pontinhos e selecione &ldquo;Instalar aplicativo&rdquo;.
                </p>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <strong className="text-gray-900 font-semibold">No iPhone (Safari):</strong>
                <p className="text-gray-600 mt-0.5">
                  Toque no botão de Compartilhar (quadrado com seta para cima) e escolha &ldquo;Adicionar à Tela de Início&rdquo;.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleInstalarApp}
              className="mt-3.5 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Instalar Aplicativo no Celular Agora</span>
            </button>
          </div>

          {/* Entre em Contato com o DEV */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-5 shadow-sm border border-emerald-700/30">
            <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm mb-2">
              <Mail className="w-5 h-5 text-amber-400" />
              <h3>Entre em contato com o DEV</h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-3.5">
              Tem sugestões para melhorar o aplicativo, novas ideias para o bairro ou quer relatar algum problema? Fale diretamente com o desenvolvedor:
            </p>
            <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-300 font-semibold">Responsável:</span>
                <strong className="text-white text-sm">Otavio Faccioli</strong>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-emerald-300 font-semibold">E-mail:</span>
                <a
                  href="mailto:otavio.faccioli@gmail.com"
                  className="text-amber-300 hover:text-amber-200 hover:underline font-bold transition-colors"
                >
                  otavio.faccioli@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Área de Moderação Administrativa */}
          <div className="bg-gray-900 text-white rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                <ShieldCheck className="w-5 h-5" />
                <h3>Área de Moderação do Bairro</h3>
              </div>
              <p className="text-xs text-gray-400">
                Espaço para moderadores gerenciarem contatos, editarem informações e validarem avaliações.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs whitespace-nowrap shadow-xs transition-all active:scale-95"
            >
              Acessar Admin
            </Link>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-gray-500 border-t border-gray-200/70 mt-8">
        <p className="font-semibold text-gray-700">
          Desenvolvido por Otavio Faccioli - 2026
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Indica Jd. Regente • Indaiatuba - SP
        </p>
      </footer>

      {/* Modais de Utilidade Pública */}
      <TelefonesUteisModal
        isOpen={modalTelefonesAberto}
        onClose={() => setModalTelefonesAberto(false)}
      />
      <ColetaLixoModal
        isOpen={modalColetaAberto}
        onClose={() => setModalColetaAberto(false)}
      />

      <BottomNav />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Smartphone,
  Star,
  ShieldCheck,
  Share2,
  Database,
  CloudUpload,
  HeartHandshake,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-emerald-700 text-white px-4 py-3 shadow-md flex items-center gap-3">
        <Link
          href="/"
          className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-base font-bold leading-tight">Como Funciona</h1>
          <p className="text-[11px] text-emerald-200">IndicaRegenteIndaia</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-5 space-y-4">
        {/* Banner Missão */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-base mb-2">
            <HeartHandshake className="w-6 h-6 text-amber-500" />
            <h2>Chega de contatos perdidos no WhatsApp!</h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Quantas vezes alguém pergunta no grupo: <em>&ldquo;Alguém conhece um bom eletricista ou diarista?&rdquo;</em> e a resposta se perde na conversa?
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mt-2">
            O <strong>IndicaRegenteIndaia</strong> foi feito para centralizar todas essas indicações em um só lugar acessível pelo celular, com botões para chamar direto no WhatsApp com um único toque.
          </p>
        </div>

        {/* Como funciona a Inteligência */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h3>Inteligência de Ranking dos Mais Bem Avaliados</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Nosso sistema utiliza uma fórmula de <strong>média ponderada de confiança</strong>:
          </p>
          <ul className="text-xs text-gray-600 space-y-1.5 mt-2 list-disc pl-4">
            <li>
              Evita que um profissional com apenas 1 indicação de 5 estrelas fique na frente de quem já atendeu dezenas de moradores com excelência.
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
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <h3>Como ter o App na Tela do seu Celular</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            O IndicaRegenteIndaia é um <strong>PWA (Progressive Web App)</strong>. Você não precisa baixar da Play Store ou App Store:
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
        </div>

        {/* Deploy na Vercel e Supabase */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-2">
            <CloudUpload className="w-5 h-5" />
            <h3>Hospedagem Gratuita na Vercel & Supabase</h3>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Este projeto já está 100% pronto para publicação mundial na Vercel:
          </p>
          <ol className="text-xs text-emerald-100 space-y-2 mt-3 list-decimal pl-4">
            <li>
              Crie uma conta gratuita em <span className="text-amber-300 font-semibold">supabase.com</span> e execute o script contido em <code className="bg-emerald-950 px-1 py-0.5 rounded text-[11px]">supabase/schema.sql</code> no SQL Editor.
            </li>
            <li>
              No painel do Supabase, copie a URL e a Anon Key.
            </li>
            <li>
              Suba a pasta no GitHub e conecte na <span className="text-amber-300 font-semibold">vercel.com</span> adicionando as variáveis de ambiente.
            </li>
          </ol>
        </div>

        {/* Área de Moderação Administrativa */}
        <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
              <ShieldCheck className="w-5 h-5" />
              <h3>Área de Moderação da Comunidade</h3>
            </div>
            <p className="text-xs text-gray-400">
              Espaço reservado para administradores gerenciarem contatos, editarem informações e moderarem avaliações.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs whitespace-nowrap shadow transition-all active:scale-95"
          >
            Acessar Admin
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

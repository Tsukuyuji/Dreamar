'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { ArrowLeft, Target, DollarSign, Award, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CorretorProfilePage({ params }: { params: { id: string } }) {
  // Mock data based on the requirements
  const corretor = {
    name: 'João Silva',
    cargo: 'Corretor Especialista',
    dataEntrada: '15/03/2024',
    photo: 'JS',
    indicadores: {
      vendasMes: 4,
      vendasAno: 18,
      vgvMes: 2850000,
      vgvAno: 14500000,
      propostasMes: 7,
      ticketMedio: 2850000 / 4,
      metaMensal: 3,
      metaAnual: 36
    },
    historico: [
      { id: '1', date: '02/09/2026', property: 'Apartamento — Martim de Sá', value: 650000 },
      { id: '2', date: '18/08/2026', property: 'Casa — Massaguaçu', value: 920000 },
      { id: '3', date: '03/08/2026', property: 'Apartamento — Indaiá', value: 580000 },
      { id: '4', date: '01/08/2026', property: 'Terreno — Centro', value: 700000 },
    ],
    evolucao: [
      { name: 'Jan', vendas: 2, vgv: 1500000, propostas: 5 },
      { name: 'Fev', vendas: 3, vgv: 2200000, propostas: 6 },
      { name: 'Mar', vendas: 4, vgv: 3100000, propostas: 8 },
      { name: 'Abr', vendas: 5, vgv: 4850000, propostas: 10 },
      { name: 'Mai', vendas: 4, vgv: 2850000, propostas: 7 },
    ],
    conquistas: [
      { title: 'Primeira venda', icon: '🏆', date: '20/03/2024' },
      { title: 'Meta mensal atingida', icon: '⭐', date: 'Abril 2026' },
      { title: 'R$ 1 milhão em VGV', icon: '💎', date: 'Março 2026' },
      { title: 'Top 1 do mês', icon: '👑', date: 'Abril 2026' },
    ]
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <Link href="/corretores" className="flex items-center text-slate-500 hover:text-blue-600 w-fit">
        <ArrowLeft size={16} className="mr-2" />
        Voltar para Rankings
      </Link>

      {/* Cabeçalho do Perfil */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl shrink-0">
          {corretor.photo}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800">{corretor.name}</h1>
          <p className="text-slate-500 font-medium">{corretor.cargo}</p>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-slate-400">
            <Calendar size={14} />
            <span>Na equipe desde {corretor.dataEntrada}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {corretor.conquistas.slice(0,3).map((c, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl cursor-help" title={c.title}>
              {c.icon}
            </div>
          ))}
          {corretor.conquistas.length > 3 && (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
              +{corretor.conquistas.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-sm text-slate-500 mb-1">Vendas no Mês</p>
          <p className="text-2xl font-bold text-blue-600">{corretor.indicadores.vendasMes}</p>
          <p className="text-xs text-slate-400 mt-1">Ano: {corretor.indicadores.vendasAno}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-sm text-slate-500 mb-1">VGV no Mês</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(corretor.indicadores.vgvMes)}</p>
          <p className="text-xs text-slate-400 mt-1">Ano: {formatCurrency(corretor.indicadores.vgvAno)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-sm text-slate-500 mb-1">Propostas (Mês)</p>
          <p className="text-2xl font-bold text-purple-600">{corretor.indicadores.propostasMes}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-sm text-slate-500 mb-1">Ticket Médio</p>
          <p className="text-2xl font-bold text-amber-600">{formatCurrency(corretor.indicadores.ticketMedio)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Evolução */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho Mensal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corretor.evolucao}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metas e Conquistas */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="text-blue-600" />
              Metas
            </h3>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Meta Mensal</span>
                <span className="font-bold">{corretor.indicadores.vendasMes} / {corretor.indicadores.metaMensal}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((corretor.indicadores.vendasMes / corretor.indicadores.metaMensal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Meta Anual</span>
                <span className="font-bold">{corretor.indicadores.vendasAno} / {corretor.indicadores.metaAnual}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((corretor.indicadores.vendasAno / corretor.indicadores.metaAnual) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="text-amber-500" />
              Quadro de Conquistas
            </h3>
            <div className="space-y-3">
              {corretor.conquistas.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-2xl">{c.icon}</div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{c.title}</p>
                    <p className="text-xs text-slate-400">{c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Vendas */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <DollarSign className="text-emerald-600" />
          Histórico Recente de Vendas
        </h3>
        <div className="divide-y divide-slate-100">
          {corretor.historico.map((venda) => (
            <div key={venda.id} className="py-3 flex justify-between items-center hover:bg-slate-50 px-2 rounded transition-colors">
              <div>
                <p className="font-medium text-slate-800">{venda.property}</p>
                <p className="text-sm text-slate-500">{venda.date}</p>
              </div>
              <div className="font-bold text-slate-800">
                {formatCurrency(venda.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

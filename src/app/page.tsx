'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { TrendingUp, DollarSign, Target, FileText, Award } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(res => res.json()).then(resData => { setData(resData); setLoading(false); }).catch(e => { console.error(e); setLoading(false); }); //

  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Carregando...</div>;

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const salesGrowth = calculateGrowth(data.current.sales, data.previous.sales);
  const vgvGrowth = calculateGrowth(data.current.vgv, data.previous.vgv);
  const propGrowth = calculateGrowth(data.current.proposals, data.previous.proposals);

  const metaProgress = (data.current.sales / data.goal.salesTarget) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard da Empresa</h1>
        <select className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm">
          <option>Maio 2026</option>
          <option>Abril 2026</option>
        </select>
      </div>

      { /* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        { /* Vendas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Vendas no Mês</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{data.current.sales}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`font-medium ${salesGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {salesGrowth >= 0 ? '+' : ''}{salesGrowth}%
            </span>
            <span className="text-slate-500 ml-2">vs mês anterior</span>
          </div>
        </div>

        { /* VGV */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">VGV do Mês</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(data.current.vgv)}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`font-medium ${vgvGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {vgvGrowth >= 0 ? '+' : ''}{vgvGrowth}%
            </span>
            <span className="text-slate-500 ml-2">vs mês anterior</span>
          </div>
        </div>

        { /* Propostas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Propostas</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{data.current.proposals}</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`font-medium ${propGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {propGrowth >= 0 ? '+' : ''}{propGrowth}%
            </span>
            <span className="text-slate-500 ml-2">vs mês anterior</span>
          </div>
        </div>

        { /* Ticket Médio */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(data.current.ticketMedio)}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Target size={20} />
            </div>
          </div>
        </div>
      </div>

      { /* Meta e Destaque */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Meta Mensal (Vendas)</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-slate-700">{data.current.sales} vendas realizadas</span>
            <span className="text-slate-500">Meta: {data.goal.salesTarget}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(metaProgress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-500 text-right">{metaProgress.toFixed(1)}% atingido</p>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Award size={80} />
          </div>
          <h3 className="text-amber-100 font-medium text-sm">CORRETOR DESTAQUE</h3>
          <h2 className="text-2xl font-bold mt-1">{data.ranking[0]?.name}</h2>
          <div className="mt-4 flex gap-4">
            <div>
              <p className="text-amber-100 text-xs">Vendas</p>
              <p className="font-bold">{data.ranking[0]?.totalSales}</p>
            </div>
            <div>
              <p className="text-amber-100 text-xs">VGV</p>
              <p className="font-bold">{formatCurrency(data.ranking[0]?.totalVgv || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      { /* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Evolução da Empresa</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.evolution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Bar dataKey="vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Corretores (Mês)</h3>
          <div className="space-y-4">
            {data.ranking.map((corretor: any, index: number) => (
              <div key={corretor.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{corretor.name}</p>
                    <p className="text-xs text-slate-500">{corretor.totalSales} vendas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 text-sm">{formatCurrency(corretor.totalVgv)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

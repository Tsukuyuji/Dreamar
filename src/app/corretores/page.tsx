'use client';

import { useState, useEffect } from 'react';
import { Award, Trophy, Medal, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CorretoresPage() {
  const [rankingType, setRankingType] = useState('mensal'); // mensal, vgv, anual
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/corretores?type=${rankingType}`)
      .then(res => res.json())
      .then(data => {
        setRanking(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [rankingType]);

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Trophy className="text-amber-400" size={24} />;
      case 1: return <Medal className="text-slate-400" size={24} />;
      case 2: return <Medal className="text-amber-700" size={24} />;
      default: return <span className="font-bold text-slate-400 w-6 text-center">{index + 1}º</span>;
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ranking e Desempenho</h1>
          <p className="text-slate-500 text-sm">Acompanhe a performance da equipe</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg w-fit">
        <button
          onClick={() => setRankingType('mensal')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${rankingType === 'mensal' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
        >
          Ranking Mensal
        </button>
        <button
          onClick={() => setRankingType('vgv')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${rankingType === 'vgv' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
        >
          Por VGV
        </button>
        <button
          onClick={() => setRankingType('anual')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${rankingType === 'anual' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
        >
          Ranking Anual
        </button>
      </div>

      {/* Ranking List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Award className="text-blue-600" />
            {rankingType === 'mensal' && 'Top Vendedores (Quantidade) - Maio 2026'}
            {rankingType === 'vgv' && 'Top Vendedores (VGV) - Maio 2026'}
            {rankingType === 'anual' && 'Ranking Acumulado - 2026'}
          </h2>
          <select className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white">
            <option>Maio 2026</option>
            <option>Abril 2026</option>
          </select>
        </div>

        <div className="divide-y divide-slate-100">
          {ranking.map((corretor: any, index: number) => (
            <Link href={`/corretores/${corretor.id}`} key={corretor.id} className="flex items-center p-4 hover:bg-slate-50 transition-colors group">
              <div className="w-12 flex justify-center items-center">
                {getRankIcon(index)}
              </div>

              <div className="ml-4 flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {corretor.photo}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{corretor.name}</h3>
                  <div className="flex gap-4 mt-1 text-sm text-slate-500">
                    <span>{corretor.vendas} vendas</span>
                    <span>•</span>
                    <span>{corretor.propostas} propostas</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center hidden md:block">
                <p className="text-xs text-slate-500 mb-1">VGV Total</p>
                <p className="font-bold text-slate-800">{formatCurrency(corretor.vgv)}</p>
              </div>

              <div className="flex-1 hidden lg:block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Meta Mensal (3 vendas)</span>
                  <span className="font-medium text-slate-700">{corretor.meta}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${corretor.meta >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(corretor.meta, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="ml-6 text-slate-400 group-hover:text-blue-600">
                <ChevronRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

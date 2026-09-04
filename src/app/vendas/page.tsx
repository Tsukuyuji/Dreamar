'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, X } from 'lucide-react';

export default function VendasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendas, setVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: 'VENDA',
    saleDate: new Date().toISOString().split('T')[0],
    propertyValue: '',
    commissionPercentage: '',
    commissionValue: '',
    status: 'CONCLUIDA',
    notes: '',
    property: {
      code: '',
      title: '',
      address: '',
      neighborhood: '',
      city: '',
      type: '',
      development: ''
    },
    agents: [{ agentId: '', participationPercentage: 100 }]
  });

  const loadData = async () => {
    try {
      const [salesRes, agentsRes] = await Promise.all([
        fetch("/api/sales"),
        fetch("/api/agents")
      ]);
      const sales = await salesRes.json();
      const agentsData = await agentsRes.json();
      setVendas(sales);
      setAgents(agentsData);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        propertyValue: parseFloat(formData.propertyValue as string) || 0,
        commissionPercentage: parseFloat(formData.commissionPercentage as string) || 0,
        commissionValue: parseFloat(formData.commissionValue as string) || 0,
        type: formData.type === 'VENDA' ? 'VENDA' : 'PROPOSTA'
      };

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
            type: 'VENDA',
            saleDate: new Date().toISOString().split('T')[0],
            propertyValue: '',
            commissionPercentage: '',
            commissionValue: '',
            status: 'CONCLUIDA',
            notes: '',
            property: { code: '', title: '', address: '', neighborhood: '', city: '', type: '', development: '' },
            agents: [{ agentId: '', participationPercentage: 100 }]
        });
        await loadData();
      } else {
        alert("Erro ao salvar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vendas e Propostas</h1>
          <p className="text-slate-500 text-sm">Gerencie todas as negociações da imobiliária</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} />
          Nova Venda
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar imóvel ou corretor..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Setembro 2026</option>
          <option>Agosto 2026</option>
          <option>Todos os meses</option>
        </select>
        <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Todos os tipos</option>
          <option>Apenas Vendas</option>
          <option>Apenas Propostas</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">
          <Filter size={16} />
          Mais filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Corretor(es)</th>
                <th className="p-4 font-medium">Imóvel</th>
                <th className="p-4 font-medium">Valor</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vendas.map((venda) => (
                <tr key={venda.id} className="hover:bg-slate-50 text-sm">
                  <td className="p-4 text-slate-700">{new Date(venda.saleDate).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-slate-800">{venda.salesAgents.map((sa: any) => sa.agent.name).join(', ')}</td>
                  <td className="p-4">
                    <p className="text-slate-800">{`${venda.property.type} - ${venda.property.neighborhood}`}</p>
                    <p className="text-xs text-slate-500">{venda.property.code}</p>
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.value)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      venda.type === 'Venda' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {venda.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{venda.status}</td>
                  <td className="p-4 text-slate-400">
                    <button className="hover:text-slate-600"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Venda */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Cadastrar Nova Venda / Proposta</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Registro</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" className="text-blue-600" checked={formData.type === 'VENDA'} onChange={() => setFormData({...formData, type: 'VENDA'})} />
                    <span>Venda Concluída</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" className="text-blue-600" checked={formData.type === 'PROPOSTA'} onChange={() => setFormData({...formData, type: 'PROPOSTA'})} />
                    <span>Proposta</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Corretor Principal</label>
                  <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={formData.agents[0].agentId} onChange={(e) => { const newAgents = [...formData.agents]; newAgents[0].agentId = e.target.value; setFormData({...formData, agents: newAgents}); }}>
                    <option value="">Selecione...</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data da Venda</label>
                  <input type="date" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={formData.saleDate} onChange={(e) => setFormData({...formData, saleDate: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-medium text-slate-800 mb-4">Dados do Imóvel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Código</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Ex: REF-001" value={formData.property.code} onChange={(e) => setFormData({...formData, property: {...formData.property, code: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                    <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="R$ 0,00" value={formData.propertyValue} onChange={(e) => setFormData({...formData, propertyValue: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bairro / Empreendimento</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Bairro ou nome do edifício" value={formData.property.neighborhood} onChange={(e) => setFormData({...formData, property: {...formData.property, neighborhood: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Comissão (%)</label>
                    <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Ex: 6" value={formData.commissionPercentage} onChange={(e) => setFormData({...formData, commissionPercentage: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor da Comissão</label>
                    <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="R$ 0,00" value={formData.commissionValue} onChange={(e) => setFormData({...formData, commissionValue: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <textarea className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm h-24" placeholder="Detalhes adicionais..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  {submitting ? 'Salvando...' : 'Salvar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

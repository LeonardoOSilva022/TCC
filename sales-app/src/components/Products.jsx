import React, { useState } from 'react';
import { Plus, Trash2, Package, Search, DollarSign, Hash, X } from 'lucide-react';

export default function Products({ user, products, onDelete, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', price: '', stock: '' });

  const canEdit = user.role === 'Gerente' || user.role === 'Subgerente';

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now(), price: Number(formData.price), stock: Number(formData.stock) });
    setFormData({ name: '', code: '', price: '', stock: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-3.5 text-neutral-600" size={18} />
           <input 
              type="text" 
              placeholder="Pesquisar no catálogo..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full bg-black border border-neutral-800 p-3 pl-12 rounded-2xl text-white outline-none focus:border-blue-600 transition-all" 
           />
        </div>
        {canEdit && (
          <button 
            onClick={() => setShowAdd(!showAdd)} 
            className="bg-blue-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
          >
            {showAdd ? <X size={20}/> : <Plus size={20}/>}
            {showAdd ? 'Cancelar' : 'Novo Produto'}
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 rounded-3xl border border-blue-600/30 grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-down shadow-2xl">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-2">Nome do Item</label>
              <input placeholder="Ex: Servidor Cloud" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-neutral-800 p-3 rounded-xl outline-none focus:border-blue-500" required />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-2">SKU / Código</label>
              <input placeholder="P-000" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-black border border-neutral-800 p-3 rounded-xl outline-none focus:border-blue-500" required />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-2">Preço de Venda</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-4 text-neutral-600"/>
                <input type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-neutral-800 p-3 pl-10 rounded-xl outline-none focus:border-blue-500" required />
              </div>
           </div>
           <button type="submit" className="h-[46px] mt-6 bg-white text-black rounded-xl font-black hover:bg-neutral-200 transition-all uppercase text-xs tracking-widest">
              Salvar Produto
           </button>
        </form>
      )}

      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-black/50 text-neutral-500 text-[10px] uppercase font-black tracking-widest border-b border-neutral-800">
            <tr>
              <th className="p-5">Identificador</th>
              <th className="p-5">Produto</th>
              <th className="p-5 text-center">Preço</th>
              <th className="p-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-5 font-mono text-neutral-600 text-xs">{p.code}</td>
                <td className="p-5">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-800 rounded-lg text-neutral-500"><Package size={16}/></div>
                      <span className="font-bold text-white text-sm">{p.name}</span>
                   </div>
                </td>
                <td className="p-5 text-center font-black text-blue-400 text-sm">R$ {p.price.toLocaleString()}</td>
                <td className="p-5 text-right">
                   {canEdit && <button onClick={() => onDelete(p.id)} className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18}/></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
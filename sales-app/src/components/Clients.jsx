import React, { useState } from 'react';
import { UserPlus, Building2, Mail, Phone, Globe, X, Search } from 'lucide-react';

export default function Clients({ clients, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-xl">
        <div>
          <h2 className="text-white font-bold text-xl tracking-tight">Base de Clientes</h2>
          <p className="text-neutral-500 text-xs mt-1">Gerencie sua carteira de parceiros comerciais.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg"
        >
          {showForm ? <X size={20}/> : <UserPlus size={20} />}
          {showForm ? 'Fechar' : 'Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <form 
          onSubmit={(e) => { e.preventDefault(); onAdd({...newClient, id: Date.now()}); setShowForm(false); }} 
          className="bg-neutral-900 p-8 rounded-3xl border border-blue-600/20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-down"
        >
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-2">Razão Social</label>
              <input placeholder="Nome da Empresa" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-black border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" required />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-2">E-mail de Contato</label>
              <input placeholder="comercial@empresa.com" type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-black border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" required />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-2">Telefone</label>
              <input placeholder="(00) 00000-0000" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full bg-black border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" required />
           </div>
           <button type="submit" className="md:col-span-3 bg-white text-black rounded-xl font-black py-4 hover:bg-neutral-200 transition-all uppercase text-xs tracking-widest shadow-lg">
              Confirmar Cadastro
           </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map(c => (
          <div key={c.id} className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 hover:border-blue-500/50 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-blue-600/10"></div>
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black border border-neutral-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                   <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{c.name}</h3>
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-tighter">Cliente Ativo</span>
                </div>
             </div>
             <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <div className="p-1.5 bg-black rounded-lg"><Mail size={14} className="text-neutral-600"/></div>
                  {c.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <div className="p-1.5 bg-black rounded-lg"><Phone size={14} className="text-neutral-600"/></div>
                  {c.phone || '(11) 99999-9999'}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
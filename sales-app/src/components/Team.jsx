import React, { useState } from 'react';
import { Shield, UserPlus, Key, Trash2 } from 'lucide-react';

export default function Team({ user, users, onAdd }) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Representante' });

  if (user.role !== 'Gerente') {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
         <Shield size={60} className="text-neutral-800 mb-4" />
         <h2 className="text-xl font-black text-neutral-700 uppercase italic">Acesso Restrito ao Master</h2>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now(), password: '123' });
    setFormData({ name: '', email: '', role: 'Representante' });
    setShowAdd(false);
    alert(`Usuário ${formData.name} criado com sucesso! Senha padrão: 123`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
         <h2 className="text-white font-bold flex items-center gap-3 italic tracking-tighter text-xl"><Shield className="text-blue-500" /> Painel de Controle de Acessos</h2>
         <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-500 flex items-center gap-2"><UserPlus size={18}/> Novo Acesso</button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 rounded-2xl border border-blue-900/30 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
           <input placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border border-neutral-800 p-3 rounded-xl outline-none focus:border-blue-500" required />
           <input type="email" placeholder="E-mail Corporativo" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-black border border-neutral-800 p-3 rounded-xl outline-none focus:border-blue-500" required />
           <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-black border border-neutral-800 p-3 rounded-xl outline-none">
              <option value="Representante">Representante</option>
              <option value="Subgerente">Subgerente</option>
              <option value="Gerente">Gerente</option>
           </select>
           <button type="submit" className="bg-emerald-600 rounded-xl font-black hover:bg-emerald-500 transition-all">CRIAR ACESSO</button>
        </form>
      )}

      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-black/60 text-neutral-500 text-[10px] uppercase font-black tracking-widest border-b border-neutral-800">
            <tr>
               <th className="p-5">Perfil</th>
               <th className="p-5">Cargo</th>
               <th className="p-5 text-right">Ações Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-black/20 group transition-all">
                <td className="p-5">
                   <div className="font-bold text-white text-sm">{u.name}</div>
                   <div className="text-[10px] text-neutral-600 font-mono tracking-tighter">{u.email}</div>
                </td>
                <td className="p-5">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${u.role === 'Gerente' ? 'bg-blue-950 text-blue-400 border-blue-900' : 'bg-neutral-800 text-neutral-500 border-neutral-700'}`}>{u.role}</span>
                </td>
                <td className="p-5 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-neutral-500 hover:text-blue-500 transition-colors" title="Resetar Senha"><Key size={18}/></button>
                      <button className="text-neutral-500 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
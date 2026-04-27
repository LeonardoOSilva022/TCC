import React, { useState } from 'react';
import { Shield, Key, Target, UserPlus, X, Save, Lock } from 'lucide-react';

export default function Team({ user, users, onUpdateUser, onAdd }) {
  const [editingUser, setEditingUser] = useState(null);
  
  const isGerente = user.role === 'Gerente';
  const isSubGerente = user.role === 'Subgerente';

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tight">CONTROLO DE ACESSOS</h2>
          <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Gestão de credenciais e objetivos comerciais</p>
        </div>
        {isGerente && (
          <button className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20">
            <UserPlus size={16} /> NOVO UTILIZADOR
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-lg font-black text-neutral-500 border border-neutral-700/50">
                 {u.name[0]}
               </div>
               <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-500 transition-colors">{u.name}</h4>
                  <span className="text-[9px] bg-blue-600/10 text-blue-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter italic border border-blue-500/10">
                    {u.role}
                  </span>
               </div>
            </div>

            <div className="space-y-2 border-t border-neutral-800 pt-6">
               {/* APENAS O GERENTE MASTER PODE RESETAR SENHAS */}
               {isGerente ? (
                 <button 
                  onClick={() => setEditingUser({ ...u, mode: 'password' })}
                  className="w-full flex items-center justify-between p-3.5 bg-black/40 hover:bg-black rounded-xl border border-transparent hover:border-neutral-800 transition-all"
                 >
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-widest"><Key size={12} className="text-blue-600"/> Senha</div>
                    <span className="text-[10px] text-neutral-600 font-mono tracking-[0.3em]">********</span>
                 </button>
               ) : (
                 <div className="w-full flex items-center justify-between p-3.5 bg-neutral-900/20 rounded-xl opacity-40">
                    <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-bold uppercase tracking-widest"><Lock size={12}/> Senha</div>
                    <span className="text-[9px] text-neutral-700 italic">Protegido</span>
                 </div>
               )}

               {/* GERENTE E SUBGERENTE PODEM AJUSTAR METAS DE VENDEDORES */}
               {(isGerente || isSubGerente) && u.role === 'Representante' && (
                 <button 
                  onClick={() => setEditingUser({ ...u, mode: 'goal' })}
                  className="w-full flex items-center justify-between p-3.5 bg-black/40 hover:bg-black rounded-xl border border-transparent hover:border-neutral-800 transition-all mt-2"
                 >
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-bold uppercase tracking-widest"><Target size={12} className="text-blue-600"/> Meta Mensal</div>
                    <span className="text-[10px] text-white font-black italic">R$ {u.monthlyGoal?.toLocaleString('pt-BR')}</span>
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE EDIÇÃO DE DADOS SENSÍVEIS */}
      {editingUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-base font-black text-white uppercase italic tracking-tight">
                 {editingUser.mode === 'password' ? 'Redefinir Credenciais' : 'Ajustar Meta Mensal'}
               </h3>
               <button onClick={() => setEditingUser(null)} className="p-2 bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all"><X size={20}/></button>
            </div>
            
            <div className="mb-8">
               <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest mb-1 italic">Alteração para:</p>
               <p className="text-sm font-bold text-blue-500">{editingUser.name}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[9px] text-neutral-600 font-bold uppercase block mb-2">{editingUser.mode === 'password' ? 'Nova Senha de Acesso' : 'Novo Valor da Meta (R$)'}</label>
                <input 
                  autoFocus
                  type={editingUser.mode === 'password' ? 'text' : 'number'}
                  placeholder={editingUser.mode === 'password' ? 'Ex: Vendas@2026' : 'Ex: 50000'}
                  className="w-full bg-black border border-neutral-800 p-4 rounded-2xl text-white outline-none focus:border-blue-600 transition-all text-sm font-bold"
                  onChange={(e) => setEditingUser({ ...editingUser, newValue: e.target.value })}
                />
              </div>

              <button 
                onClick={() => {
                  const update = editingUser.mode === 'password' 
                    ? { password: editingUser.newValue } 
                    : { monthlyGoal: parseFloat(editingUser.newValue) };
                  onUpdateUser(editingUser.id, update);
                  setEditingUser(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 transition-all"
              >
                <Save size={16}/> Confirmar Alteração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
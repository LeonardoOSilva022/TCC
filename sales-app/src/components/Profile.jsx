import React from 'react';
import { User, Mail, Shield, Target, Award, Key } from 'lucide-react';

export default function Profile({ user, orders }) {
  const myOrders = orders.filter(o => o.sellerId === user.id);
  const myTotalSales = myOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter">O MEU PERFIL</h2>
        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold">Gestão de conta e credenciais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card Principal de Identificação */}
        <div className="md:col-span-1 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
          <div className="w-24 h-24 rounded-[2rem] bg-neutral-800 flex items-center justify-center text-3xl font-black text-neutral-400 border-2 border-neutral-700 shadow-2xl relative z-10 mb-4 rotate-3">
            {user.name[0]}
          </div>
          <h3 className="text-xl font-bold text-white mb-1 z-10">{user.name}</h3>
          <span className="text-[10px] bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full font-black uppercase tracking-widest z-10">
            {user.role}
          </span>
          <div className="w-full mt-8 space-y-4">
            <div className="flex items-center gap-3 text-neutral-400 bg-black/30 p-3 rounded-xl border border-neutral-800/50">
              <Mail size={16} className="text-blue-500" />
              <span className="text-xs font-bold truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-400 bg-black/30 p-3 rounded-xl border border-neutral-800/50">
              <Shield size={16} className="text-blue-500" />
              <span className="text-xs font-bold">ID do Sistema: #{user.id}</span>
            </div>
          </div>
        </div>

        {/* Informações Operacionais */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target size={16} className="text-blue-500" /> Resumo Operacional
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 p-5 rounded-2xl border border-neutral-800">
                <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Vendas Concluídas</p>
                <p className="text-2xl font-black text-white italic">{myOrders.length} <span className="text-xs font-normal text-neutral-600 not-italic">pedidos</span></p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-neutral-800">
                <p className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Faturamento Total</p>
                <p className="text-2xl font-black text-emerald-500 italic">R$ {myTotalSales.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Key size={16} className="text-blue-500" /> Segurança da Conta
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Para garantir a segurança das informações comerciais, as alterações de palavra-passe ou de e-mail devem ser solicitadas diretamente à gerência.
            </p>
            <button className="bg-neutral-800 text-neutral-400 p-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 w-full hover:bg-neutral-700 hover:text-white transition-all">
              Solicitar Atualização de Dados
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
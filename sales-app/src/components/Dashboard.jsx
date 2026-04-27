import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Target, Award, ArrowUpRight, X, ChevronRight } from 'lucide-react';

export default function Dashboard({ user, orders, usersList }) {
  const [viewingSeller, setViewingSeller] = useState(null);
  const isManagement = user.role === 'Gerente' || user.role === 'Subgerente';
  
  const displayOrders = isManagement ? orders : orders.filter(o => o.sellerId === user.id);
  const totalSales = displayOrders.reduce((sum, o) => sum + o.total, 0);
  
  const totalGoal = isManagement 
    ? (usersList || []).reduce((sum, u) => sum + (u.monthlyGoal || 0), 0)
    : (user.monthlyGoal || 0);

  const goalProgress = (totalSales / (totalGoal || 1)) * 100;
  const commission = isManagement ? (totalSales * 0.02) : (totalSales * 0.05);

  const teamToDisplay = (usersList || []).filter(u => u.role !== 'Gerente');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter">
            {isManagement ? 'PANORAMA GLOBAL' : 'MINHA PERFORMANCE'}
          </h2>
          <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold">
            Monitoramento consolidado de vendas e metas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <Target className="absolute -right-2 -top-2 w-20 h-20 text-blue-600/10 group-hover:rotate-12 transition-transform" />
          <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Meta {isManagement ? 'Global' : 'Pessoal'}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-white italic">{goalProgress.toFixed(1)}%</h3>
            <span className="text-[10px] text-neutral-700 font-bold uppercase">de R$ {totalGoal.toLocaleString('pt-BR')}</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-black rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min(goalProgress, 100)}%` }}></div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <TrendingUp className="absolute -right-2 -top-2 w-20 h-20 text-emerald-600/10 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Volume Faturado</p>
          <h3 className="text-2xl font-black text-white italic">R$ {totalSales.toLocaleString('pt-BR')}</h3>
          <p className="text-[9px] text-emerald-500 font-bold mt-2 uppercase flex items-center gap-1"><ArrowUpRight size={10}/> Total acumulado</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <DollarSign className="absolute -right-2 -top-2 w-20 h-20 text-yellow-600/10" />
          <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">{isManagement ? 'Ganhos Gerenciais (2%)' : 'Comissão Prevista (5%)'}</p>
          <h3 className="text-2xl font-black text-yellow-500 italic">R$ {commission.toLocaleString('pt-BR')}</h3>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden group">
          <Award className="absolute -right-2 -top-2 w-20 h-20 text-purple-600/10" />
          <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Total de Pedidos</p>
          <h3 className="text-2xl font-black text-white italic">{displayOrders.length}</h3>
        </div>
      </div>

      {isManagement && (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8">
           <h3 className="text-sm font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-2 italic">
             <div className="w-1.5 h-4 bg-blue-600"></div> Ranking da Equipe (Clique para Detalhes)
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {teamToDisplay.map((rep, idx) => {
               const repSales = orders.filter(o => o.sellerId === rep.id).reduce((sum, o) => sum + o.total, 0);
               const repProgress = (repSales / (rep.monthlyGoal || 1)) * 100;
               return (
                 <div 
                  key={idx} 
                  onClick={() => setViewingSeller(rep)}
                  className="bg-black/30 p-5 rounded-2xl border border-neutral-800 hover:border-blue-500 hover:scale-[1.02] cursor-pointer transition-all group"
                 >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{rep.name}</h4>
                        <p className="text-[9px] text-neutral-600 font-black uppercase italic tracking-tighter mt-1">
                          Vendido: R$ {repSales.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className="text-[10px] font-black text-blue-500 bg-blue-500/5 px-2 py-1 rounded-lg">
                        {repProgress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${Math.min(repProgress, 100)}%` }}></div>
                    </div>
                 </div>
               );
             })}
           </div>
        </div>
      )}

      {/* MODAL: Resumo de Pedidos do Vendedor */}
      {viewingSeller && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-[2rem] flex flex-col max-h-[80vh] overflow-hidden animate-scale-in">
            <header className="p-6 border-b border-neutral-800 flex justify-between items-center bg-black/20">
              <div>
                <h3 className="text-lg font-black text-white italic tracking-tight">RESUMO: {viewingSeller.name.toUpperCase()}</h3>
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Lista de Pedidos Vinculados</p>
              </div>
              <button onClick={() => setViewingSeller(null)} className="p-2 bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all"><X size={20}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {orders.filter(o => o.sellerId === viewingSeller.id).length > 0 ? (
                orders.filter(o => o.sellerId === viewingSeller.id).map(order => (
                  <div key={order.id} className="bg-black/40 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between group hover:border-neutral-700 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">#{order.id}</span>
                        <span className={`text-[9px] font-bold uppercase ${order.status === 'Pago' ? 'text-emerald-500' : 'text-yellow-500'}`}>{order.status}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate w-48">{order.client}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-black text-sm italic leading-none">R$ {order.total.toLocaleString('pt-BR')}</p>
                      <p className="text-[9px] text-neutral-600 font-bold uppercase mt-1">{order.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-20 italic text-sm">Nenhum pedido encontrado.</div>
              )}
            </div>
            <footer className="p-6 border-t border-neutral-800 bg-black/10 flex justify-between items-center">
              <span className="text-[10px] text-neutral-500 font-bold uppercase">Total Acumulado</span>
              <span className="text-xl font-black text-white italic">R$ {orders.filter(o => o.sellerId === viewingSeller.id).reduce((sum, o) => sum + o.total, 0).toLocaleString('pt-BR')}</span>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
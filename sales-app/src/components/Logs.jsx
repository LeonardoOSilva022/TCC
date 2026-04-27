import React from 'react';
import { ClipboardList, User, Clock } from 'lucide-react';

export default function Logs({ logs, user }) {
  if (user.role !== 'Gerente') return <div className="text-center p-20 text-red-500 font-bold uppercase italic tracking-widest">Acesso Restrito ao Master</div>;
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-2xl">
        <h2 className="text-white font-bold mb-8 flex items-center gap-3 italic text-xl uppercase tracking-tighter"><ClipboardList className="text-blue-500" /> Histórico de Atividade</h2>
        <div className="space-y-3">
          {logs.length === 0 ? <p className="text-center text-neutral-700 py-10 italic">Aguardando atividades...</p> : logs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-black/40 border border-neutral-800 rounded-xl group transition-all hover:border-neutral-700">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-800 rounded-lg text-neutral-500 group-hover:text-blue-500"><User size={16} /></div>
                  <div><p className="text-sm text-neutral-300 font-medium leading-none">{log.action}</p><p className="text-[9px] text-neutral-600 font-black uppercase mt-1 tracking-widest">{log.user}</p></div>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 font-mono text-[10px]"><Clock size={12}/> {log.time}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
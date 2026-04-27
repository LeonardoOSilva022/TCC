import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Package, Truck, CheckCircle, Clock, 
  X, QrCode, Copy, FileText, Printer, RotateCcw, Trash2, List, Download, Lock, Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const COLUMNS = [
  { id: 'Aguardando Pagamento', title: 'Pendente', icon: Clock, color: 'text-yellow-500' },
  { id: 'Pago', title: 'Aprovado', icon: CheckCircle, color: 'text-emerald-500' },
  { id: 'Em Separação', title: 'Logística', icon: Package, color: 'text-purple-500' },
  { id: 'Enviado', title: 'Trânsito', icon: Truck, color: 'text-blue-500' }
];

export default function Kanban({ user, orders, updateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mobileTab, setMobileTab] = useState('Aguardando Pagamento');
  const [qrCodeData, setQrCodeData] = useState('');

  const isManagement = user.role === 'Gerente' || user.role === 'Subgerente';

  const move = (id, current, dir) => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    const next = idx + dir;
    if (next >= 0 && next < COLUMNS.length) updateStatus(id, COLUMNS[next].id);
  };

  const filteredOrders = (status) => {
    const list = orders.filter(o => status === 'Aguardando Pagamento' ? (o.status === status || o.status === 'Aguardando Correção') : o.status === status);
    return list;
  };

  const generatePix = async (order) => {
    const url = await QRCode.toDataURL(`PIX-${order.id}-${order.total}`);
    setQrCodeData(url);
  };

  const generateBoletoPDF = (order) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text("BANCO SALES.IO - FICHA DE COMPENSAÇÃO", 10, 20);
    doc.setFontSize(10); doc.rect(10, 30, 190, 50);
    doc.text(`CLIENTE: ${order.client}`, 15, 45);
    doc.text(`VALOR: R$ ${order.total.toLocaleString()}`, 15, 55);
    doc.text("LINHA DIGITAVEL: 00190.00009 02345.678901 23456.789012 8 12345678901234", 15, 70);
    doc.text("|| |||| ||| ||||| || |||| ||| |||| || ||||| ||| |||| |||| ||| ||", 40, 100);
    doc.save(`Boleto_${order.id}.pdf`);
  };

  return (
    <div className="h-full flex flex-col space-y-4 font-sans">
      
      {/* Abas Mobile */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {COLUMNS.map(col => (
          <button key={col.id} onClick={() => setMobileTab(col.id)} className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${mobileTab === col.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
            {col.title.toUpperCase()} ({filteredOrders(col.id).length})
          </button>
        ))}
      </div>

      <div className="flex-1 flex lg:flex-row flex-col gap-6 overflow-x-auto">
        {COLUMNS.map((column) => (
          <div key={column.id} className={`${mobileTab === column.id ? 'flex' : 'hidden lg:flex'} min-w-[320px] bg-neutral-900/40 rounded-3xl border border-neutral-800 flex flex-col max-h-full`}>
            <div className="hidden lg:flex p-4 border-b border-neutral-800 items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{column.title}</h3>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto">
              {filteredOrders(column.id).map(order => (
                <div key={order.id} className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 hover:border-blue-500/50 transition-all cursor-pointer group" onClick={() => { setSelectedOrder(order); generatePix(order); }}>
                  <div className="flex justify-between items-start mb-2"><span className="text-[9px] font-mono text-neutral-600 bg-black px-1.5 py-0.5 rounded">#{order.id}</span></div>
                  <h4 className="font-bold text-white text-sm truncate mb-3">{order.client}</h4>
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-800/50">
                    <span className="text-blue-400 font-bold text-xs">R$ {order.total.toLocaleString()}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); move(order.id, order.status, -1); }} className="p-1 hover:text-white"><ChevronLeft size={16}/></button>
                      <button onClick={(e) => { e.stopPropagation(); move(order.id, order.status, 1); }} className="p-1 hover:text-white"><ChevronRight size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-neutral-900 w-full lg:max-w-5xl h-[95vh] lg:h-auto lg:rounded-3xl border-t lg:border border-neutral-800 flex flex-col overflow-hidden">
            <header className="p-6 border-b border-neutral-800 flex justify-between items-center bg-black/20">
               <div><h2 className="text-lg font-bold">Pedido #{selectedOrder.id}</h2><p className="text-xs text-neutral-500">{selectedOrder.client}</p></div>
               <button onClick={() => setSelectedOrder(null)} className="p-2 bg-neutral-800 rounded-full"><X size={20}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><List size={14}/> Itens</h3>
                  <div className="bg-black/20 rounded-2xl border border-neutral-800 divide-y divide-neutral-800/50">
                    {(selectedOrder.items || []).map((item, i) => (
                      <div key={i} className="p-4 flex justify-between items-center text-sm">
                        <span className="text-neutral-400">{item.name}</span>
                        <span className="text-blue-400 font-bold">R$ {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-neutral-800/50 rounded-2xl flex justify-between items-center">
                    <span className="text-2xl font-black text-white italic">R$ {selectedOrder.total.toLocaleString()}</span>
                  </div>
                  {isManagement && (
                    <div className="grid grid-cols-3 gap-2">
                       <button onClick={() => { updateStatus(selectedOrder.id, 'Pago'); setSelectedOrder(null); }} className="bg-emerald-600 py-3 rounded-xl font-bold text-[10px] uppercase flex flex-col items-center gap-1"><Check size={14}/> Aprovar</button>
                       <button onClick={() => { updateStatus(selectedOrder.id, 'Aguardando Correção'); setSelectedOrder(null); }} className="bg-yellow-500/10 text-yellow-500 py-3 rounded-xl border border-yellow-500/20 font-bold text-[10px] uppercase flex flex-col items-center gap-1"><RotateCcw size={14}/> Corrigir</button>
                       <button onClick={() => { if(window.confirm('Excluir?')) { updateStatus(selectedOrder.id, 'Cancelado'); setSelectedOrder(null); } }} className="bg-red-500/10 text-red-500 py-3 rounded-xl border border-red-500/20 font-bold text-[10px] uppercase flex flex-col items-center gap-1"><Trash2 size={14}/> Cancelar</button>
                    </div>
                  )}
               </div>
               <div className="space-y-6">
                  <div className="bg-white p-4 rounded-3xl flex flex-col items-center gap-4 shadow-2xl">
                     {qrCodeData && <img src={qrCodeData} alt="QR" className="w-40 h-40" />}
                     <button onClick={() => alert('Copiado!')} className="w-full bg-emerald-600/10 text-emerald-600 py-3 rounded-xl text-[10px] font-black border border-emerald-600/20 uppercase">Copiar PIX</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                     <button onClick={() => generateBoletoPDF(selectedOrder)} className="w-full bg-neutral-800 py-4 rounded-xl font-bold text-xs border border-neutral-700 flex items-center justify-center gap-2 text-white"><Printer size={16}/> Gerar Boleto</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
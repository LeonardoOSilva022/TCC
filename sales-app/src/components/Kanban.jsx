import React, { useState } from 'react';
import { 
  X, Clock, CheckCircle, Package, Truck, Check, 
  ChevronRight, DollarSign, ShieldCheck, Printer, Lock, RotateCcw, Trash2, AlertTriangle, List, History 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const COLUMNS = [
  { id: 'Aguardando Correção', title: 'Correção', icon: AlertTriangle },
  { id: 'Aguardando Aprovação', title: 'Pendente', icon: Clock }, // STATUS CORRIGIDO
  { id: 'Aprovado', title: 'Aprovado', icon: ShieldCheck },
  { id: 'Pago', title: 'Pago', icon: DollarSign },
  { id: 'Em Separação', title: 'Logística', icon: Package },
  { id: 'Enviado', title: 'Trânsito', icon: Truck },
  { id: 'Entregue', title: 'Finalizado', icon: Check }
];

export default function Kanban({ user, orders, usersList, products, updateStatus, applyDiscount, updateOrderData }) {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [mobileTab, setMobileTab] = useState('Aguardando Aprovação');
  const [qrCodeData, setQrCodeData] = useState('');
  const [discountInput, setDiscountInput] = useState('');

  const isManagement = user.role === 'Gerente' || user.role === 'Subgerente';
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const isEditingMode = !isManagement && selectedOrder?.status === 'Aguardando Correção';

  const generatePix = async (order) => {
    const url = await QRCode.toDataURL(`PIX-MOCK-${order.id}-${order.total}`);
    setQrCodeData(url);
  };

  const handleApplyDiscount = () => {
    const value = parseFloat(discountInput) || 0;
    if (value > 0 && selectedOrder) {
      applyDiscount(selectedOrder.id, value);
      setDiscountInput('');
      generatePix({ ...selectedOrder, total: selectedOrder.total - value });
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = selectedOrder.items.filter((_, i) => i !== index);
    updateOrderData(selectedOrder.id, newItems);
  };

  const handleAddItem = (e) => {
    const productId = parseInt(e.target.value);
    if (!productId) return;
    const product = products.find(p => p.id === productId);
    if (product) {
      const newItems = [...(selectedOrder.items || []), { name: product.name, price: product.price }];
      updateOrderData(selectedOrder.id, newItems);
    }
    e.target.value = ""; 
  };

  const generateBoletoPDF = (order) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text("BANCO SALES.IO", 10, 20);
    doc.setFontSize(14); doc.text("| 001-9 |", 60, 20);
    doc.setFontSize(11); doc.text("00190.00009 02345.678901 23456.789012 8 12345678901234", 85, 20);
    doc.setLineWidth(0.5); doc.line(10, 25, 200, 25);
    doc.rect(10, 30, 190, 60); doc.line(10, 45, 200, 45); doc.line(10, 60, 200, 60); doc.line(150, 30, 150, 90); 
    
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text("Local de Pagamento", 12, 35);
    doc.setFont("helvetica", "bold"); doc.text("PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO", 12, 40);
    doc.setFont("helvetica", "normal"); doc.text("Vencimento", 152, 35);
    doc.setFont("helvetica", "bold");
    const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 3);
    doc.text(dueDate.toLocaleDateString('pt-BR'), 152, 40);
    
    doc.setFont("helvetica", "normal"); doc.text("Cedente", 12, 50);
    doc.setFont("helvetica", "bold"); doc.text("SALES.IO TECNOLOGIA LTDA", 12, 55);
    doc.setFont("helvetica", "normal"); doc.text("Agência/Código Cedente", 152, 50);
    doc.setFont("helvetica", "bold"); doc.text("1234 / 56789-0", 152, 55);
    
    doc.setFont("helvetica", "normal"); doc.text("Data do Documento", 12, 65);
    doc.setFont("helvetica", "bold"); doc.text(new Date().toLocaleDateString('pt-BR'), 12, 70);
    doc.setFont("helvetica", "normal"); doc.text("Nosso Número", 152, 65);
    doc.setFont("helvetica", "bold"); doc.text(`102030${order.id}`, 152, 70);
    
    doc.setFont("helvetica", "normal"); doc.text("Valor do Documento", 152, 80);
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(`R$ ${order.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 152, 86);
    
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text("Sacado", 12, 100);
    doc.setFont("helvetica", "bold"); doc.text(order.client.toUpperCase(), 12, 105);
    
    doc.setFontSize(24);
    doc.text("|| ||| || ||| || |||| | ||| || |||| || | || |||| || ||| |||", 15, 125);
    doc.text("|| ||| || ||| || |||| | ||| || |||| || | || |||| || ||| |||", 15, 130);
    doc.save(`Boleto_SalesIO_${order.id}.pdf`);
  };

  return (
    <div className="h-full flex flex-col space-y-4 font-sans">
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
        {COLUMNS.map(col => (
          <button key={col.id} onClick={() => setMobileTab(col.id)} className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${mobileTab === col.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
            {col.title.toUpperCase()} ({orders.filter(o => o.status === col.id).length})
          </button>
        ))}
      </div>

      <div className="flex-1 flex lg:flex-row flex-col gap-6 overflow-x-auto lg:overflow-visible">
        {COLUMNS.map((column) => (
          <div key={column.id} className={`${mobileTab === column.id ? 'flex' : 'hidden lg:flex'} min-w-[310px] lg:w-[320px] bg-neutral-900/40 rounded-3xl border border-neutral-800 flex flex-col max-h-full`}>
            
            <div className={`hidden lg:flex p-4 border-b border-neutral-800 items-center justify-between bg-neutral-900/50 rounded-t-3xl ${column.id === 'Aguardando Correção' ? 'border-b-red-500/20' : ''}`}>
              <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${column.id === 'Aguardando Correção' ? 'text-red-500' : 'text-neutral-400'}`}>
                <column.icon size={14} /> {column.title}
              </h3>
            </div>

            <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar">
              {orders.filter(o => o.status === column.id).map(order => {
                const seller = usersList.find(u => u.id === order.sellerId);
                const isCorrection = order.status === 'Aguardando Correção';
                
                return (
                  <div 
                    key={order.id} 
                    className={`bg-neutral-900 p-4 rounded-2xl border ${isCorrection ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-neutral-800'} hover:border-blue-500/50 transition-all cursor-pointer group`} 
                    onClick={() => { setSelectedOrderId(order.id); generatePix(order); }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-neutral-600 bg-black px-1.5 py-0.5 rounded">#{order.id}</span>
                        {isCorrection && (
                          <span className="text-[8px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                            Ação Necessária
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-blue-500/70 uppercase truncate max-w-[100px]">{seller?.name || 'Sistema'}</span>
                    </div>
                    
                    <h4 className="font-bold text-white text-sm truncate mb-3">{order.client}</h4>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-800/50">
                      <span className={`font-black text-sm ${isCorrection ? 'text-red-400' : 'text-blue-400'}`}>
                        R$ {order.total.toLocaleString('pt-BR')}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={(e) => { e.stopPropagation(); }} className="p-1 text-neutral-600"><ChevronRight size={14}/></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="bg-neutral-900 w-full lg:max-w-5xl h-[92vh] lg:h-auto lg:rounded-3xl border-t lg:border border-neutral-800 flex flex-col overflow-hidden animate-slide-up">
            <header className="p-5 border-b border-neutral-800 flex justify-between items-center shrink-0 bg-black/20">
               <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Pedido #{selectedOrder.id}
                    {isEditingMode && <span className="text-[9px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-yellow-500/20">Modo de Correção</span>}
                  </h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">{selectedOrder.client}</p>
               </div>
               <button onClick={() => setSelectedOrderId(null)} className="p-2 bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-all"><X size={20}/></button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2"><List size={14}/> Itens da Operação</h3>
                  
                  <div className="bg-black/20 rounded-2xl border border-neutral-800 divide-y divide-neutral-800/30 overflow-hidden">
                    <div className="max-h-40 overflow-y-auto custom-scrollbar">
                      {(selectedOrder.items || []).map((item, i) => (
                        <div key={i} className="p-4 flex justify-between items-center text-xs">
                          <span className="text-neutral-300 truncate mr-2">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-blue-400 font-bold">R$ {item.price.toLocaleString('pt-BR')}</span>
                            {isEditingMode && (
                              <button onClick={() => handleRemoveItem(i)} className="text-neutral-500 hover:text-red-500 transition-colors" title="Excluir item">
                                <X size={14}/>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {isEditingMode && (
                      <div className="p-3 bg-neutral-900/50">
                        <select onChange={handleAddItem} defaultValue="" className="w-full bg-black border border-neutral-800 p-2.5 rounded-lg text-xs text-neutral-400 outline-none focus:border-blue-500 cursor-pointer">
                          <option value="" disabled>+ Adicionar Produto</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    {/* Botão de desconto aparece para Aguardando Aprovação e Aprovado */}
                    {isManagement && ['Aguardando Aprovação', 'Aprovado'].includes(selectedOrder.status) && (
                      <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl mb-6">
                        <p className="text-[9px] font-black text-blue-500 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Aplicar Desconto de Negociação</p>
                        <div className="flex gap-2">
                          <input 
                            type="number" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} placeholder="Valor R$" 
                            className="flex-1 bg-black border border-neutral-800 p-2 rounded-lg text-xs text-white outline-none focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]" 
                          />
                          <button onClick={handleApplyDiscount} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-[10px] text-white font-bold transition-all">APLICAR</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* LÓGICA DE BOTÕES CORRIGIDA PARA OS NOVOS STATUS */}
                      {isManagement && ['Aguardando Aprovação', 'Aguardando Correção'].includes(selectedOrder.status) ? (
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => { updateStatus(selectedOrder.id, 'Aprovado'); setSelectedOrderId(null); }} className="bg-blue-600 py-3 rounded-xl font-bold text-[10px] uppercase flex flex-col items-center gap-1 shadow-lg shadow-blue-900/20"><ShieldCheck size={14}/> Aprovar</button>
                          <button onClick={() => { updateStatus(selectedOrder.id, 'Aguardando Correção'); setSelectedOrderId(null); }} className="bg-yellow-500/10 text-yellow-500 py-3 rounded-xl border border-yellow-500/20 font-bold text-[10px] uppercase flex flex-col items-center gap-1"><RotateCcw size={14}/> Corrigir</button>
                          <button onClick={() => { if(window.confirm('Excluir este pedido?')) { updateStatus(selectedOrder.id, 'Cancelado'); setSelectedOrderId(null); } }} className="bg-red-500/10 text-red-500 py-3 rounded-xl border border-red-500/20 font-bold text-[10px] uppercase flex flex-col items-center gap-1"><Trash2 size={14}/> Cancelar</button>
                        </div>
                      ) : isEditingMode ? (
                        <div className="grid grid-cols-2 gap-2">
                          {/* Reenviar pedido muda o status para "Aguardando Aprovação" */}
                          <button 
                            disabled={!selectedOrder.items || selectedOrder.items.length === 0} 
                            onClick={() => { updateStatus(selectedOrder.id, 'Aguardando Aprovação'); setSelectedOrderId(null); }} 
                            className="bg-blue-600 disabled:bg-neutral-800 disabled:text-neutral-500 py-3 rounded-xl font-bold text-[10px] text-white uppercase flex flex-col items-center gap-1 shadow-lg"
                          >
                            <CheckCircle size={14}/> Reenviar Pedido
                          </button>
                          <button onClick={() => { if(window.confirm('Cancelar este pedido definitivamente?')) { updateStatus(selectedOrder.id, 'Cancelado'); setSelectedOrderId(null); } }} className="bg-red-500/10 text-red-500 py-3 rounded-xl border border-red-500/20 font-bold text-[10px] uppercase flex flex-col items-center gap-1"><Trash2 size={14}/> Cancelar</button>
                        </div>
                      ) : selectedOrder.status === 'Aprovado' ? (
                        <button onClick={() => { updateStatus(selectedOrder.id, 'Pago'); setSelectedOrderId(null); }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg"><DollarSign size={16}/> Confirmar Pagamento</button>
                      ) : selectedOrder.status === 'Pago' ? (
                        <button onClick={() => { updateStatus(selectedOrder.id, 'Em Separação'); setSelectedOrderId(null); }} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"><Package size={16}/> Enviar para Logística</button>
                      ) : (
                        <div className="p-4 bg-neutral-800/20 border border-neutral-800 rounded-2xl flex items-center gap-3 italic text-[10px] text-neutral-500"><Lock size={12} /> Status atual do pedido: {selectedOrder.status}</div>
                      )}
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
                     <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><History size={14}/> Rastreio do Cliente</h3>
                     <div className="relative border-l border-neutral-800 ml-2 space-y-5 pb-2">
                        {(selectedOrder.history || []).map((h, i) => (
                           <div key={i} className="pl-5 relative animate-fade-in">
                              <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${i === (selectedOrder.history.length - 1) ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-neutral-600'}`}></div>
                              <p className={`text-[11px] font-black uppercase ${i === (selectedOrder.history.length - 1) ? 'text-white' : 'text-neutral-400'}`}>{h.status}</p>
                              <p className="text-[9px] text-neutral-500 font-mono mt-0.5">{h.date} às {h.time}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  {['Aguardando Aprovação', 'Aprovado'].includes(selectedOrder.status) && (
                    <div className="bg-white p-4 rounded-3xl flex flex-col items-center gap-4 shadow-xl border border-neutral-200">
                       <div className="bg-neutral-100 p-2 rounded-xl">{qrCodeData && <img src={qrCodeData} alt="QR" className="w-32 h-32" />}</div>
                       <button onClick={() => alert('Chave PIX copiada!')} className="w-full bg-emerald-600/10 text-emerald-600 py-3 rounded-xl text-[10px] font-black border border-emerald-600/20 uppercase tracking-widest hover:bg-emerald-600/20 transition-all">Copiar Chave PIX</button>
                    </div>
                  )}
                  
                  <div className="p-6 bg-neutral-800/40 rounded-2xl flex justify-between items-center border border-neutral-800 shadow-inner">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Valor Final Atualizado</span>
                    <span className="text-2xl font-black text-white italic">R$ {selectedOrder.total.toLocaleString('pt-BR')}</span>
                  </div>
                  
                  <button onClick={() => generateBoletoPDF(selectedOrder)} className="w-full bg-neutral-100 text-black py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-white transition-all"><Printer size={16}/> Gerar Boleto Bancário</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
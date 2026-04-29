import React, { useState } from 'react';
import { 
  X, Clock, CheckCircle, Package, Truck, Check, 
  ChevronRight, ChevronLeft, DollarSign, ShieldCheck, Printer, Lock, RotateCcw, Trash2, AlertTriangle, List, History 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const COLUMNS = [
  { id: 'Aguardando Pagamento', title: 'Pendente', icon: Clock },
  { id: 'Aprovado', title: 'Aprovado', icon: ShieldCheck },
  { id: 'Pago', title: 'Pago', icon: DollarSign },
  { id: 'Em Separação', title: 'Logística', icon: Package },
  { id: 'Enviado', title: 'Trânsito', icon: Truck },
  { id: 'Entregue', title: 'Finalizado', icon: Check }
];

export default function Kanban({ user, orders, usersList, updateStatus, applyDiscount }) {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [mobileTab, setMobileTab] = useState('Aguardando Pagamento');
  const [qrCodeData, setQrCodeData] = useState('');
  const [discountInput, setDiscountInput] = useState('');

  const isManagement = user.role === 'Gerente' || user.role === 'Subgerente';
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

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

  // Função para gerar PDF do boleto bancário seguindo padrões bancários brasileiros
  const generateBoletoPDF = (order) => {
    const doc = new jsPDF();
    
    // Cabeçalho do banco com código de roteamento e sequência
    doc.setFont("helvetica", "bold"); 
    doc.setFontSize(16); 
    doc.text("BANCO SALES.IO", 10, 20);
    doc.setFontSize(14);
    doc.text("| 001-9 |", 60, 20);
    doc.setFontSize(11);
    doc.text("00190.00009 02345.678901 23456.789012 8 12345678901234", 85, 20);
    
    // Separador horizontal para dividir cabeçalho dos detalhes de pagamento
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
    
    // Tabela de detalhes do boleto com 4 linhas e coluna direita para valores
    doc.rect(10, 30, 190, 60); 
    doc.line(10, 45, 200, 45); // Linha horizontal 1
    doc.line(10, 60, 200, 60); // Linha horizontal 2
    doc.line(150, 30, 150, 90); // Divisor da coluna direita para valores
    
    // Linha 1: Local de pagamento e data de vencimento (3 dias a partir da emissão)
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    doc.text("Local de Pagamento", 12, 35);
    doc.setFont("helvetica", "bold");
    doc.text("PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO", 12, 40);
    doc.setFont("helvetica", "normal");
    doc.text("Vencimento", 152, 35);
    doc.setFont("helvetica", "bold");
    
    // Calcula data de vencimento como 3 dias a partir da data atual
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    doc.text(dueDate.toLocaleDateString('pt-BR'), 152, 40);
    
    // Linha 2: Informações do cedente (emissor) e detalhes da conta
    doc.setFont("helvetica", "normal");
    doc.text("Cedente", 12, 50);
    doc.setFont("helvetica", "bold");
    doc.text("SALES.IO TECNOLOGIA LTDA", 12, 55);
    doc.setFont("helvetica", "normal");
    doc.text("Agência/Código Cedente", 152, 50);
    doc.setFont("helvetica", "bold");
    doc.text("1234 / 56789-0", 152, 55);
    
    // Linha 3: Data do documento e número sequencial do documento
    doc.setFont("helvetica", "normal");
    doc.text("Data do Documento", 12, 65);
    doc.setFont("helvetica", "bold");
    doc.text(new Date().toLocaleDateString('pt-BR'), 12, 70);
    doc.setFont("helvetica", "normal");
    doc.text("Nosso Número", 152, 65);
    doc.setFont("helvetica", "bold");
    doc.text(`102030${order.id}`, 152, 70);
    
    // Linha 4: Valor do documento (atualizado com descontos aplicados, se houver)
    doc.setFont("helvetica", "normal");
    doc.text("Valor do Documento", 152, 80);
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text(`R$ ${order.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 152, 86);
    
    // Seção de informações do sacado (cliente)
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    doc.text("Sacado", 12, 100);
    doc.setFont("helvetica", "bold");
    doc.text(order.client.toUpperCase(), 12, 105);
    
    // Visualização simulada do código de barras (fins de demonstração - não legível)
    doc.setFontSize(24);
    doc.text("|| ||| || ||| || |||| | ||| || |||| || | || |||| || ||| |||", 15, 125);
    doc.text("|| ||| || ||| || |||| | ||| || |||| || | || |||| || ||| |||", 15, 130);
    doc.text("|| ||| || ||| || |||| | ||| || |||| || | || |||| || ||| |||", 15, 135);
    
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
            <div className="hidden lg:flex p-4 border-b border-neutral-800 items-center justify-between bg-neutral-900/50 rounded-t-3xl">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{column.title}</h3>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar">
              {orders.filter(o => o.status === column.id || (column.id === 'Aguardando Pagamento' && o.status === 'Aguardando Correção')).map(order => {
                const seller = usersList.find(u => u.id === order.sellerId);
                return (
                  <div key={order.id} className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 hover:border-blue-500/50 transition-all cursor-pointer group" onClick={() => { setSelectedOrderId(order.id); generatePix(order); }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono text-neutral-600 bg-black px-1.5 py-0.5 rounded">#{order.id}</span>
                      <span className="text-[9px] font-bold text-blue-500/70 uppercase truncate max-w-[100px]">{seller?.name || 'Sistema'}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm truncate mb-3">{order.client}</h4>
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-800/50">
                      <span className="text-blue-400 font-black text-sm">R$ {order.total.toLocaleString('pt-BR')}</span>
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
                  <h2 className="text-base font-bold text-white">Pedido #{selectedOrder.id}</h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{selectedOrder.client}</p>
               </div>
               <button onClick={() => setSelectedOrderId(null)} className="p-2 bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-all"><X size={20}/></button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2"><List size={14}/> Itens e Operação</h3>
                  <div className="bg-black/20 rounded-2xl border border-neutral-800 divide-y divide-neutral-800/30 max-h-40 overflow-y-auto custom-scrollbar">
                    {(selectedOrder.items || []).map((item, i) => (
                      <div key={i} className="p-4 flex justify-between items-center text-xs">
                        <span className="text-neutral-300 truncate mr-2">{item.name}</span>
                        <span className="text-blue-400 font-bold">R$ {item.price.toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-neutral-800">
                    {isManagement && ['Aguardando Pagamento', 'Aprovado'].includes(selectedOrder.status) && (
                      <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl mb-6">
                        <p className="text-[9px] font-black text-blue-500 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Aplicar Desconto de Negociação</p>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            value={discountInput}
                            onChange={(e) => setDiscountInput(e.target.value)}
                            placeholder="Valor R$" 
                            className="flex-1 bg-black border border-neutral-800 p-2 rounded-lg text-xs text-white outline-none focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]" 
                          />
                          <button onClick={handleApplyDiscount} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-[10px] text-white font-bold transition-all">APLICAR</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {isManagement && ['Aguardando Pagamento', 'Aguardando Correção'].includes(selectedOrder.status) ? (
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => { updateStatus(selectedOrder.id, 'Aprovado'); setSelectedOrderId(null); }} className="bg-blue-600 py-3 rounded-xl font-bold text-[10px] uppercase flex flex-col items-center gap-1 shadow-lg shadow-blue-900/20"><ShieldCheck size={14}/> Aprovar</button>
                          <button onClick={() => { updateStatus(selectedOrder.id, 'Aguardando Correção'); setSelectedOrderId(null); }} className="bg-yellow-500/10 text-yellow-500 py-3 rounded-xl border border-yellow-500/20 font-bold text-[10px] uppercase flex flex-col items-center gap-1"><RotateCcw size={14}/> Corrigir</button>
                          <button onClick={() => { if(window.confirm('Excluir este pedido?')) { updateStatus(selectedOrder.id, 'Cancelado'); setSelectedOrderId(null); } }} className="bg-red-500/10 text-red-500 py-3 rounded-xl border border-red-500/20 font-bold text-[10px] uppercase flex flex-col items-center gap-1"><Trash2 size={14}/> Cancelar</button>
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
                  {/* TIMELINE DE RASTREIO */}
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

                  {['Aguardando Pagamento', 'Aprovado'].includes(selectedOrder.status) && (
                    <div className="bg-white p-4 rounded-3xl flex flex-col items-center gap-4 shadow-xl border border-neutral-200">
                       <div className="bg-neutral-100 p-2 rounded-xl">{qrCodeData && <img src={qrCodeData} alt="QR" className="w-32 h-32" />}</div>
                       <button onClick={() => alert('Chave PIX copiada!')} className="w-full bg-emerald-600/10 text-emerald-600 py-3 rounded-xl text-[10px] font-black border border-emerald-600/20 uppercase tracking-widest hover:bg-emerald-600/20 transition-all">Copiar Chave PIX</button>
                    </div>
                  )}
                  
                  <div className="p-6 bg-neutral-800/40 rounded-2xl flex justify-between items-center border border-neutral-800 shadow-inner">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Valor Final</span>
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
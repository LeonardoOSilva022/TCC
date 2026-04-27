import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function NewOrder({ products, clients, onAddOrder, onSuccess }) {
  const [client, setClient] = useState('');
  const [cart, setCart] = useState([]);
  const [productCode, setProductCode] = useState('');

  const addProduct = () => {
    const prod = products.find(p => p.code.toUpperCase() === productCode.toUpperCase());
    if (!prod) return alert('Código inválido!');
    setCart([...cart, { ...prod, cartId: Math.random() }]);
    setProductCode('');
  };

  const handleFinish = () => {
    if (!client || cart.length === 0) return alert('Dados incompletos!');
    onAddOrder({
      id: Math.floor(Math.random() * 9000 + 1000).toString(),
      client,
      total: cart.reduce((acc, i) => acc + i.price, 0),
      items: cart.map(i => ({ name: i.name, price: i.price })),
      status: 'Aguardando Pagamento',
      date: new Date().toLocaleDateString('pt-BR')
    });
    onSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-sans">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Cliente</label>
          <select className="w-full bg-black border border-neutral-800 p-4 rounded-2xl text-white mt-2" value={client} onChange={e => setClient(e.target.value)}>
            <option value="">Selecione...</option>
            {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Produto (Código)</label>
          <div className="flex gap-2 mt-2">
            <input type="text" value={productCode} onChange={e => setProductCode(e.target.value)} placeholder="Ex: P001" className="flex-1 bg-black border border-neutral-800 p-4 rounded-2xl outline-none" />
            <button onClick={addProduct} className="bg-blue-600 px-6 rounded-2xl"><Plus/></button>
          </div>
        </div>
      </div>
      <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 h-fit space-y-6 shadow-2xl">
        <div className="flex justify-between border-b border-neutral-800 pb-4">
          <h3 className="font-bold flex items-center gap-2"><ShoppingBag size={18}/> Itens</h3>
          <span className="text-blue-500 font-black">{cart.length}</span>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cart.map(item => (
            <div key={item.cartId} className="flex justify-between bg-black/40 p-3 rounded-xl border border-neutral-800">
              <span className="text-xs truncate max-w-[120px]">{item.name}</span>
              <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))}><Trash2 size={14} className="text-neutral-700"/></button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-end border-t border-neutral-800 pt-4">
          <span className="text-2xl font-black italic">R$ {cart.reduce((a, b) => a + b.price, 0).toLocaleString()}</span>
        </div>
        <button onClick={handleFinish} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest">Emitir</button>
      </div>
    </div>
  );
}
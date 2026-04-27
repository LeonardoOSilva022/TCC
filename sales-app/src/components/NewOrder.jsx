import React, { useState } from 'react';
import { 
  Plus, Trash2, ShoppingBag, User, 
  ChevronRight, CheckCircle2, Lock, Unlock 
} from 'lucide-react';

export default function NewOrder({ user, products, clients, onAddOrder, onSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState('');
  const [cart, setCart] = useState([]);
  
  const isManagement = user.role === 'Gerente' || user.role === 'Subgerente';

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now(), isManual: false }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const handlePriceChange = (cartId, newPrice) => {
    if (!isManagement) return;
    setCart(cart.map(item => 
      item.cartId === cartId 
        ? { ...item, price: parseFloat(newPrice) || 0, isManual: true } 
        : item
    ));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = () => {
    if (!selectedClient || cart.length === 0) return;
    const newOrder = {
      id: Math.floor(Math.random() * 90000) + 10000,
      client: selectedClient,
      items: cart,
      total: calculateTotal(),
      status: 'Aguardando Pagamento',
      date: new Date().toLocaleDateString('pt-BR'),
      hasNegotiation: cart.some(item => item.isManual)
    };
    onAddOrder(newOrder);
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white">Novo Pedido</h2>
          <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mt-1">
            {step === 1 ? 'Identificação do Cliente' : 'Seleção e Negociação'}
          </p>
        </div>
      </div>

      {step === 1 ? (
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl space-y-6">
          <select 
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-blue-500"
          >
            <option value="">Selecione o Cliente...</option>
            {clients.map(c => <option key={c.id} value={c.name}>{c.name} - {c.city}</option>)}
          </select>
          <button 
            disabled={!selectedClient}
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 disabled:opacity-50 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all"
          >
            Avançar <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {products.map(product => (
                <div key={product.id} className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-bold text-white">{product.name}</p>
                    <p className="text-[10px] text-blue-500 font-bold">R$ {product.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <button onClick={() => addToCart(product)} className="p-2 bg-blue-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col h-fit">
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.cartId} className="p-3 bg-black/40 rounded-xl border border-neutral-800/50">
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] text-neutral-400 truncate w-32">{item.name}</span>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-neutral-600 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                  <div className="relative group">
                    <input 
                      type="number"
                      value={item.price}
                      disabled={!isManagement}
                      onChange={(e) => handlePriceChange(item.cartId, e.target.value)}
                      /* Classes adicionadas para remover as setinhas de número */
                      className={`w-full bg-neutral-900 border ${item.isManual ? 'border-yellow-500/50 text-yellow-500' : 'border-neutral-800 text-blue-400'} p-2 rounded-lg text-xs font-bold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100">
                      {isManagement ? <Unlock size={10} className="text-blue-500" /> : <Lock size={10} className="text-neutral-700" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-800 pt-6 mt-auto">
              <div className="flex justify-between items-end mb-6">
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Total Geral</span>
                <span className="text-2xl font-black text-white italic">R$ {calculateTotal().toLocaleString('pt-BR')}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setStep(1)} className="p-4 bg-neutral-800 hover:bg-neutral-700 transition-all text-neutral-400 rounded-2xl text-xs font-bold">Voltar</button>
                <button disabled={cart.length === 0} onClick={handleSubmit} className="p-4 bg-emerald-600 hover:bg-emerald-500 transition-all text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2">Fechar Pedido <CheckCircle2 size={16}/></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
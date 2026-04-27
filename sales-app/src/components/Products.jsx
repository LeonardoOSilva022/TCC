import React, { useState } from 'react';
import { Package, Plus, Search, Trash2, Tag, Hash, Archive, X, Save } from 'lucide-react';

export default function Products({ user, products, onDelete, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', code: '', price: '', stock: '' });

  // Apenas gestão pode adicionar ou remover produtos
  const isManagement = user.role === 'Gerente' || user.role === 'Subgerente';

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price) return;
    onAdd({
      id: Date.now(),
      name: newProduct.name,
      code: newProduct.code || `P${Math.floor(Math.random() * 1000)}`,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0
    });
    setIsAdding(false);
    setNewProduct({ name: '', code: '', price: '', stock: '' });
  };

  return (
    // Adicionado padding bottom no mobile para não grudar no fundo
    <div className="space-y-6 animate-fade-in pb-10 lg:pb-0">
      
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tight">CATÁLOGO</h2>
          <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Gestão de portfólio e estoque</p>
        </div>
        {isManagement && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-500 p-4 lg:p-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            <Plus size={16} /> NOVO PRODUTO
          </button>
        )}
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
        <input
          type="text"
          placeholder="Buscar por nome ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 py-4 pl-12 pr-4 rounded-2xl text-sm text-white outline-none focus:border-blue-600 transition-all"
        />
      </div>

      {/* LISTAGEM EM CARDS (Perfeito para Mobile e Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl flex flex-col group hover:border-neutral-700 transition-all">
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-black flex shrink-0 items-center justify-center border border-neutral-800">
                  <Package size={16} className="text-blue-500" />
                </div>
                <div className="min-w-0"> {/* min-w-0 ajuda o truncate a funcionar no flex */}
                  <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                  <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 mt-0.5">
                    <Hash size={10}/> {product.code}
                  </span>
                </div>
              </div>
              
              {isManagement && (
                <button 
                  onClick={() => { if(window.confirm('Excluir produto?')) onDelete(product.id) }} 
                  className="text-neutral-600 hover:text-red-500 p-2 shrink-0 rounded-lg hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-neutral-800/50">
              <div>
                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Tag size={10}/> Preço Base
                </p>
                <p className="text-sm font-black text-white italic">R$ {product.price.toLocaleString('pt-BR')}</p>
              </div>
              <div className="text-right lg:text-left">
                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mb-1 flex items-center justify-end lg:justify-start gap-1">
                  <Archive size={10}/> Estoque
                </p>
                <p className={`text-sm font-bold ${product.stock < 20 ? 'text-yellow-500' : 'text-neutral-300'}`}>
                  {product.stock} un
                </p>
              </div>
            </div>
            
          </div>
        ))}

        {/* FEEDBACK DE BUSCA VAZIA */}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-neutral-800 rounded-3xl">
            <Package size={32} className="text-neutral-700 mx-auto mb-3" />
            <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest">Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {/* MODAL DE ADICIONAR PRODUTO (Ajustado para não vazar no mobile) */}
      {isAdding && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-[2rem] p-6 lg:p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-white uppercase italic tracking-tight">CADASTRAR PRODUTO</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-neutral-600 font-bold uppercase block mb-1">Nome do Produto</label>
                <input 
                  type="text" 
                  value={newProduct.name} 
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                  className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-blue-600 text-sm transition-all" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] text-neutral-600 font-bold uppercase block mb-1">Código (SKU)</label>
                  <input 
                    type="text" 
                    value={newProduct.code} 
                    onChange={e => setNewProduct({...newProduct, code: e.target.value})} 
                    className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-blue-600 text-sm font-mono transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-neutral-600 font-bold uppercase block mb-1">Estoque Inicial</label>
                  <input 
                    type="number" 
                    value={newProduct.stock} 
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})} 
                    className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-blue-600 text-sm transition-all" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[9px] text-neutral-600 font-bold uppercase block mb-1">Preço de Tabela (R$)</label>
                <input 
                  type="number" 
                  value={newProduct.price} 
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                  className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-white outline-none focus:border-blue-600 text-sm transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]" 
                />
              </div>

              <button 
                onClick={handleAdd} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 mt-6 transition-all active:scale-[0.98]"
              >
                <Save size={16}/> Salvar Produto
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
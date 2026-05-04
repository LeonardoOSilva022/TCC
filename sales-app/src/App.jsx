import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, KanbanSquare, LogOut, Bell, 
  Package, Shield, Users, ClipboardList, X, Menu, CheckCircle, Info, UserCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Kanban from './components/Kanban';
import Products from './components/Products';
import Team from './components/Team';
import NewOrder from './components/NewOrder';
import Clients from './components/Clients';
import Logs from './components/Logs';
import Profile from './components/Profile';
import Login from './components/Login';

// Importando os dados do arquivo externo
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CLIENTS } from './data/mockData';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Bem-vindo ao SALES.IO. Boas vendas!", time: "Agora", read: false }
  ]);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('salesio_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('salesio_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('salesio_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('salesio_clients');
    return saved ? JSON.parse(saved) : MOCK_CLIENTS;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('salesio_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('salesio_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('salesio_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('salesio_users', JSON.stringify(usersList)); }, [usersList]);
  useEffect(() => { localStorage.setItem('salesio_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('salesio_logs', JSON.stringify(logs)); }, [logs]);

  if (!user) return <Login onLogin={setUser} />;

  const addLog = (action) => {
    setLogs(prev => [{ id: Date.now(), user: user.name, action, time: new Date().toLocaleTimeString('pt-BR') }, ...prev]);
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const updateOrderStatus = (id, status) => {
    const now = new Date();
    const dataAtual = now.toLocaleDateString('pt-BR');
    const horaAtual = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const novoHistorico = [...(o.history || []), { status: status, date: dataAtual, time: horaAtual }];
        return { ...o, status, history: novoHistorico };
      }
      return o;
    }));
    
    addLog(`Pedido #${id} movido para ${status}`);
    showToast(`Status atualizado: ${status}`);

    setTimeout(() => {
      showToast(`Automação: E-mail de rastreio (${status}) enviado ao cliente.`, 'info');
    }, 1500);
  };

  const applyDiscount = (id, amount) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, total: Math.max(0, o.total - amount) } : o
    ));
    addLog(`Desconto de R$ ${amount} aplicado no Pedido #${id}`);
    showToast(`Desconto de R$ ${amount} aplicado!`);
  };

  const updateOrderData = (id, newItems) => {
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, items: newItems, total: newTotal };
      }
      return o;
    }));
    showToast(`Itens do pedido atualizados!`, 'info');
  };

  const updateUser = (userId, data) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    const field = Object.keys(data)[0];
    addLog(`Alteração de ${field} para o usuário ID #${userId}`);
    showToast("Dados da equipe atualizados!");
  };

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new_order', label: 'Novo Pedido', icon: ShoppingCart },
    { id: 'kanban', label: 'Vendas', icon: KanbanSquare },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'team', label: 'Equipe', icon: Shield },
    { id: 'logs', label: 'Auditoria', icon: ClipboardList },
    { id: 'profile', label: 'O Meu Perfil', icon: UserCircle },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 font-sans text-neutral-200 overflow-hidden relative">
      <div className="fixed top-5 right-5 z-[110] space-y-3">
        {toasts.map(t => (
          <div key={t.id} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-2xl animate-fade-in">
            {t.type === 'success' ? <CheckCircle className="text-emerald-500 shrink-0" size={18}/> : <Info className="text-blue-500 shrink-0" size={18}/>}
            <span className="text-sm font-bold">{t.message}</span>
          </div>
        ))}
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/80 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed lg:relative z-[70] h-full w-72 bg-neutral-900 flex flex-col border-r border-neutral-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-neutral-800">
          <span className="text-xl font-bold text-white tracking-tight italic">SALES<span className="text-blue-500">.</span>IO</span>
          <button className="lg:hidden text-neutral-500" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-neutral-500 hover:bg-neutral-800'}`}>
              <item.icon size={18} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <button onClick={() => setUser(null)} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-neutral-500 hover:text-red-400 py-3 rounded-lg uppercase transition-all"><LogOut size={16} /> Sair</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 bg-neutral-800 rounded-lg text-neutral-400" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-bold text-white capitalize italic tracking-tight">{activeTab.replace('_', ' ')}</h1>
              <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">{user.name} | {user.role}</span>
            </div>
          </div>
          
          <button 
            onClick={() => { setIsNotifyOpen(true); setNotifications(n => n.map(not => ({...not, read: true}))); }} 
            className="relative p-2.5 bg-neutral-800 text-neutral-400 rounded-xl border border-neutral-700 hover:text-white transition-all active:scale-95"
          >
            <Bell size={20} />
            {notifications.some(n => !n.read) && <span className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-neutral-900 animate-pulse"></span>}
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 bg-neutral-950">
          {activeTab === 'dashboard' && <Dashboard user={user} orders={orders} usersList={usersList} />}
          {activeTab === 'kanban' && <Kanban user={user} orders={orders} usersList={usersList} products={products} updateStatus={updateOrderStatus} applyDiscount={applyDiscount} updateOrderData={updateOrderData} />}
          {activeTab === 'products' && <Products user={user} products={products} onDelete={(id) => setProducts(products.filter(p => p.id !== id))} onAdd={(p) => setProducts([p, ...products])} />}
          {activeTab === 'team' && <Team user={user} users={usersList} onUpdateUser={updateUser} onAdd={(u) => setUsersList([...usersList, u])} />}
          
          {activeTab === 'new_order' && <NewOrder user={user} products={products} clients={clients} onAddOrder={(o) => setOrders([{...o, sellerId: user.id, history: [{status: 'Aguardando Aprovação', date: new Date().toLocaleDateString('pt-BR'), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}]}, ...orders])} onSuccess={() => setActiveTab('kanban')} />}
          
          {activeTab === 'clients' && <Clients clients={clients} onAdd={(c) => setClients([c, ...clients])} />}
          {activeTab === 'logs' && <Logs logs={logs} user={user} />}
          {activeTab === 'profile' && <Profile user={user} orders={orders} />}
        </div>
      </main>

      {isNotifyOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsNotifyOpen(false)}></div>
          <div className="relative w-80 bg-neutral-900 border-l border-neutral-800 h-full p-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-8"><h3 className="font-bold text-white text-lg">Notificações</h3><X className="cursor-pointer text-neutral-500 hover:text-white" onClick={() => setIsNotifyOpen(false)} /></div>
            <div className="space-y-4">
              {notifications.map(n => (
                <div key={n.id} className="p-4 bg-black/20 border border-neutral-800 rounded-2xl text-[11px] text-neutral-400">
                  <p className="leading-relaxed">{n.text}</p><span className="text-[9px] text-neutral-600 mt-2 block">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
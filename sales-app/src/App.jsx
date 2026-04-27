import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, KanbanSquare, LogOut, Bell, 
  Package, Shield, Users, ClipboardList, X, Menu, CheckCircle, Info 
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Kanban from './components/Kanban';
import Products from './components/Products';
import Team from './components/Team';
import NewOrder from './components/NewOrder';
import Clients from './components/Clients';
import Logs from './components/Logs';
import Login from './components/Login';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CLIENTS } from './data/mockData';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [logs, setLogs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Sistema SALES.IO operando em modo responsivo.", time: "Agora", read: false }
  ]);

  if (!user) return <Login onLogin={setUser} />;

  const addLog = (action) => {
    setLogs(prev => [{ id: Date.now(), user: user.name, action, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addLog(`Pedido #${id} -> ${status}`);
    showToast(`Status: ${status}`);
  };

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new_order', label: 'Novo Pedido', icon: ShoppingCart },
    { id: 'kanban', label: 'Vendas', icon: KanbanSquare },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'team', label: 'Equipe', icon: Shield },
    { id: 'logs', label: 'Auditoria', icon: ClipboardList },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 font-sans text-neutral-200 overflow-hidden relative">
      
      {/* Toast System */}
      <div className="fixed top-5 right-5 z-[110] space-y-3">
        {toasts.map(t => (
          <div key={t.id} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-2xl animate-fade-in">
            {t.type === 'success' ? <CheckCircle className="text-emerald-500" size={18}/> : <Info className="text-blue-500" size={18}/>}
            <span className="text-sm font-bold">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/80 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed lg:relative z-[70] h-full w-72 bg-neutral-900 flex flex-col border-r border-neutral-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-neutral-800">
          <span className="text-xl font-bold text-white">SALES<span className="text-blue-500">.</span>IO</span>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:bg-neutral-800'}`}>
              <item.icon size={18} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <button onClick={() => setUser(null)} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-neutral-500 py-3 rounded-lg uppercase"><LogOut size={16} /> Sair</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 bg-neutral-800 rounded-lg" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <h1 className="text-lg font-bold text-white capitalize hidden sm:block">{activeTab.replace('_', ' ')}</h1>
          </div>
          <button onClick={() => setIsNotifyOpen(true)} className="relative p-2.5 bg-neutral-800 text-neutral-400 rounded-xl border border-neutral-700">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full"></span>
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 bg-neutral-950">
          {activeTab === 'dashboard' && <Dashboard user={user} orders={orders} />}
          {activeTab === 'kanban' && <Kanban user={user} orders={orders} updateStatus={updateOrderStatus} />}
          {activeTab === 'products' && <Products user={user} products={products} onDelete={(id) => setProducts(products.filter(p => p.id !== id))} onAdd={(p) => setProducts([p, ...products])} />}
          {activeTab === 'team' && <Team user={user} users={usersList} onAdd={(u) => setUsersList([...usersList, u])} />}
          {activeTab === 'new_order' && <NewOrder user={user} products={products} clients={clients} onAddOrder={(o) => setOrders([o, ...orders])} onSuccess={() => setActiveTab('kanban')} />}
          {activeTab === 'clients' && <Clients clients={clients} onAdd={(c) => setClients([c, ...clients])} />}
          {activeTab === 'logs' && <Logs logs={logs} user={user} />}
        </div>
      </main>

      {/* Drawer Notificações */}
      {isNotifyOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsNotifyOpen(false)}></div>
          <div className="relative w-80 bg-neutral-900 border-l border-neutral-800 h-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-8"><h3 className="font-bold text-white">Alertas</h3><X className="cursor-pointer" onClick={() => setIsNotifyOpen(false)} /></div>
            <div className="space-y-4">
              {notifications.map(n => (
                <div key={n.id} className="p-4 bg-black/20 border border-neutral-800 rounded-xl text-xs text-neutral-400">{n.text}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
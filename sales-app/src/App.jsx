import React, { useState } from 'react';
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
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CLIENTS } from './data/mockData';

// Componente principal da aplicação que gerencia o estado global e roteamento
export default function App() {
  // Estados para autenticação do usuário, aba ativa, visibilidade da sidebar e notificações
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  
  // Estados para dados da aplicação: pedidos, produtos, usuários, clientes, logs, toasts e notificações
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [logs, setLogs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Bem-vindo ao SALES.IO. Boas vendas!", time: "Agora", read: false }
  ]);

  // Redireciona para login se nenhum usuário estiver autenticado
  if (!user) return <Login onLogin={setUser} />;

  // Função para adicionar uma nova entrada de log para ações do usuário
  const addLog = (action) => {
    setLogs(prev => [{ id: Date.now(), user: user.name, action, time: new Date().toLocaleTimeString('pt-BR') }, ...prev]);
  };

  // Função para exibir notificações toast
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Função para atualizar o status do pedido, adicionar ao histórico e simular automação de e-mail
  const updateOrderStatus = (id, status) => {
    const now = new Date();
    const dataAtual = now.toLocaleDateString('pt-BR');
    const horaAtual = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        // Adiciona nova etapa ao histórico do pedido
        const novoHistorico = [...(o.history || []), { status: status, date: dataAtual, time: horaAtual }];
        return { ...o, status, history: novoHistorico };
      }
      return o;
    }));
    
    addLog(`Pedido #${id} movido para ${status}`);
    showToast(`Status atualizado: ${status}`);

    // Simulação da automação de e-mail para notificações de rastreio
    setTimeout(() => {
      showToast(`Automação: E-mail de rastreio (${status}) enviado ao cliente.`, 'info');
    }, 1500);
  };

  // Função para aplicar desconto em um pedido
  const applyDiscount = (id, amount) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, total: Math.max(0, o.total - amount) } : o
    ));
    addLog(`Desconto de R$ ${amount} aplicado no Pedido #${id}`);
    showToast(`Desconto de R$ ${amount} aplicado!`);
  };

  // Função para atualizar informações do usuário na equipe
  const updateUser = (userId, data) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    const field = Object.keys(data)[0];
    addLog(`Alteração de ${field} para o usuário ID #${userId}`);
    showToast("Dados da equipe atualizados!");
  };

  // Configuração dos itens do menu da sidebar de navegação
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

  // Renderização da interface principal da aplicação
  return (
    <div className="flex h-screen bg-neutral-950 font-sans text-neutral-200 overflow-hidden relative">
      {/* Notificações toast exibidas globalmente */}
      <div className="fixed top-5 right-5 z-[110] space-y-3">
        {toasts.map(t => (
          <div key={t.id} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-2xl animate-fade-in">
            {t.type === 'success' ? <CheckCircle className="text-emerald-500 shrink-0" size={18}/> : <Info className="text-blue-500 shrink-0" size={18}/>}
            <span className="text-sm font-bold">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Overlay da sidebar para dispositivos móveis */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/80 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Sidebar de navegação */}
      <aside className={`fixed lg:relative z-[70] h-full w-72 bg-neutral-900 flex flex-col border-r border-neutral-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Cabeçalho da sidebar */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-neutral-800">
          <span className="text-xl font-bold text-white tracking-tight italic">SALES<span className="text-blue-500">.</span>IO</span>
          <button className="lg:hidden text-neutral-500" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        {/* Menu de navegação */}
        <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-neutral-500 hover:bg-neutral-800'}`}>
              <item.icon size={18} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Botão de logout */}
        <div className="p-4 border-t border-neutral-800">
          <button onClick={() => setUser(null)} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-neutral-500 hover:text-red-400 py-3 rounded-lg uppercase transition-all"><LogOut size={16} /> Sair</button>
        </div>
      </aside>

      {/* Área de conteúdo principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Cabeçalho com informações do usuário e notificações */}
        <header className="h-20 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 bg-neutral-800 rounded-lg text-neutral-400" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-bold text-white capitalize italic tracking-tight">{activeTab.replace('_', ' ')}</h1>
              <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">{user.name} | {user.role}</span>
            </div>
          </div>
          
          {/* Botão de notificações */}
          <button 
            onClick={() => { setIsNotifyOpen(true); setNotifications(n => n.map(not => ({...not, read: true}))); }} 
            className="relative p-2.5 bg-neutral-800 text-neutral-400 rounded-xl border border-neutral-700 hover:text-white transition-all active:scale-95"
          >
            <Bell size={20} />
            {notifications.some(n => !n.read) && <span className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-neutral-900 animate-pulse"></span>}
          </button>
        </header>
        
        {/* Conteúdo principal baseado na aba ativa */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 bg-neutral-950">
          {activeTab === 'dashboard' && <Dashboard user={user} orders={orders} usersList={usersList} />}
          {activeTab === 'kanban' && <Kanban user={user} orders={orders} usersList={usersList} updateStatus={updateOrderStatus} applyDiscount={applyDiscount} />}
          {activeTab === 'products' && <Products user={user} products={products} onDelete={(id) => setProducts(products.filter(p => p.id !== id))} onAdd={(p) => setProducts([p, ...products])} />}
          {activeTab === 'team' && <Team user={user} users={usersList} onUpdateUser={updateUser} onAdd={(u) => setUsersList([...usersList, u])} />}
          {activeTab === 'new_order' && <NewOrder user={user} products={products} clients={clients} onAddOrder={(o) => setOrders([{...o, sellerId: user.id, history: [{status: 'Aguardando Pagamento', date: new Date().toLocaleDateString('pt-BR'), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}]}, ...orders])} onSuccess={() => setActiveTab('kanban')} />}
          {activeTab === 'clients' && <Clients clients={clients} onAdd={(c) => setClients([c, ...clients])} />}
          {activeTab === 'logs' && <Logs logs={logs} user={user} />}
          {activeTab === 'profile' && <Profile user={user} orders={orders} />}
        </div>
      </main>

      {/* Painel de notificações */}
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
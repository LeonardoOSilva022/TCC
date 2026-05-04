// Dados mock para usuários da equipe de vendas, incluindo funções e metas mensais
export const MOCK_USERS = [
  { id: 1, name: "Admin Master", email: "ger@vendas.com", role: "Gerente", password: "123", monthlyGoal: 100000, commissionRate: 2 },
  { id: 2, name: "Lucas Sub", email: "sub@vendas.com", role: "Subgerente", password: "123", monthlyGoal: 75000, commissionRate: 2 },
  { id: 3, name: "Vendedor Alpha", email: "rep@vendas.com", role: "Representante", password: "123", monthlyGoal: 50000, commissionRate: 5 }
];

// Dados mock para produtos disponíveis, incluindo preços e níveis de estoque
export const MOCK_PRODUCTS = [
  { id: 1, name: "Licença ERP Corporativa", code: "P001", price: 5500, stock: 45 },
  { id: 2, name: "Módulo Fiscal Avançado", code: "P002", price: 1200, stock: 120 },
  { id: 3, name: "Suporte Técnico Premium", code: "P003", price: 2500, stock: 999 },
  { id: 4, name: "Consultoria de Implantação", code: "P004", price: 3800, stock: 10 },
  { id: 5, name: "Módulo CRM Pro", code: "P005", price: 950, stock: 85 }
];

// Dados mock para clientes, incluindo informações de contato e documentos
export const MOCK_CLIENTS = [
  { id: 1, name: "Tech Solutions Ltda", email: "contato@techsol.com.br", phone: "(11) 98888-7777", document: "12.345.678/0001-90" },
  { id: 2, name: "Indústrias Metalúrgicas S.A.", email: "comercial@indmetal.com", phone: "(19) 3456-1234", document: "98.765.432/0001-10" },
  { id: 3, name: "Varejo Total Eireli", email: "compras@varejototal.com", phone: "(21) 2233-4455", document: "45.678.901/0001-22" },
  { id: 4, name: "Logística Expressa", email: "financeiro@logexp.com.br", phone: "(41) 3030-4040", document: "11.222.333/0001-44" }
];

// Dados mock para pedidos, incluindo histórico de status e itens
export const MOCK_ORDERS = [
  {
    id: "1046", sellerId: 3, client: "Tech Solutions Ltda", total: 8000, status: "Aguardando Pagamento", date: "27/04/2026",
    items: [{ name: "Licença ERP Corporativa", price: 5500 }, { name: "Suporte Técnico Premium", price: 2500 }],
    history: [{ status: "Aguardando Pagamento", date: "27/04/2026", time: "10:15" }]
  },
  {
    id: "1047", sellerId: 2, client: "Indústrias Metalúrgicas S.A.", total: 3800, status: "Pago", date: "26/04/2026",
    items: [{ name: "Consultoria de Implantação", price: 3800 }],
    history: [{ status: "Aguardando Pagamento", date: "26/04/2026", time: "09:00" }, { status: "Aprovado", date: "26/04/2026", time: "09:30" }, { status: "Pago", date: "26/04/2026", time: "11:45" }]
  },
  {
    id: "1048", sellerId: 3, client: "Varejo Total Eireli", total: 1900, status: "Em Separação", date: "25/04/2026",
    items: [{ name: "Módulo CRM Pro", price: 950 }, { name: "Módulo CRM Pro", price: 950 }],
    history: [{ status: "Aguardando Pagamento", date: "25/04/2026", time: "14:20" }, { status: "Pago", date: "25/04/2026", time: "15:10" }, { status: "Em Separação", date: "25/04/2026", time: "16:00" }]
  },
  {
    id: "1049", sellerId: 3, client: "Logística Expressa", total: 1200, status: "Enviado", date: "24/04/2026",
    items: [{ name: "Módulo Fiscal Avançado", price: 1200 }],
    history: [{ status: "Pago", date: "24/04/2026", time: "08:10" }, { status: "Em Separação", date: "24/04/2026", time: "10:00" }, { status: "Enviado", date: "24/04/2026", time: "14:30" }]
  },
  
 // Dados mock para pedidos, incluindo histórico de status e itens
  {
    id: "1050", sellerId: 3, client: "Varejo Total Eireli", total: 5500, status: "Aguardando Pagamento", date: "28/04/2026",
    items: [{ name: "Licença ERP Corporativa", price: 5500 }],
    history: [{ status: "Aguardando Pagamento", date: "28/04/2026", time: "11:20" }]
  },
  {
    id: "1051", sellerId: 2, client: "Tech Solutions Ltda", total: 2400, status: "Aguardando Pagamento", date: "29/04/2026",
    items: [{ name: "Módulo Fiscal Avançado", price: 1200 }, { name: "Módulo Fiscal Avançado", price: 1200 }],
    history: [{ status: "Aguardando Pagamento", date: "29/04/2026", time: "09:45" }]
  },
  {
    id: "1052", sellerId: 3, client: "Indústrias Metalúrgicas S.A.", total: 6300, status: "Aguardando Pagamento", date: "30/04/2026",
    items: [{ name: "Consultoria de Implantação", price: 3800 }, { name: "Suporte Técnico Premium", price: 2500 }],
    history: [{ status: "Aguardando Pagamento", date: "30/04/2026", time: "15:10" }]
  },
  {
    id: "1053", sellerId: 3, client: "Logística Expressa", total: 950, status: "Aprovado", date: "01/05/2026",
    items: [{ name: "Módulo CRM Pro", price: 950 }],
    history: [{ status: "Aguardando Pagamento", date: "01/05/2026", time: "10:00" }, { status: "Aprovado", date: "01/05/2026", time: "14:30" }]
  },
  {
    id: "1054", sellerId: 2, client: "Varejo Total Eireli", total: 11000, status: "Aguardando Pagamento", date: "02/05/2026",
    items: [{ name: "Licença ERP Corporativa", price: 5500 }, { name: "Licença ERP Corporativa", price: 5500 }],
    history: [{ status: "Aguardando Pagamento", date: "02/05/2026", time: "16:40" }]
  },
  {
    id: "1055", sellerId: 3, client: "Tech Solutions Ltda", total: 3800, status: "Aguardando Pagamento", date: "03/05/2026",
    items: [{ name: "Consultoria de Implantação", price: 3800 }],
    history: [{ status: "Aguardando Pagamento", date: "03/05/2026", time: "08:15" }]
  },
  {
    id: "1056", sellerId: 3, client: "Logística Expressa", total: 2500, status: "Pago", date: "03/05/2026",
    items: [{ name: "Suporte Técnico Premium", price: 2500 }],
    history: [{ status: "Aguardando Pagamento", date: "03/05/2026", time: "09:00" }, { status: "Aprovado", date: "03/05/2026", time: "10:15" }, { status: "Pago", date: "03/05/2026", time: "16:20" }]
  },
  {
    id: "1057", sellerId: 2, client: "Indústrias Metalúrgicas S.A.", total: 2850, status: "Aguardando Pagamento", date: "03/05/2026",
    items: [{ name: "Módulo CRM Pro", price: 950 }, { name: "Módulo CRM Pro", price: 950 }, { name: "Módulo CRM Pro", price: 950 }],
    history: [{ status: "Aguardando Pagamento", date: "03/05/2026", time: "11:30" }]
  },
  {
    id: "1058", sellerId: 3, client: "Varejo Total Eireli", total: 1200, status: "Aguardando Pagamento", date: "04/05/2026",
    items: [{ name: "Módulo Fiscal Avançado", price: 1200 }],
    history: [{ status: "Aguardando Pagamento", date: "04/05/2026", time: "08:45" }]
  },
  {
    id: "1059", sellerId: 3, client: "Tech Solutions Ltda", total: 5500, status: "Aguardando Pagamento", date: "04/05/2026",
    items: [{ name: "Licença ERP Corporativa", price: 5500 }],
    history: [{ status: "Aguardando Pagamento", date: "04/05/2026", time: "09:20" }]
  },
  {
    id: "1060", sellerId: 2, client: "Logística Expressa", total: 7600, status: "Aguardando Pagamento", date: "04/05/2026",
    items: [{ name: "Consultoria de Implantação", price: 3800 }, { name: "Consultoria de Implantação", price: 3800 }],
    history: [{ status: "Aguardando Pagamento", date: "04/05/2026", time: "10:05" }]
  },
  {
    id: "1061", sellerId: 3, client: "Indústrias Metalúrgicas S.A.", total: 4750, status: "Aguardando Pagamento", date: "04/05/2026",
    items: [{ name: "Consultoria de Implantação", price: 3800 }, { name: "Módulo CRM Pro", price: 950 }],
    history: [{ status: "Aguardando Pagamento", date: "04/05/2026", time: "10:30" }]
  }
];
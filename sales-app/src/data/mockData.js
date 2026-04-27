export const MOCK_USERS = [
  { id: 1, name: "Admin Master", email: "ger@vendas.com", role: "Gerente", password: "123", meta: 100000 },
  { id: 2, name: "Lucas Sub", email: "sub@vendas.com", role: "Subgerente", password: "123", meta: 75000 },
  { id: 3, name: "Vendedor Alpha", email: "rep@vendas.com", role: "Representante", password: "123", meta: 50000 }
];

export const MOCK_PRODUCTS = [
  { id: 1, name: "Licença ERP Corporativa", code: "P001", price: 5500, stock: 45 },
  { id: 2, name: "Módulo Fiscal Avançado", code: "P002", price: 1200, stock: 120 },
  { id: 3, name: "Suporte Técnico Premium", code: "P003", price: 2500, stock: 999 },
  { id: 4, name: "Consultoria de Implantação", code: "P004", price: 3800, stock: 10 },
  { id: 5, name: "Módulo CRM Pro", code: "P005", price: 950, stock: 85 }
];

export const MOCK_CLIENTS = [
  { id: 1, name: "Tech Solutions Ltda", email: "contato@techsol.com.br", phone: "(11) 98888-7777", document: "12.345.678/0001-90" },
  { id: 2, name: "Indústrias Metalúrgicas S.A.", email: "comercial@indmetal.com", phone: "(19) 3456-1234", document: "98.765.432/0001-10" },
  { id: 3, name: "Varejo Total Eireli", email: "compras@varejototal.com", phone: "(21) 2233-4455", document: "45.678.901/0001-22" },
  { id: 4, name: "Logística Expressa", email: "financeiro@logexp.com.br", phone: "(41) 3030-4040", document: "11.222.333/0001-44" }
];

export const MOCK_ORDERS = [
  {
    id: "1046",
    client: "Tech Solutions Ltda",
    total: 8000,
    status: "Aguardando Pagamento",
    date: "27/04/2026",
    items: [
      { name: "Licença ERP Corporativa", price: 5500 },
      { name: "Suporte Técnico Premium", price: 2500 }
    ]
  },
  {
    id: "1047",
    client: "Indústrias Metalúrgicas S.A.",
    total: 3800,
    status: "Pago",
    date: "26/04/2026",
    items: [
      { name: "Consultoria de Implantação", price: 3800 }
    ]
  },
  {
    id: "1048",
    client: "Varejo Total Eireli",
    total: 1900,
    status: "Em Separação",
    date: "25/04/2026",
    items: [
      { name: "Módulo CRM Pro", price: 950 },
      { name: "Módulo CRM Pro", price: 950 }
    ]
  },
  {
    id: "1049",
    client: "Logística Expressa",
    total: 1200,
    status: "Enviado",
    date: "24/04/2026",
    items: [
      { name: "Módulo Fiscal Avançado", price: 1200 }
    ]
  }
];

export const MOCK_SALES_HISTORY = [
  { name: "Seg", vendas: 4500 },
  { name: "Ter", vendas: 5200 },
  { name: "Qua", vendas: 3100 },
  { name: "Qui", vendas: 6800 },
  { name: "Sex", vendas: 9500 },
  { name: "Sáb", vendas: 4200 },
  { name: "Dom", vendas: 6200 }
];
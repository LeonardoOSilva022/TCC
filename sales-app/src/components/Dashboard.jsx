import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DollarSign, Target, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { MOCK_SALES_HISTORY } from "../data/mockData";

// Componente para o Gauge de Meta em SVG Real e Bonito
const GoalGauge = ({ value, meta }) => {
  const percentage = Math.min(value / meta, 1);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" className="transform -rotate-90">
        {/* Círculo de Fundo (Rastro) */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          className="stroke-neutral-800"
          strokeWidth="12"
        />
        {/* Círculo de Progresso (Azul Neon) */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          className="stroke-blue-500 transition-all duration-1000 ease-out"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          // Efeito de Brilho
          style={{ filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-5xl font-black text-white tracking-tighter">
          {(percentage * 100).toFixed(0)}
          <span className="text-blue-500 text-3xl">%</span>
        </p>
        <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
          da Meta
        </p>
      </div>
    </div>
  );
};

export default function Dashboard({ user }) {
  // Controle de montagem para evitar o erro do Recharts
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalVendas = 39500;
  const meta = user.meta || 50000;

  const cards = [
    {
      title: "Receita Bruta",
      value: totalVendas,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-950/50",
    },
    {
      title: "Meta de Vendas",
      value: meta,
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-950/50",
    },
    {
      title: "Falta Bater",
      value: Math.max(meta - totalVendas, 0),
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-950/50",
    },
    {
      title: "Comissão Estimada",
      value: totalVendas * 0.05,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-950/50",
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Cards de Métricas - Design Refinado */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-neutral-900 p-7 rounded-2xl border border-neutral-800 shadow-lg flex items-start justify-between group hover:border-blue-800 transition-colors duration-300"
          >
            <div>
              <p className="text-sm text-neutral-500 font-medium tracking-wide uppercase">
                {card.title}
              </p>
              <p className="text-3xl font-extrabold text-white tracking-tight mt-2">
                <span className={`${card.color} mr-1.5`}>R$</span>
                {card.value.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${card.bg} ${card.color} border border-current/10 group-hover:scale-110 transition-transform`}
            >
              <card.icon size={22} strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Melhores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Área Degradê Neon */}
        <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Performance Semanal
            </h3>
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-950 px-3 py-1 rounded-full border border-green-800">
              <Zap size={16} /> +12.5% vs semana anterior
            </div>
          </div>

          <div className="w-full h-[320px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height={320} minWidth={0}>
                {/* Mudado para AreaChart para design mais fluido */}
                <AreaChart
                  data={MOCK_SALES_HISTORY}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    {/* Definição do Degradê Azul Neon */}
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#262626"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    stroke="#737373"
                    fontSize={12}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke="#737373"
                    fontSize={12}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      border: "1px solid #404040",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    labelStyle={{
                      color: "#a3a3a3",
                      marginBottom: "4px",
                      fontWeight: "bold",
                    }}
                    itemStyle={{ color: "#fff", fontSize: "14px" }}
                    cursor={{
                      stroke: "#3b82f6",
                      strokeWidth: 1,
                      strokeDasharray: "6 6",
                    }}
                    formatter={(value) => `R$ ${value.toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="vendas"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVendas)"
                    dot={{
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      fill: "#000",
                      r: 5,
                    }}
                    activeDot={{
                      stroke: "#60a5fa",
                      strokeWidth: 2,
                      fill: "#fff",
                      r: 6,
                      style: {
                        filter: "drop-shadow(0 0 5px rgba(59,130,246,0.8))",
                      },
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Novo Gauge de Meta */}
        <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-neutral-300 mb-8 text-center uppercase tracking-widest">
            Acompanhamento da Meta
          </h3>

          <GoalGauge value={totalVendas} meta={meta} />

          <div className="mt-8 text-center bg-black/30 p-4 rounded-xl border border-neutral-800 w-full">
            <p className="text-sm text-neutral-400">Total realizado</p>
            <p className="text-xl font-bold text-white mt-1">
              R$ {totalVendas.toLocaleString()}{" "}
              <span className="text-neutral-600">
                / R$ {meta.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
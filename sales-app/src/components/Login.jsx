import React, { useState } from "react";
import { Lock, Mail, AlertCircle, Zap } from "lucide-react";
import { MOCK_USERS } from "../data/mockData";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("rep@vendas.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      onLogin(user);
    } else {
      setError("Credenciais inválidas. Verifique os dados e tente novamente.");
    }
  };

  return (
    // Fundo de tela cheia para login com padrão de grade sutil para profundidade visual
    <div className="min-h-screen flex items-center justify-center bg-black p-4 font-sans text-neutral-100">
      {/* Textura de grade baseada em CSS para decoração de fundo sutil */}
      <div className="absolute inset-0 z-0 opacity-[0.03] [background-image:linear-gradient(#404040_1px,transparent_1px),linear-gradient(90deg,#404040_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <div className="relative z-10 max-w-lg w-full bg-neutral-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-neutral-800 p-10 md:p-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-950 border border-blue-700 text-blue-400 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Zap size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            SALES<span className="text-blue-500">.</span>IO
          </h1>
          <p className="text-neutral-500 mt-3 text-lg">
            Central de Comando de Vendas
          </p>
        </div>

        {error && (
          <div className="mb-8 flex items-start gap-3 bg-red-950/50 text-red-300 p-5 rounded-xl text-sm font-medium border border-red-800 animate-shake">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <strong className="block text-red-200">
                Erro de Autenticação
              </strong>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-7">
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2.5 tracking-wide">
              E-mail Corporativo
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600 group-focus-within:text-blue-500 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black border border-neutral-800 rounded-xl text-white placeholder-neutral-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 transition-all outline-none text-lg shadow-inner"
                placeholder="seu.nome@empresa.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2.5 tracking-wide">
              Senha de Acesso
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600 group-focus-within:text-blue-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black border border-neutral-800 rounded-xl text-white placeholder-neutral-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-500 transition-all outline-none text-lg shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all text-xl shadow-[0_5px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.5)] active:scale-[0.98]"
          >
            Acessar Painel
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-neutral-800 text-sm text-neutral-600 bg-black/20 p-5 rounded-2xl">
          <p className="font-bold text-neutral-400 mb-3 uppercase tracking-widest text-xs">
            Credenciais de Demonstração:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
              rep@vendas.com / 123
            </div>
            <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
              sub@vendas.com / 123
            </div>
            <div className="bg-neutral-800 p-2 rounded border border-neutral-700">
              ger@vendas.com / 123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

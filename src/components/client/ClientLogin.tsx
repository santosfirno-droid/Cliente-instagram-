import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { formatCPF } from '../../utils/formatters';

export const ClientLogin: React.FC = () => {
  const { customers, loginAsCustomer, brand } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.replace(/\D/g, '').toLowerCase();
    const customer = customers.find(
      (c) =>
        c.document.replace(/\D/g, '') === cleanId ||
        (c.email && c.email.toLowerCase() === identifier.trim().toLowerCase())
    );

    if (!customer) {
      setError('Cliente não encontrado com este CPF ou e-mail.');
      return;
    }

    loginAsCustomer(customer.id);
  };

  const quickLogin = (customerId: string) => {
    loginAsCustomer(customerId);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-2">
            <BrandLogo size="lg" showSlogan={false} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Portal Exclusivo do Cliente
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Acompanhe seus empréstimos, parcelas e resgate seus créditos acumulados
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CPF ou E-mail cadastrado
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Seu CPF ou e-mail"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Senha de Acesso</label>
                <span className="text-[10px] text-slate-400">(Padrão: 123)</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <span>Acessar Minha Conta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Acesso Rápido de Demonstração:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {customers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => quickLogin(c.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 transition-all text-left text-xs cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{c.name}</div>
                    <div className="text-[10px] text-slate-400">CPF: {formatCPF(c.document)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                      {c.creditBalance} créditos
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Ambiente seguro. Seus dados e empréstimos protegidos.</span>
        </div>
      </div>
    </div>
  );
};

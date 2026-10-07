import React from 'react';
import {
  Shield,
  User,
  ArrowRightLeft,
  LogOut,
  Sparkles,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentCustomer,
    customers,
    loginAsCustomer,
    logoutCustomer,
    brand,
  } = useApp();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner / Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-200">
            Ambiente Demonstrativo:{' '}
            <span className="text-emerald-400 font-semibold">
              {currentRole === 'admin' ? 'Painel Administrativo' : 'Portal do Cliente'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">Alternar visualização:</span>

          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setCurrentRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                currentRole === 'admin'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Administrador</span>
            </button>
            <button
              onClick={() => {
                setCurrentRole('client');
                if (!currentCustomer && customers.length > 0) {
                  loginAsCustomer(customers[0].id);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                currentRole === 'client'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Portal do Cliente</span>
            </button>
          </div>

          {currentRole === 'client' && (
            <div className="relative group inline-block">
              <div className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-md text-slate-200 cursor-pointer">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="max-w-[120px] truncate font-medium">
                  {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Selecionar'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="absolute right-0 mt-1 w-60 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Acessar conta como:
                </div>
                {customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => loginAsCustomer(c.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentCustomer?.id === c.id ? 'bg-blue-50/70 font-semibold text-blue-700' : ''
                    }`}
                  >
                    <div className="truncate">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.creditBalance} créditos</div>
                    </div>
                    {currentCustomer?.id === c.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" showSlogan={true} />
        </div>

        <div className="flex items-center gap-3">
          {currentRole === 'admin' ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Painel do Gestor
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {currentCustomer ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800">
                      {currentCustomer.name}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3" />
                      {currentCustomer.creditBalance} créditos acumulados
                    </span>
                  </div>
                  <button
                    onClick={logoutCustomer}
                    title="Trocar de cliente / Sair"
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-500">Nenhum cliente selecionado</span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

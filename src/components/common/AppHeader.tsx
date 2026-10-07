import React from 'react';
import { Menu, Sparkles, Shield, User, Smartphone, ArrowRightLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface AppHeaderProps {
  onOpenMenu: () => void;
  onOpenCreditsTab?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMenu,
  onOpenCreditsTab,
}) => {
  const { currentRole, currentCustomer, brand, setCurrentRole, customers, loginAsCustomer } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between">
        {/* Left: 3 Lines Hamburger Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Abrir Menu (3 linhas)"
            aria-label="Menu Principal"
          >
            <Menu className="w-5 h-5 text-slate-900" />
          </button>

          {/* Logo Brand */}
          <div className="flex items-center">
            <BrandLogo size="sm" showSlogan={false} />
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          {currentRole === 'client' && currentCustomer ? (
            <button
              onClick={onOpenCreditsTab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/90 text-amber-900 font-black text-xs transition-colors cursor-pointer shadow-2xs"
              title="Ver Extrato de Créditos"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{currentCustomer.creditBalance}</span>
              <span className="text-[10px] font-bold text-amber-700 hidden sm:inline">créditos</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-white shadow-2xs">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px]">Gestor</span>
              </span>
            </div>
          )}

          {/* Quick role toggle pill */}
          <button
            onClick={() => {
              if (currentRole === 'admin') {
                setCurrentRole('client');
                if (!currentCustomer && customers.length > 0) {
                  loginAsCustomer(customers[0].id);
                }
              } else {
                setCurrentRole('admin');
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={`Alternar para visão de ${currentRole === 'admin' ? 'Cliente' : 'Administrador'}`}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import {
  X,
  Shield,
  Smartphone,
  Palette,
  Users,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  LogOut,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { formatCPF } from '../../utils/formatters';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAdminTab?: (tab: string) => void;
  onNavigateClientTab?: (tab: string) => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  onNavigateAdminTab,
  onNavigateClientTab,
}) => {
  const {
    currentRole,
    setCurrentRole,
    currentCustomer,
    customers,
    loginAsCustomer,
    logoutCustomer,
    brand,
    resetAllData,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div
          className="p-5 text-white flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${brand.primaryColor} 0%, #0f172a 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" lightText={true} />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Status Banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Você está navegando como:
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {currentRole === 'admin' ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : (
                  currentCustomer?.name.charAt(0) || 'C'
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">
                  {currentRole === 'admin'
                    ? 'Painel do Gestor'
                    : currentCustomer?.name || 'Cliente'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentRole === 'admin'
                    ? 'Acesso Administrativo Completo'
                    : `${currentCustomer?.creditBalance || 0} créditos disponíveis`}
                </div>
              </div>
            </div>

            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                currentRole === 'admin'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {currentRole === 'admin' ? 'Gestor' : 'Cliente'}
            </span>
          </div>
        </div>

        {/* Switch Mode Action */}
        <div className="p-4 border-b border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Alternar Modo do Aplicativo:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCurrentRole('admin');
                onClose();
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Administrador</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('client');
                if (!currentCustomer && customers.length > 0) {
                  loginAsCustomer(customers[0].id);
                }
                onClose();
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentRole === 'client'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Cliente</span>
            </button>
          </div>
        </div>

        {/* Quick Menu Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {currentRole === 'admin' ? (
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Navegação Rápida do Gestor:
              </div>

              <button
                onClick={() => {
                  onNavigateAdminTab?.('dashboard');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Visão Geral & Caixa</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateAdminTab?.('customers');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Gerenciar Clientes ({customers.length})</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateAdminTab?.('loans');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Empréstimos & Parcelas</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateAdminTab?.('credits');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Controle de Créditos</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateAdminTab?.('catalog');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Catálogo de Produtos & Serviços</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateAdminTab?.('brand');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-bold text-left text-emerald-800 bg-emerald-50/50"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <span>Identidade Visual & Logotipo</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Navegação do Cliente:
              </div>

              <button
                onClick={() => {
                  onNavigateClientTab?.('overview');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Início & Carteira</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateClientTab?.('loans');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Meus Empréstimos & Parcelas</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateClientTab?.('credits');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Extrato de Créditos Acumulados</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateClientTab?.('catalog');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Catálogo de Benefícios & Loja</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  onNavigateClientTab?.('profile');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-medium text-left"
              >
                <span>Meus Dados Cadastrais</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          {/* Switch Customer Quick Picker */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Testar como outro cliente:
            </div>
            <div className="space-y-1">
              {customers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    loginAsCustomer(c.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    currentCustomer?.id === c.id && currentRole === 'client'
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.creditBalance} créditos</div>
                  </div>
                  {currentCustomer?.id === c.id && currentRole === 'client' && (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2 text-xs">
          {brand.contactPhone && (
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Suporte: {brand.contactPhone}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                if (confirm('Deseja restaurar todos os dados para o padrão inicial?')) {
                  resetAllData();
                  onClose();
                }
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar dados demo
            </button>

            {currentCustomer && currentRole === 'client' && (
              <button
                onClick={() => {
                  logoutCustomer();
                  onClose();
                }}
                className="text-[11px] text-rose-600 font-semibold hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                Sair da conta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

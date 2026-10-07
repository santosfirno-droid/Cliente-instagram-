import React from 'react';
import {
  Home,
  Users,
  FileText,
  Sparkles,
  ShoppingBag,
  Menu,
  User,
  CreditCard,
  Gift,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenMenu: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  action?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenMenu,
}) => {
  const { currentRole, currentCustomer, brand } = useApp();

  const adminTabs: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Início',
      icon: Home,
    },
    {
      id: 'customers',
      label: 'Clientes',
      icon: Users,
    },
    {
      id: 'loans',
      label: 'Empréstimos',
      icon: FileText,
    },
    {
      id: 'credits',
      label: 'Créditos',
      icon: Sparkles,
    },
    {
      id: 'menu',
      label: 'Mais (☰)',
      icon: Menu,
      action: onOpenMenu,
    },
  ];

  const clientTabs: NavItem[] = [
    {
      id: 'overview',
      label: 'Início',
      icon: Home,
    },
    {
      id: 'loans',
      label: 'Empréstimos',
      icon: FileText,
    },
    {
      id: 'credits',
      label: 'Carteira',
      icon: Sparkles,
    },
    {
      id: 'catalog',
      label: 'Benefícios',
      icon: Gift,
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
    },
  ];

  const tabs = currentRole === 'admin' ? adminTabs : clientTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.action) {
                  tab.action();
                } else {
                  onTabChange(tab.id);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{
                    color: isActive ? brand.primaryColor : undefined,
                  }}
                />
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: brand.primaryColor }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-black' : 'font-medium'
                }`}
                style={{
                  color: isActive ? brand.primaryColor : undefined,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

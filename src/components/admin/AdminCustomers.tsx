import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  UserCheck,
  CreditCard,
  Shield,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatCPF, formatPhone, formatCurrency, formatCredits } from '../../utils/formatters';
import { NewCustomerModal } from './NewCustomerModal';
import { CustomerDetailModal } from './CustomerDetailModal';
import { AdjustCreditsModal } from '../common/AdjustCreditsModal';

interface AdminCustomersProps {
  onOpenCustomerDetails?: (customerId: string) => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = () => {
  const { customers, loans, loginAsCustomer } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [adjustCustomer, setAdjustCustomer] = useState<Customer | null>(null);

  // Search filter
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.document.includes(term) ||
      c.phone.includes(term) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Clientes ({customers.length})
          </h1>
          <p className="text-xs text-slate-500">
            Contas individuais, saldos e histórico
          </p>
        </div>

        <button
          onClick={() => setIsNewCustomerOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, CPF ou telefone..."
          className="w-full text-xs py-1.5 px-2 bg-transparent focus:outline-hidden"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Mobile-First App Card Feed */}
      <div className="space-y-2.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-200">
            Nenhum cliente encontrado com os termos de busca.
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const customerLoans = loans.filter((l) => l.customerId === customer.id);
            const activeLoans = customerLoans.filter((l) => l.status === 'active');

            return (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center shrink-0 border border-slate-200">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                        {customer.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        CPF: {formatCPF(customer.document)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 font-black text-xs">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{customer.creditBalance}</span>
                      <span className="text-[10px] font-bold text-amber-700">pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]">
                      {activeLoans.length > 0 ? (
                        <strong className="text-emerald-700">
                          {activeLoans.length} empréstimo{activeLoans.length > 1 ? 's' : ''} ativo{activeLoans.length > 1 ? 's' : ''}
                        </strong>
                      ) : (
                        <span>Sem empréstimo ativo</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setAdjustCustomer(customer)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      Ajustar Saldo
                    </button>
                    <button
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {isNewCustomerOpen && (
        <NewCustomerModal
          isOpen={isNewCustomerOpen}
          onClose={() => setIsNewCustomerOpen(false)}
          onCreated={(newId) => setSelectedCustomerId(newId)}
        />
      )}

      {selectedCustomerId && (
        <CustomerDetailModal
          isOpen={Boolean(selectedCustomerId)}
          onClose={() => setSelectedCustomerId(null)}
          customerId={selectedCustomerId}
        />
      )}

      {adjustCustomer && (
        <AdjustCreditsModal
          isOpen={Boolean(adjustCustomer)}
          onClose={() => setAdjustCustomer(null)}
          customer={adjustCustomer}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Minus,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreditTransaction } from '../../types';
import { formatDateTime, formatCredits } from '../../utils/formatters';
import { AdjustCreditsModal } from '../common/AdjustCreditsModal';

export const AdminCredits: React.FC = () => {
  const { creditTransactions, customers, metrics } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [selectedCustomerIdForAdjust, setSelectedCustomerIdForAdjust] = useState<string>('');

  const targetCustomer = customers.find((c) => c.id === selectedCustomerIdForAdjust) || null;

  const filteredTransactions = creditTransactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      tx.customerName.toLowerCase().includes(term) ||
      tx.reason.toLowerCase().includes(term);

    if (typeFilter === 'all') return matchesSearch;
    return matchesSearch && tx.type === typeFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Controle de Créditos
          </h1>
          <p className="text-xs text-slate-500">
            Extrato auditável separado do caixa financeiro
          </p>
        </div>

        <select
          value={selectedCustomerIdForAdjust}
          onChange={(e) => setSelectedCustomerIdForAdjust(e.target.value)}
          className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden"
        >
          <option value="">Lançar crédito/débito manual...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.creditBalance} créditos)
            </option>
          ))}
        </select>
      </div>

      {/* 3 Mobile KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Emitidos</span>
          <span className="text-sm sm:text-base font-black text-emerald-700 block mt-0.5">
            +{metrics.totalCreditsIssued}
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Resgatados</span>
          <span className="text-sm sm:text-base font-black text-rose-700 block mt-0.5">
            -{metrics.totalCreditsRedeemed}
          </span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Em Circulação</span>
          <span className="text-sm sm:text-base font-black text-purple-950 block mt-0.5">
            {metrics.currentActiveCredits}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente ou motivo..."
            className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 self-center sm:self-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setTypeFilter('credit')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'credit'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Entradas (+)
          </button>
          <button
            onClick={() => setTypeFilter('debit')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'debit'
                ? 'bg-white text-rose-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Saídas (-)
          </button>
        </div>
      </div>

      {/* Mobile Feed of Transactions */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-200">
            Nenhuma movimentação de crédito encontrada.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-slate-900 truncate">
                    {tx.customerName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {formatDateTime(tx.createdAt)}
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black shrink-0 ${
                    tx.type === 'credit'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '-'} {tx.amount} créditos
                </span>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl">
                {tx.reason}
              </div>

              {/* Exact user format demonstrated */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1 pt-0.5">
                <span>Anterior: {tx.previousBalance} pts</span>
                <span className="font-bold text-slate-900">
                  Atual: {tx.currentBalance} pts
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Adjust Modal when customer is chosen */}
      {targetCustomer && (
        <AdjustCreditsModal
          isOpen={Boolean(targetCustomer)}
          onClose={() => setSelectedCustomerIdForAdjust('')}
          customer={targetCustomer}
        />
      )}
    </div>
  );
};

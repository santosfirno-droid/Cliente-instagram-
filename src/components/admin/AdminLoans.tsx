import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Wallet,
  Receipt,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Loan, Installment } from '../../types';
import { formatCurrency, formatCredits, formatDate, isOverdue } from '../../utils/formatters';
import { NewLoanModal } from './NewLoanModal';
import { PayInstallmentModal } from './PayInstallmentModal';
import { ReceiptModal } from '../common/ReceiptModal';

interface AdminLoansProps {
  onOpenCustomer?: (customerId: string) => void;
}

export const AdminLoans: React.FC<AdminLoansProps> = ({ onOpenCustomer }) => {
  const { loans } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(loans[0]?.id || null);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);

  const [payTarget, setPayTarget] = useState<{ loan: Loan; installment: Installment } | null>(null);
  const [receiptTarget, setReceiptTarget] = useState<{ loan: Loan; installment: Installment } | null>(
    null
  );

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && loan.status === statusFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedLoanId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Empréstimos ({loans.length})
          </h1>
          <p className="text-xs text-slate-500">
            Contratos, parcelas e retorno de giro
          </p>
        </div>

        <button
          onClick={() => setIsNewLoanOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Novo Empréstimo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código ou cliente..."
            className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 self-center sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Quitados
          </button>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-3">
        {filteredLoans.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 text-xs">
            Nenhum empréstimo encontrado.
          </div>
        ) : (
          filteredLoans.map((loan) => {
            const isExpanded = expandedLoanId === loan.id;
            const paidCount = loan.installments.filter((i) => i.status === 'paid').length;
            const progressPercent = Math.round((paidCount / loan.installmentsCount) * 100);

            return (
              <div
                key={loan.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                {/* Accordion Card Header */}
                <div
                  onClick={() => toggleExpand(loan.id)}
                  className="p-4 cursor-pointer hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      <FileText className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                      <span className="text-[8px] text-slate-300">{loan.code}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 truncate">
                          {loan.customerName}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            loan.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {loan.status === 'completed' ? 'Quitado' : 'Ativo'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5">
                        {loan.installmentsCount}x de {formatCurrency(loan.installmentAmount)} • Capital:{' '}
                        <strong>{formatCurrency(loan.principalAmount)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">
                        {paidCount}/{loan.installmentsCount} parcelas pagas
                      </div>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded installments view */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Parcelas do Contrato
                      </span>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        Juros viram créditos ao pagar
                      </span>
                    </div>

                    {/* Mobile-Friendly Installment Feed */}
                    <div className="space-y-2">
                      {loan.installments.map((inst) => {
                        const overdue = isOverdue(inst.dueDate, inst.status);

                        return (
                          <div
                            key={inst.id}
                            className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">
                                  #{inst.number}/{inst.totalInstallments}
                                </span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-[11px] text-slate-600">
                                  Venc: {formatDate(inst.dueDate)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-950 text-xs">
                                  {formatCurrency(inst.amount)}
                                </span>
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                                  +{formatCredits(inst.interestAmount)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {inst.status === 'paid' ? (
                                <button
                                  onClick={() => setReceiptTarget({ loan, installment: inst })}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Recibo</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setPayTarget({ loan, installment: inst })}
                                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Receber</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {isNewLoanOpen && (
        <NewLoanModal isOpen={isNewLoanOpen} onClose={() => setIsNewLoanOpen(false)} />
      )}

      {payTarget && (
        <PayInstallmentModal
          isOpen={Boolean(payTarget)}
          onClose={() => setPayTarget(null)}
          loan={payTarget.loan}
          installment={payTarget.installment}
          onPaymentSuccess={(paidInst) => {
            setReceiptTarget({ loan: payTarget.loan, installment: paidInst });
          }}
        />
      )}

      {receiptTarget && (
        <ReceiptModal
          isOpen={Boolean(receiptTarget)}
          onClose={() => setReceiptTarget(null)}
          loan={receiptTarget.loan}
          installment={receiptTarget.installment}
        />
      )}
    </div>
  );
};

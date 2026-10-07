import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  Users,
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Repeat,
  ShoppingBag,
  ExternalLink,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Loan, Installment } from '../../types';
import { formatCurrency, formatCredits, formatDate, isOverdue } from '../../utils/formatters';
import { PayInstallmentModal } from './PayInstallmentModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { NewLoanModal } from './NewLoanModal';
import { NewCustomerModal } from './NewCustomerModal';

interface AdminDashboardProps {
  onNavigateToTab: (tab: string) => void;
  onOpenCustomer: (customerId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToTab,
  onOpenCustomer,
}) => {
  const { metrics, loans, customers, creditTransactions } = useApp();

  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<{ loan: Loan; installment: Installment } | null>(null);
  const [receiptTarget, setReceiptTarget] = useState<{ loan: Loan; installment: Installment } | null>(
    null
  );

  // Find upcoming installments across all loans
  const upcomingInstallments: { loan: Loan; installment: Installment }[] = [];
  loans.forEach((loan) => {
    loan.installments.forEach((inst) => {
      if (inst.status === 'pending') {
        upcomingInstallments.push({ loan, installment: inst });
      }
    });
  });

  // Sort by due date
  upcomingInstallments.sort(
    (a, b) => new Date(a.installment.dueDate).getTime() - new Date(b.installment.dueDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Painel de Controle Financeiro
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão de capital de giro renovável, carteira de empréstimos e créditos de clientes
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsNewCustomerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-600" />
            + Novo Cliente
          </button>
          <button
            onClick={() => setIsNewLoanOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Novo Empréstimo
          </button>
        </div>
      </div>

      {/* Cycle Explanation Banner (Capital Revolvente + Juros em Créditos) */}
      <div className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <Repeat className="w-4 h-4" />
          Modelo Operacional: Capital Revolvente & Créditos de Fidelidade
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <span className="text-emerald-400 font-extrabold text-sm block mb-1">1. Concessão</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              O capital é emprestado com taxa de juros e parcelamento acordados com o cliente.
            </p>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <span className="text-blue-400 font-extrabold text-sm block mb-1">2. Retorno do Caixa</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Conforme as parcelas são pagas, o principal retorna 100% ao caixa para novos empréstimos.
            </p>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <span className="text-amber-400 font-extrabold text-sm block mb-1">3. Juros viram Créditos</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              A parcela de juros paga é creditada automaticamente como saldo na conta do cliente!
            </p>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <span className="text-purple-400 font-extrabold text-sm block mb-1">4. Utilização</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              O cliente acessa o aplicativo dele e resgata produtos/serviços com os créditos acumulados.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Capital em Circulação */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Capital em Giro</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(metrics.circulatingCapital)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Total já emprestado:</span>
            <span className="font-semibold text-slate-700">{formatCurrency(metrics.totalLentCapital)}</span>
          </p>
        </div>

        {/* Stat 2: Capital Recuperado */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Capital Recuperado</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight">
            {formatCurrency(metrics.recoveredCapital)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Liberado e disponível no caixa para reinvestimento
          </p>
        </div>

        {/* Stat 3: Juros Recebidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Juros Recebidos</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 tracking-tight">
            {formatCurrency(metrics.totalInterestPaid)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Rentabilidade realizada (virou créditos para clientes)
          </p>
        </div>

        {/* Stat 4: Créditos Ativos de Clientes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Créditos Acumulados</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-950 tracking-tight">
            {metrics.currentActiveCredits}{' '}
            <span className="text-sm font-semibold text-slate-500">créditos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Já resgatados:</span>
            <span className="font-semibold text-slate-700">{metrics.totalCreditsRedeemed} créditos</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Upcoming Installments & Clients with Credits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming installments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Próximas Parcelas a Receber
              </h2>
              <p className="text-xs text-slate-400">
                Acompanhe vencimentos e registre recebimentos para alimentar o caixa
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('loans')}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-x-auto">
            {upcomingInstallments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Nenhuma parcela pendente encontrada.
              </div>
            ) : (
              upcomingInstallments.slice(0, 6).map(({ loan, installment }) => {
                const overdue = isOverdue(installment.dueDate, installment.status);
                return (
                  <div
                    key={installment.id}
                    className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          overdue ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 truncate">
                            {loan.customerName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {loan.code} ({installment.number}/{installment.totalInstallments})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Vencimento: {formatDate(installment.dueDate)}</span>
                          {overdue && (
                            <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">
                              Atrasada
                            </span>
                          )}
                          <span className="text-amber-700 font-medium">
                            +{formatCredits(installment.interestAmount)} ao pagar
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-extrabold text-slate-900">
                          {formatCurrency(installment.amount)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cap: {formatCurrency(installment.principalAmount)}
                        </div>
                      </div>

                      <button
                        onClick={() => setPayTarget({ loan, installment })}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
                      >
                        Receber
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Clients by Credits & Actions (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Clientes & Créditos</h2>
                <p className="text-[11px] text-slate-400">Maiores saldos disponíveis</p>
              </div>
              <button
                onClick={() => onNavigateToTab('customers')}
                className="text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                Gerenciar
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {[...customers]
                .sort((a, b) => b.creditBalance - a.creditBalance)
                .slice(0, 4)
                .map((client) => (
                  <div
                    key={client.id}
                    onClick={() => onOpenCustomer(client.id)}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {client.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Doc: {client.document}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 font-black text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {client.creditBalance} pts
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Acesso Rápido
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateToTab('catalog')}
                className="p-2 bg-white rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                Catálogo
              </button>
              <button
                onClick={() => onNavigateToTab('credits')}
                className="p-2 bg-white rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Extrato Geral
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isNewLoanOpen && (
        <NewLoanModal isOpen={isNewLoanOpen} onClose={() => setIsNewLoanOpen(false)} />
      )}

      {isNewCustomerOpen && (
        <NewCustomerModal
          isOpen={isNewCustomerOpen}
          onClose={() => setIsNewCustomerOpen(false)}
          onCreated={(newId) => onOpenCustomer(newId)}
        />
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

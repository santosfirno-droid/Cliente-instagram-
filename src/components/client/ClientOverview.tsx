import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  QrCode,
  ShoppingBag,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Loan, Installment } from '../../types';
import { formatCurrency, formatCredits, formatDate, isOverdue } from '../../utils/formatters';
import { ReceiptModal } from '../common/ReceiptModal';

interface ClientOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const ClientOverview: React.FC<ClientOverviewProps> = ({ onNavigateTab }) => {
  const { currentCustomer, loans, creditTransactions, catalogItems, brand } = useApp();

  const [selectedReceipt, setSelectedReceipt] = useState<{
    loan: Loan;
    installment: Installment;
  } | null>(null);

  const [copiedPix, setCopiedPix] = useState(false);

  if (!currentCustomer) return null;

  const myLoans = loans.filter((l) => l.customerId === currentCustomer.id);
  const myTransactions = creditTransactions.filter((t) => t.customerId === currentCustomer.id);

  // Find next upcoming installment
  let nextInstallment: { loan: Loan; installment: Installment } | null = null;
  for (const loan of myLoans) {
    for (const inst of loan.installments) {
      if (inst.status === 'pending') {
        if (
          !nextInstallment ||
          new Date(inst.dueDate).getTime() < new Date(nextInstallment.installment.dueDate).getTime()
        ) {
          nextInstallment = { loan, installment: inst };
        }
      }
    }
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText(brand.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Greeting Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Olá, {currentCustomer.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-500">
            Bem-vindo à sua conta {brand.companyName}
          </p>
        </div>
      </div>

      {/* Hero Credit Card (Fintech Style) */}
      <div
        className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-transform active:scale-[0.99]"
        style={{
          background: `linear-gradient(135deg, ${brand.primaryColor} 0%, #0f172a 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col justify-between h-44 sm:h-48">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300 block">
                {brand.companyName} BENEFÍCIOS
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Cartão de Créditos Fidelidade
              </span>
            </div>
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-amber-300 border border-white/10">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-300 font-medium">Saldo Disponível</span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-2">
              <span>{currentCustomer.creditBalance}</span>
              <span className="text-sm font-bold text-amber-400">créditos</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Juros pagos que viram vantagens exclusivas
            </p>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-300 pt-3 border-t border-white/10">
            <span className="font-mono">{currentCustomer.name.toUpperCase()}</span>
            <button
              onClick={() => onNavigateTab('catalog')}
              className="text-amber-300 font-bold hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Resgatar agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Background glow decoration */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Action Bubbles (Fintech style) */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <button
          onClick={() => onNavigateTab('loans')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 leading-tight">Pagar Pix</span>
        </button>

        <button
          onClick={() => onNavigateTab('catalog')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 leading-tight">Loja</span>
        </button>

        <button
          onClick={() => onNavigateTab('credits')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 leading-tight">Extrato</span>
        </button>

        <button
          onClick={() => onNavigateTab('loans')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-700 leading-tight">Contratos</span>
        </button>
      </div>

      {/* Next Upcoming Installment Spotlight */}
      {nextInstallment ? (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Próxima Parcela a Vencer
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {nextInstallment.loan.code} #{nextInstallment.installment.number}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-y border-slate-100">
            <div>
              <div className="text-[11px] text-slate-400">Vencimento em</div>
              <div className="text-sm font-black text-slate-900">
                {formatDate(nextInstallment.installment.dueDate)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-400">Valor da Parcela</div>
              <div className="text-xl font-black text-slate-950">
                {formatCurrency(nextInstallment.installment.amount)}
              </div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Gere +{formatCredits(nextInstallment.installment.interestAmount)} ao pagar!</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyPix}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPix ? 'Chave Pix Copiada!' : 'Copiar Chave Pix'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('loans')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Ver todas as parcelas"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-center text-xs text-emerald-800">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
          <span className="font-bold block">Tudo em dia!</span>
          <span className="text-[11px] text-emerald-700">
            Você não possui parcelas pendentes no momento.
          </span>
        </div>
      )}

      {/* Recent Credit Transactions Feed */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Últimas Movimentações de Crédito
          </h3>
          <button
            onClick={() => onNavigateTab('credits')}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 cursor-pointer"
          >
            Ver extrato <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {myTransactions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Nenhuma movimentação recente.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-slate-800 truncate">{tx.reason}</div>
                  <div className="text-[10px] text-slate-400">{formatDate(tx.createdAt)}</div>
                </div>
                <span
                  className={`font-black text-xs shrink-0 px-2 py-0.5 rounded-md ${
                    tx.type === 'credit'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '-'} {tx.amount} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Catalog Items (Mini Vitrine) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Destaques para Resgatar
          </h3>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 cursor-pointer"
          >
            Ver todos <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {catalogItems.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab('catalog')}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-slate-900 truncate">{item.title}</div>
              <div className="text-[11px] font-black text-amber-800">
                {item.creditCost} créditos
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

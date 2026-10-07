import React from 'react';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  TrendingUp,
  Clock,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime, formatCredits } from '../../utils/formatters';

interface ClientCreditsProps {
  onGoToCatalog: () => void;
}

export const ClientCredits: React.FC<ClientCreditsProps> = ({ onGoToCatalog }) => {
  const { currentCustomer, getCustomerCreditTransactions, brand } = useApp();

  if (!currentCustomer) return null;

  const transactions = getCustomerCreditTransactions(currentCustomer.id);

  const totalCreditsEarned = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCreditsSpent = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Wallet Card Header */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brand.primaryColor} 0%, #0f172a 100%)`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Minha Carteira de Créditos
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {currentCustomer.creditBalance}{' '}
              <span className="text-xl sm:text-2xl font-bold text-amber-400">créditos</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              Os juros dos seus empréstimos voltam 100% como créditos para você resgatar produtos,
              serviços e benefícios exclusivos.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={onGoToCatalog}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Resgatar Produtos e Serviços
            </button>
          </div>
        </div>

        {/* Stats bottom pill */}
        <div className="mt-8 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-300 text-[10px] uppercase font-bold block">
              Total Já Recebido
            </span>
            <span className="text-sm font-extrabold text-emerald-300">
              +{totalCreditsEarned} créditos
            </span>
          </div>

          <div>
            <span className="text-slate-300 text-[10px] uppercase font-bold block">
              Total Já Resgatado
            </span>
            <span className="text-sm font-extrabold text-amber-300">
              -{totalCreditsSpent} créditos
            </span>
          </div>

          <div className="hidden sm:block">
            <span className="text-slate-300 text-[10px] uppercase font-bold block">Titular</span>
            <span className="text-sm font-extrabold text-white truncate block">
              {currentCustomer.name}
            </span>
          </div>
        </div>
      </div>

      {/* Audit History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Histórico Completo de Créditos
            </h3>
            <p className="text-xs text-slate-400">
              Extrato detalhado com saldo anterior, valor movimentado e saldo resultante
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Nenhuma movimentação de crédito registrada ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Saldo Anterior</th>
                  <th className="py-2.5 px-3">Movimentação</th>
                  <th className="py-2.5 px-3">Saldo Resultante</th>
                  <th className="py-2.5 px-3">Descrição / Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      {formatDateTime(tx.createdAt)}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500 font-semibold">
                      {tx.previousBalance} créditos
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                          tx.type === 'credit'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {tx.type === 'credit' ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {tx.type === 'credit' ? '+' : '-'} {tx.amount} créditos
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-black text-slate-900">
                      {tx.currentBalance} créditos
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {tx.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  QrCode,
  Copy,
  Check,
  Receipt,
  X,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Loan, Installment } from '../../types';
import { formatCurrency, formatCredits, formatDate, isOverdue } from '../../utils/formatters';
import { ReceiptModal } from '../common/ReceiptModal';

export const ClientLoans: React.FC = () => {
  const { currentCustomer, loans, brand } = useApp();

  const [selectedReceipt, setSelectedReceipt] = useState<{
    loan: Loan;
    installment: Installment;
  } | null>(null);

  const [pixModalInstallment, setPixModalInstallment] = useState<{
    loan: Loan;
    installment: Installment;
  } | null>(null);

  const [copiedPix, setCopiedPix] = useState(false);

  if (!currentCustomer) return null;

  const myLoans = loans.filter((l) => l.customerId === currentCustomer.id);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(brand.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Meus Empréstimos & Parcelas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe o cronograma de pagamentos e os créditos gerados a cada parcela quitada
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            {myLoans.length} Contrato{myLoans.length !== 1 ? 's' : ''} no total
          </span>
        </div>
      </div>

      {myLoans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
          Você não possui empréstimos registrados no momento.
        </div>
      ) : (
        myLoans.map((loan) => {
          const paidInstallments = loan.installments.filter((i) => i.status === 'paid');
          const pendingInstallments = loan.installments.filter((i) => i.status === 'pending');
          const progressPercent = Math.round(
            (paidInstallments.length / loan.installmentsCount) * 100
          );

          const totalPaid = paidInstallments.reduce((sum, i) => sum + i.amount, 0);
          const totalPending = pendingInstallments.reduce((sum, i) => sum + i.amount, 0);

          return (
            <div
              key={loan.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-4"
            >
              {/* Header card of the loan */}
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0">
                    <FileText className="w-4 h-4 text-emerald-400 mb-0.5" />
                    <span className="text-[9px] text-slate-300">{loan.code}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        Contrato {loan.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          loan.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {loan.status === 'completed' ? '100% Quitado' : 'Em Andamento'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Início em {formatDate(loan.startDate)} • {loan.installmentsCount} parcelas de{' '}
                      {formatCurrency(loan.installmentAmount)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Pago</div>
                    <div className="text-xs font-black text-emerald-700">
                      {formatCurrency(totalPaid)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Restante</div>
                    <div className="text-xs font-black text-slate-900">
                      {formatCurrency(totalPending)}
                    </div>
                  </div>

                  <div className="w-24 hidden sm:block">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installments List */}
              <div className="px-5 pb-5">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Cronograma das Parcelas</span>
                  <span className="text-[11px] text-amber-700 font-semibold normal-case flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ao pagar cada parcela, os juros viram créditos para você!
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Parcela</th>
                        <th className="py-2.5 px-3">Vencimento</th>
                        <th className="py-2.5 px-3">Valor da Parcela</th>
                        <th className="py-2.5 px-3">Créditos Gerados</th>
                        <th className="py-2.5 px-3">Situação</th>
                        <th className="py-2.5 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loan.installments.map((inst) => {
                        const overdue = isOverdue(inst.dueDate, inst.status);

                        return (
                          <tr key={inst.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-900">
                              #{inst.number} de {inst.totalInstallments}
                            </td>

                            <td className="py-3 px-3 font-medium">
                              {formatDate(inst.dueDate)}
                            </td>

                            <td className="py-3 px-3 font-black text-slate-950">
                              {formatCurrency(inst.amount)}
                            </td>

                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                +{formatCredits(inst.interestAmount)}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              {inst.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Paga em {formatDate(inst.paidDate)}
                                </span>
                              ) : overdue ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                  <AlertTriangle className="w-3 h-3" />
                                  Vencida
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  A Vencer
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right">
                              {inst.status === 'paid' ? (
                                <button
                                  onClick={() => setSelectedReceipt({ loan, installment: inst })}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  Comprovante
                                </button>
                              ) : (
                                <button
                                  onClick={() => setPixModalInstallment({ loan, installment: inst })}
                                  className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  Pagar com Pix
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Pix Payment Instructions Modal */}
      {pixModalInstallment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">Instruções para Pagamento Pix</h3>
              </div>
              <button
                onClick={() => setPixModalInstallment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                  Valor da Parcela #{pixModalInstallment.installment.number}
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  {formatCurrency(pixModalInstallment.installment.amount)}
                </div>
                <div className="text-xs text-emerald-700 mt-1">
                  Vencimento: {formatDate(pixModalInstallment.installment.dueDate)}
                </div>
              </div>

              {/* Reward preview */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2 text-left">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Ao confirmar este pagamento, você acumulará{' '}
                  <strong>+{formatCredits(pixModalInstallment.installment.interestAmount)}</strong> em
                  sua carteira de benefícios!
                </span>
              </div>

              {/* Pix Key Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-left space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Chave Pix ({brand.pixKeyType.toUpperCase()})
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="truncate">{brand.pixKey}</span>
                  <button
                    onClick={handleCopyPix}
                    className="p-1.5 hover:bg-slate-100 rounded-md text-emerald-600 transition-colors ml-2 shrink-0 flex items-center gap-1 text-[11px]"
                  >
                    {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">
                  Beneficiário: <strong>{brand.pixReceiverName}</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Após transferir via seu banco, o pagamento é identificado pelo administrador e seu
                saldo de créditos é liberado automaticamente.
              </p>

              <button
                onClick={() => setPixModalInstallment(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={Boolean(selectedReceipt)}
          onClose={() => setSelectedReceipt(null)}
          loan={selectedReceipt.loan}
          installment={selectedReceipt.installment}
        />
      )}
    </div>
  );
};

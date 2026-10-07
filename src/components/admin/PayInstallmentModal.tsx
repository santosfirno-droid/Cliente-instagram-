import React, { useState } from 'react';
import { CheckCircle2, Sparkles, X, AlertTriangle, ArrowRight, Wallet, Receipt } from 'lucide-react';
import { Loan, Installment } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatCredits, formatDate } from '../../utils/formatters';

interface PayInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan;
  installment: Installment;
  onPaymentSuccess?: (paidInstallment: Installment) => void;
}

export const PayInstallmentModal: React.FC<PayInstallmentModalProps> = ({
  isOpen,
  onClose,
  loan,
  installment,
  onPaymentSuccess,
}) => {
  const { payInstallment, getCustomerById } = useApp();
  const customer = getCustomerById(installment.customerId);
  const [receiptNotes, setReceiptNotes] = useState('Recebido pontualmente via Pix');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setError('');

    const res = payInstallment({
      loanId: loan.id,
      installmentId: installment.id,
      paymentDate: new Date(paymentDate + 'T12:00:00').toISOString(),
      receiptNotes,
    });

    setIsSubmitting(false);

    if (res.success) {
      if (onPaymentSuccess) {
        onPaymentSuccess({
          ...installment,
          status: 'paid',
          paidDate: paymentDate,
          creditEarned: Math.round(installment.interestAmount),
        });
      }
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Registrar Pagamento de Parcela
              </h3>
              <p className="text-xs text-slate-400">
                {loan.code} • Parcela {installment.number} de {installment.totalInstallments}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount Overview */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Valor Total a Receber
            </span>
            <div className="text-3xl font-black text-emerald-950 mt-1">
              {formatCurrency(installment.amount)}
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Vencimento original: {formatDate(installment.dueDate)}
            </div>
          </div>

          {/* Dual Mechanism Explanation: Capital vs Interest -> Credits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5 text-blue-600" />
                Retorno de Capital
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1">
                {formatCurrency(installment.principalAmount)}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Volta ao caixa de giro para novos empréstimos
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Juros → Créditos
              </div>
              <div className="text-base font-extrabold text-amber-900 mt-1">
                +{formatCredits(installment.interestAmount)}
              </div>
              <p className="text-[10px] text-amber-700 mt-0.5">
                Creditado na conta de {customer?.name ? customer.name.split(' ')[0] : 'Cliente'}
              </p>
            </div>
          </div>

          {/* Golden Highlight Notice */}
          <div className="p-3.5 rounded-xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-amber-900">Regra do Sistema:</span> Ao confirmar o
              recebimento, o capital de{' '}
              <strong className="text-slate-900">{formatCurrency(installment.principalAmount)}</strong>{' '}
              é liberado de volta ao caixa e{' '}
              <strong className="text-amber-800">
                {Math.round(installment.interestAmount)} créditos
              </strong>{' '}
              serão somados automaticamente ao saldo do cliente{' '}
              <strong>{customer?.name}</strong>.
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data do Recebimento
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observação / Comprovante
              </label>
              <input
                type="text"
                value={receiptNotes}
                onChange={(e) => setReceiptNotes(e.target.value)}
                placeholder="Ex: Recebido via Pix, comprovante arquivado"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar Recebimento e Gerar Créditos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

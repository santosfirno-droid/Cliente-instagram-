import React from 'react';
import { CheckCircle2, Printer, X, Sparkles, Building2, Calendar, FileText } from 'lucide-react';
import { Loan, Installment } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatCredits, formatDate, formatDateTime } from '../../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan;
  installment: Installment;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  loan,
  installment,
}) => {
  const { brand, getCustomerById } = useApp();
  if (!isOpen) return null;

  const customer = getCustomerById(installment.customerId);
  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-200">
              Comprovante de Pagamento
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="receipt-print" className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b border-slate-100 pb-5">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {brand.companyName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{brand.tradingName}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Chave Pix: {brand.pixKey} | Contato: {brand.contactPhone}
            </p>
          </div>

          {/* Status Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              Pagamento Confirmado com Sucesso
            </span>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              {formatCurrency(installment.amount)}
            </div>
            <div className="text-xs text-emerald-600 mt-0.5">
              Data: {formatDateTime(installment.paidDate)}
            </div>
          </div>

          {/* Details breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs text-slate-700 border border-slate-200/60">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Cliente</span>
              <span className="font-semibold text-slate-900">{customer?.name || loan.customerName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Documento (CPF/CNPJ)</span>
              <span className="font-mono text-slate-700">{customer?.document || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Código do Empréstimo</span>
              <span className="font-mono font-semibold text-slate-900">{loan.code}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Parcela</span>
              <span className="font-semibold text-slate-900">
                {installment.number} de {installment.totalInstallments}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Vencimento Original</span>
              <span>{formatDate(installment.dueDate)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Amortização de Capital (Giro)</span>
              <span className="font-medium text-slate-800">{formatCurrency(installment.principalAmount)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Juros Pagos</span>
              <span className="font-medium text-slate-800">{formatCurrency(installment.interestAmount)}</span>
            </div>
          </div>

          {/* Credits Highlight Callout */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                Créditos Gerados para o Cliente
              </div>
              <div className="text-sm font-black text-amber-800 mt-0.5">
                +{formatCredits(installment.interestAmount)}
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                Os juros de {formatCurrency(installment.interestAmount)} pagos nesta parcela foram
                convertidos em créditos exclusivos para utilização em produtos e serviços parceiros.
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-mono">
            Autenticação Digital: {installment.id.toUpperCase()}-AUTH
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={printReceipt}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir Comprovante
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

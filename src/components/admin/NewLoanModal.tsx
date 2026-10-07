import React, { useState } from 'react';
import {
  X,
  Calculator,
  Calendar,
  DollarSign,
  Percent,
  Sparkles,
  ArrowRight,
  User,
  CheckCircle,
} from 'lucide-react';
import { Customer, LoanFrequency } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatCredits, formatDate } from '../../utils/formatters';

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCustomerId?: string;
}

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  isOpen,
  onClose,
  preselectedCustomerId,
}) => {
  const { customers, createLoan } = useApp();

  const [customerId, setCustomerId] = useState<string>(
    preselectedCustomerId || (customers[0]?.id || '')
  );
  const [principalAmount, setPrincipalAmount] = useState<string>('2000');
  const [interestRatePercent, setInterestRatePercent] = useState<string>('20');
  const [installmentsCount, setInstallmentsCount] = useState<string>('4');
  const [frequency, setFrequency] = useState<LoanFrequency>('monthly');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  // Real-time calculations
  const principal = Math.max(0, Number(principalAmount) || 0);
  const rate = Math.max(0, Number(interestRatePercent) || 0);
  const count = Math.max(1, parseInt(installmentsCount) || 1);

  const totalInterest = Math.round(((principal * rate) / 100) * 100) / 100;
  const totalAmount = principal + totalInterest;
  const installmentAmount = Math.round((totalAmount / count) * 100) / 100;
  const principalPerInstallment = Math.round((principal / count) * 100) / 100;
  const interestPerInstallment = Math.round((totalInterest / count) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerId) {
      setError('Selecione um cliente para o empréstimo.');
      return;
    }

    if (principal <= 0) {
      setError('Informe um valor de capital válido.');
      return;
    }

    if (count < 1) {
      setError('Número de parcelas deve ser de pelo menos 1.');
      return;
    }

    createLoan({
      customerId,
      principalAmount: principal,
      interestRatePercent: rate,
      installmentsCount: count,
      frequency,
      startDate,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 rounded-lg text-white">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Cadastrar Novo Empréstimo
              </h3>
              <p className="text-xs text-slate-400">
                Cálculo de capital giratório e conversão de juros em créditos
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cliente Titular do Empréstimo *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              required
            >
              <option value="">Selecione um cliente...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - CPF/Doc: {c.document} (Saldo: {c.creditBalance} créditos)
                </option>
              ))}
            </select>
          </div>

          {/* Loan inputs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Capital Emprestado (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">
                  R$
                </span>
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={principalAmount}
                  onChange={(e) => setPrincipalAmount(e.target.value)}
                  className="w-full text-xs font-bold pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="2000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Taxa de Juros Total (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="200"
                  step="1"
                  value={interestRatePercent}
                  onChange={(e) => setInterestRatePercent(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="20"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Qtd. de Parcelas *
              </label>
              <input
                type="number"
                min="1"
                max="48"
                step="1"
                value={installmentsCount}
                onChange={(e) => setInstallmentsCount(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                placeholder="4"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Periodicidade das Parcelas
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as LoanFrequency)}
                className="w-full text-xs font-medium px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              >
                <option value="monthly">Mensal (a cada 30 dias)</option>
                <option value="biweekly">Quinzenal (a cada 15 dias)</option>
                <option value="weekly">Semanal (a cada 7 dias)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data do Contrato / Concessão
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Finalidade / Observações (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Capital para reforma de maquinário, compra de peças..."
              className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Real-time Financial Breakdown Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                Simulação Financeira
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {count}x de {formatCurrency(installmentAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Capital Inicial
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {formatCurrency(principal)}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Juros Totais ({rate}%)
                </span>
                <span className="text-sm font-extrabold text-amber-600">
                  {formatCurrency(totalInterest)}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Montante Total
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  Créditos gerados
                </span>
                <span className="text-sm font-black text-amber-900">
                  {formatCredits(totalInterest)}
                </span>
              </div>
            </div>

            {/* Special System Logic highlight */}
            <div className="bg-linear-to-r from-amber-50 to-emerald-50 p-3 rounded-xl border border-amber-200/70 text-xs text-slate-700 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Como funciona para este contrato:</strong>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  A cada parcela de <strong>{formatCurrency(installmentAmount)}</strong> paga,{' '}
                  <strong>{formatCurrency(principalPerInstallment)}</strong> retornam para o seu caixa de capital de giro e{' '}
                  <strong className="text-amber-800">
                    +{Math.round(interestPerInstallment)} créditos
                  </strong>{' '}
                  são creditados na conta do cliente para resgate de produtos e serviços.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Efetivar Empréstimo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

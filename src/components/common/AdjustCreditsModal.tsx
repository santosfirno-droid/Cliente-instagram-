import React, { useState } from 'react';
import { Sparkles, Plus, Minus, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';
import { Customer } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCredits } from '../../utils/formatters';

interface AdjustCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

export const AdjustCreditsModal: React.FC<AdjustCreditsModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const { adjustCustomerCredits } = useApp();
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState<string>('50');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const numericAmount = Math.max(0, Number(amount) || 0);
  const previousBalance = customer.creditBalance;
  const newBalance =
    type === 'credit'
      ? previousBalance + numericAmount
      : Math.max(0, previousBalance - numericAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (numericAmount <= 0) {
      setError('Por favor, informe uma quantidade de créditos válida maior que zero.');
      return;
    }

    if (!reason.trim()) {
      setError('O motivo da alteração é obrigatório para garantir a auditoria.');
      return;
    }

    if (type === 'debit' && previousBalance < numericAmount) {
      setError(
        `Saldo insuficiente! O cliente possui ${previousBalance} créditos, não sendo possível debitar ${numericAmount} créditos.`
      );
      return;
    }

    const res = adjustCustomerCredits({
      customerId: customer.id,
      amount: numericAmount,
      type,
      reason: reason.trim(),
      performedBy: 'admin',
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg('');
        setReason('');
        onClose();
      }, 1400);
    } else {
      setError(res.message);
    }
  };

  const presetReasonsCredit = [
    'Bônus promocional de fidelidade',
    'Recompensa por indicação de novo cliente',
    'Compensação operacional por atraso',
    'Campanha especial de aniversário',
  ];

  const presetReasonsDebit = [
    'Utilização presencial em serviço parceiro',
    'Estorno por duplicidade de lançamento',
    'Resgate manual de produto',
    'Ajuste contábil solicitado pelo cliente',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Ajuste Manual de Créditos
              </h3>
              <p className="text-xs text-slate-400">Cliente: {customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Type Toggle: Credit vs Debit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('credit')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all ${
                  type === 'credit'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                Adicionar Créditos (+)
              </button>
              <button
                type="button"
                onClick={() => setType('debit')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs border transition-all ${
                  type === 'debit'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Minus className="w-4 h-4" />
                Descontar Créditos (-)
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Quantidade de Créditos
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-lg font-bold px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              placeholder="Ex: 100"
              required
            />
          </div>

          {/* Live Preview Box - Exact format requested by user */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono space-y-1.5 text-slate-700">
            <div className="text-[11px] font-bold text-slate-400 uppercase font-sans tracking-wider mb-1">
              Demonstrativo de Impacto:
            </div>
            <div className="flex justify-between">
              <span>Saldo anterior:</span>
              <span className="font-bold">{customer.creditBalance} créditos</span>
            </div>
            <div className="flex justify-between text-slate-800">
              <span>{type === 'credit' ? 'Adição (+):' : 'Desconto (-):'}</span>
              <span
                className={`font-bold ${
                  type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {type === 'credit' ? '+' : '-'} {numericAmount} créditos
              </span>
            </div>
            <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-950 text-sm">
              <span>Saldo atual resultante:</span>
              <span className="text-emerald-700">{newBalance} créditos</span>
            </div>
          </div>

          {/* Mandatory Reason */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Motivo da Alteração <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Obrigatório para auditoria</span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              placeholder="Ex: Utilização de serviço de consultoria / Bonificação de fidelidade..."
              required
            />

            {/* Quick Preset Buttons */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(type === 'credit' ? presetReasonsCredit : presetReasonsDebit).map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setReason(preset)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Submit & Cancel */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                type === 'credit'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirmar Alteração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

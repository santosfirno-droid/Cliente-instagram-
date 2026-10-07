import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Gift,
  Wrench,
  Package,
  ArrowRight,
  X,
  Copy,
  Check,
  Tag,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CatalogItem, RedemptionOrder } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const ClientCatalog: React.FC = () => {
  const {
    currentCustomer,
    catalogItems,
    redeemProduct,
    redemptions,
    brand,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'my_redemptions'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [confirmModalItem, setConfirmModalItem] = useState<CatalogItem | null>(null);
  const [successRedemption, setSuccessRedemption] = useState<{
    item: CatalogItem;
    voucherCode: string;
    newBalance: number;
  } | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!currentCustomer) return null;

  const myRedemptions = redemptions.filter((r) => r.customerId === currentCustomer.id);

  const categories = [
    { id: 'all', label: 'Todos os Itens' },
    { id: 'servico', label: 'Serviços' },
    { id: 'vale', label: 'Vales & Vouchers' },
    { id: 'produto', label: 'Produtos Físicos' },
    { id: 'consultoria', label: 'Consultorias' },
  ];

  const filteredItems = catalogItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleOpenConfirm = (item: CatalogItem) => {
    setErrorMessage('');
    if (currentCustomer.creditBalance < item.creditCost) {
      setErrorMessage(
        `Saldo insuficiente! Você possui ${currentCustomer.creditBalance} créditos, mas este item custa ${item.creditCost} créditos.`
      );
      return;
    }
    setConfirmModalItem(item);
  };

  const handleExecuteRedemption = () => {
    if (!confirmModalItem) return;

    const res = redeemProduct(confirmModalItem.id, currentCustomer.id);
    if (res.success) {
      // Trigger festive confetti animation!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const newBal = currentCustomer.creditBalance - confirmModalItem.creditCost;
      setSuccessRedemption({
        item: confirmModalItem,
        voucherCode: `VOUCHER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        newBalance: newBal,
      });
      setConfirmModalItem(null);
    } else {
      setErrorMessage(res.message);
      setConfirmModalItem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Client Balance Reminder */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Catálogo de Produtos & Serviços
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Utilize seus créditos acumulados para resgatar vantagens, serviços parceiros e vales
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl px-4 py-2 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 block">
                Seu Saldo Disponível
              </span>
              <span className="text-sm font-black text-amber-950">
                {currentCustomer.creditBalance} créditos
              </span>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 gap-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3.5 px-3 border-b-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Disponíveis para Resgate ({catalogItems.filter((i) => i.available).length})
        </button>
        <button
          onClick={() => setActiveTab('my_redemptions')}
          className={`py-3.5 px-3 border-b-2 transition-colors ${
            activeTab === 'my_redemptions'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Meus Vouchers Resgatados ({myRedemptions.length})
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid of Catalog items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const hasEnoughCredits = currentCustomer.creditBalance >= item.creditCost;
              const missingCredits = item.creditCost - currentCustomer.creditBalance;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                        {item.category === 'servico' ? (
                          <Wrench className="w-5 h-5" />
                        ) : item.category === 'vale' ? (
                          <Gift className="w-5 h-5" />
                        ) : (
                          <Package className="w-5 h-5" />
                        )}
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 font-black text-sm text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          {item.creditCost} créditos
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                          {item.category}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom action */}
                  <div className="p-5 pt-0">
                    {hasEnoughCredits ? (
                      <button
                        onClick={() => handleOpenConfirm(item)}
                        className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Resgatar por {item.creditCost} créditos</span>
                      </button>
                    ) : (
                      <div className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 text-center border border-slate-200 flex items-center justify-center gap-1.5">
                        <span>Faltam {missingCredits} créditos</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: My Redemptions */}
      {activeTab === 'my_redemptions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {myRedemptions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Você ainda não realizou resgates com seus créditos.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myRedemptions.map((red) => (
                <div
                  key={red.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {red.productTitle}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          red.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {red.status === 'completed' ? 'Entregue' : 'Voucher Disponível'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Resgatado em: {formatDateTime(red.redemptionDate)} • Valor pago:{' '}
                      <strong className="text-amber-800">{red.creditCost} créditos</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3 min-w-[200px]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Código do Voucher:
                      </div>
                      <div className="font-mono font-bold text-xs text-slate-900">
                        {red.voucherCode}
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-bold">Válido</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal - Exact user logic demonstration */}
      {confirmModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">Confirmar Resgate de Benefício</h3>
              </div>
              <button
                onClick={() => setConfirmModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center mb-2">
                  <Gift className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {confirmModalItem.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{confirmModalItem.description}</p>
              </div>

              {/* Exact user example demonstrated mathematically:
                  "Saldo anterior: 300 créditos
                   Desconto: 100 créditos
                   Saldo atual: 200 créditos" */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wider mb-1">
                  Demonstrativo da Operação:
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Saldo anterior:</span>
                  <span className="font-bold">{currentCustomer.creditBalance} créditos</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Desconto (Resgate):</span>
                  <span>- {confirmModalItem.creditCost} créditos</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-950 text-sm">
                  <span>Saldo atual resultante:</span>
                  <span className="text-emerald-700">
                    {currentCustomer.creditBalance - confirmModalItem.creditCost} créditos
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModalItem(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteRedemption}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar e Gerar Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successRedemption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Parabéns! Resgate Concluído!
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {successRedemption.item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Seu voucher foi emitido com sucesso e já está disponível em sua conta.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1">
              <div className="text-[10px] uppercase font-bold text-amber-800">
                Código do seu Voucher
              </div>
              <div className="font-mono text-base font-black text-slate-900 flex items-center justify-between">
                <span>{successRedemption.voucherCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(successRedemption.voucherCode);
                    setCopiedVoucher(true);
                    setTimeout(() => setCopiedVoucher(false), 2000);
                  }}
                  className="text-xs text-amber-900 hover:text-amber-700 p-1 flex items-center gap-1"
                >
                  {copiedVoucher ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedVoucher ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="text-[11px] text-amber-700 pt-1">
                Novo saldo disponível: <strong>{successRedemption.newBalance} créditos</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessRedemption(null);
                setActiveTab('my_redemptions');
              }}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Ver Meus Vouchers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

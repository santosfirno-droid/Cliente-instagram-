import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Package,
  Wrench,
  Gift,
  Search,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CatalogItem, RedemptionOrder } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const AdminCatalog: React.FC = () => {
  const {
    catalogItems,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    redemptions,
    updateRedemptionStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'redemptions'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CatalogItem['category']>('servico');
  const [creditCost, setCreditCost] = useState('100');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [available, setAvailable] = useState(true);
  const [highlight, setHighlight] = useState(false);
  const [error, setError] = useState('');

  const openNewItemModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setCategory('servico');
    setCreditCost('100');
    setStockQuantity('10');
    setAvailable(true);
    setHighlight(false);
    setError('');
    setIsModalOpen(true);
  };

  const openEditItemModal = (item: CatalogItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setCreditCost(String(item.creditCost));
    setStockQuantity(String(item.stockQuantity));
    setAvailable(item.available);
    setHighlight(item.highlight || false);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cost = Math.max(1, parseInt(creditCost) || 0);
    const stock = Math.max(0, parseInt(stockQuantity) || 0);

    if (!title.trim()) {
      setError('O título do item é obrigatório.');
      return;
    }

    if (editingItem) {
      updateCatalogItem(editingItem.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        creditCost: cost,
        stockQuantity: stock,
        available,
        highlight,
      });
    } else {
      addCatalogItem({
        title: title.trim(),
        description: description.trim(),
        category,
        creditCost: cost,
        stockQuantity: stock,
        available,
        highlight,
        iconName: category === 'servico' ? 'wrench' : category === 'vale' ? 'gift' : 'package',
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Produtos & Serviços (Catálogo de Resgate)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre os itens que seus clientes podem resgatar utilizando os créditos gerados pelos empréstimos
          </p>
        </div>

        <button
          onClick={openNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          Cadastrar Novo Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 gap-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3.5 px-3 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Itens Cadastrados ({catalogItems.length})
        </button>
        <button
          onClick={() => setActiveTab('redemptions')}
          className={`py-3.5 px-3 border-b-2 transition-colors ${
            activeTab === 'redemptions'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Pedidos de Resgate Efetuados ({redemptions.length})
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {catalogItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
                    {item.category === 'servico' ? (
                      <Wrench className="w-5 h-5" />
                    ) : item.category === 'vale' ? (
                      <Gift className="w-5 h-5" />
                    ) : (
                      <Package className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1 font-black text-sm text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {item.creditCost} créditos
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase mt-1.5 px-2 py-0.5 rounded-full ${
                        item.available && item.stockQuantity > 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {item.available && item.stockQuantity > 0
                        ? `${item.stockQuantity} disponíveis`
                        : 'Esgotado / Indisponível'}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Categoria: {item.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditItemModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                    title="Editar produto"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir o item "${item.title}"?`)) {
                        deleteCatalogItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'redemptions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código / Voucher</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Item Resgatado</th>
                  <th className="py-3 px-4">Créditos Pagos</th>
                  <th className="py-3 px-4">Status da Entrega</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {redemptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Nenhum resgate efetuado ainda.
                    </td>
                  </tr>
                ) : (
                  redemptions.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">
                          {order.orderCode}
                        </div>
                        <div className="font-mono text-[10px] text-amber-700 font-semibold">
                          {order.voucherCode}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {formatDateTime(order.redemptionDate)}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-800">
                        {order.customerName}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-900">
                        {order.productTitle}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {order.creditCost} créditos
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {order.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Entregue / Concluído
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pendente de Entrega
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {order.status !== 'completed' ? (
                          <button
                            onClick={() => updateRedemptionStatus(order.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                          >
                            Marcar Entregue
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Finalizado</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100">
                {editingItem ? 'Editar Produto / Serviço' : 'Cadastrar Novo Produto ou Serviço'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{error}</div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Item / Serviço *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Consultoria Financeira Individual, Vale-Compras R$ 100..."
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="servico">Serviço</option>
                    <option value="produto">Produto Físico</option>
                    <option value="vale">Vale / Voucher Digital</option>
                    <option value="consultoria">Consultoria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preço em Créditos *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={creditCost}
                    onChange={(e) => setCreditCost(e.target.value)}
                    placeholder="100"
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estoque / Vagas Disponíveis
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Item Ativo para Resgate</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição Detalhada do Benefício
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explique o que o cliente recebe ao resgatar este item com seus créditos..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

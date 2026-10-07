import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CreditCard,
  Plus,
  Minus,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2,
  Lock,
} from 'lucide-react';
import { Customer, Loan, Installment } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatCredits,
  formatDate,
  formatDateTime,
  formatCPF,
  formatPhone,
} from '../../utils/formatters';
import { AdjustCreditsModal } from '../common/AdjustCreditsModal';
import { PayInstallmentModal } from './PayInstallmentModal';
import { ReceiptModal } from '../common/ReceiptModal';
import { NewLoanModal } from './NewLoanModal';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customerId,
}) => {
  const {
    getCustomerById,
    loans,
    getCustomerCreditTransactions,
    loginAsCustomer,
    updateCustomer,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'credits' | 'edit'>('overview');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [selectedPayTarget, setSelectedPayTarget] = useState<{
    loan: Loan;
    installment: Installment;
  } | null>(null);
  const [selectedReceiptTarget, setSelectedReceiptTarget] = useState<{
    loan: Loan;
    installment: Installment;
  } | null>(null);

  // Edit form state
  const customer = getCustomerById(customerId);
  const [editName, setEditName] = useState('');
  const [editDoc, setEditDoc] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPix, setEditPix] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  React.useEffect(() => {
    if (customer) {
      setEditName(customer.name);
      setEditDoc(customer.document);
      setEditPhone(customer.phone);
      setEditEmail(customer.email);
      setEditAddress(customer.address);
      setEditPix(customer.pixKey || '');
      setEditNotes(customer.notes || '');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const customerLoans = loans.filter((l) => l.customerId === customer.id);
  const creditLogs = getCustomerCreditTransactions(customer.id);

  // Calculate statistics for this customer
  const totalLentToCustomer = customerLoans.reduce((sum, l) => sum + l.principalAmount, 0);
  const totalInterestExpected = customerLoans.reduce((sum, l) => sum + l.totalInterest, 0);
  let totalPaidByCustomer = 0;
  let totalPendingByCustomer = 0;
  let pendingInstallmentsCount = 0;

  customerLoans.forEach((loan) => {
    loan.installments.forEach((inst) => {
      if (inst.status === 'paid') {
        totalPaidByCustomer += inst.amount;
      } else {
        totalPendingByCustomer += inst.amount;
        pendingInstallmentsCount++;
      }
    });
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer(customer.id, {
      name: editName,
      document: editDoc,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
      pixKey: editPix,
      notes: editNotes,
    });
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 my-6 max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl">
                {customer.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{customer.name}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {customer.status === 'active' ? 'Ativo' : 'Bloqueado'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>CPF: {formatCPF(customer.document)}</span>
                  <span>•</span>
                  <span>{formatPhone(customer.phone)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  loginAsCustomer(customer.id);
                  onClose();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                title="Abrir o Portal do Cliente simulando o acesso deste cliente"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver como Cliente
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'loans'
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Empréstimos ({customerLoans.length})
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'credits'
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Extrato de Créditos ({creditLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-3 border-b-2 transition-colors ${
                activeTab === 'edit'
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Editar Dados
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Credit balance banner with manual adjust buttons */}
                <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Saldo de Créditos Acumulados
                    </span>
                    <div className="text-3xl font-black text-white">
                      {customer.creditBalance}{' '}
                      <span className="text-sm font-semibold text-slate-300">créditos</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Disponíveis para resgate de produtos e serviços parceiros
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAdjustModalOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Ajustar Saldo
                    </button>
                    <button
                      onClick={() => setIsNewLoanOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Novo Empréstimo
                    </button>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Total Emprestado
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(totalLentToCustomer)}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Total Já Pago
                    </span>
                    <span className="text-sm font-black text-emerald-700">
                      {formatCurrency(totalPaidByCustomer)}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Saldo Devedor
                    </span>
                    <span className="text-sm font-black text-blue-700">
                      {formatCurrency(totalPendingByCustomer)}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Parcelas Pendentes
                    </span>
                    <span className="text-sm font-black text-amber-700">
                      {pendingInstallmentsCount} parcelas
                    </span>
                  </div>
                </div>

                {/* Client Contact & Registration Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Dados Cadastrais
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.email || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{formatPhone(customer.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{customer.address || 'Endereço não cadastrado'}</span>
                    </div>
                    {customer.pixKey && (
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Chave Pix: {customer.pixKey}</span>
                      </div>
                    )}
                  </div>
                  {customer.notes && (
                    <div className="mt-2 text-xs bg-amber-50/60 border border-amber-200/60 rounded-lg p-2.5 text-amber-900">
                      <strong>Observações:</strong> {customer.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Loans list */}
            {activeTab === 'loans' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Histórico de Contratos ({customerLoans.length})
                  </span>
                  <button
                    onClick={() => setIsNewLoanOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Novo Empréstimo
                  </button>
                </div>

                {customerLoans.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                    Nenhum empréstimo cadastrado para este cliente.
                  </div>
                ) : (
                  customerLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white"
                    >
                      {/* Loan mini header */}
                      <div className="bg-slate-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md">
                            {loan.code}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Capital: {formatCurrency(loan.principalAmount)} ({loan.interestRatePercent}% juros)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              loan.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {loan.status === 'completed' ? 'Quitado' : 'Em Andamento'}
                          </span>
                          <span className="text-xs text-slate-500">
                            Total: {formatCurrency(loan.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Installments Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100/50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                            <tr>
                              <th className="py-2 px-3">#</th>
                              <th className="py-2 px-3">Vencimento</th>
                              <th className="py-2 px-3">Valor</th>
                              <th className="py-2 px-3">Capital Devolvido</th>
                              <th className="py-2 px-3">Juros → Créditos</th>
                              <th className="py-2 px-3">Status</th>
                              <th className="py-2 px-3 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {loan.installments.map((inst) => (
                              <tr key={inst.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-2 px-3 font-medium text-slate-600">
                                  {inst.number}/{inst.totalInstallments}
                                </td>
                                <td className="py-2 px-3">{formatDate(inst.dueDate)}</td>
                                <td className="py-2 px-3 font-semibold text-slate-900">
                                  {formatCurrency(inst.amount)}
                                </td>
                                <td className="py-2 px-3 text-slate-600">
                                  {formatCurrency(inst.principalAmount)}
                                </td>
                                <td className="py-2 px-3 text-amber-700 font-bold">
                                  +{formatCredits(inst.interestAmount)}
                                </td>
                                <td className="py-2 px-3">
                                  {inst.status === 'paid' ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Pago
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                      <Clock className="w-3 h-3" />
                                      Pendente
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  {inst.status === 'pending' ? (
                                    <button
                                      onClick={() => setSelectedPayTarget({ loan, installment: inst })}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors shadow-2xs"
                                    >
                                      Receber Parcela
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setSelectedReceiptTarget({ loan, installment: inst })}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-[11px] transition-colors"
                                    >
                                      Comprovante
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Credits audit trail */}
            {activeTab === 'credits' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Extrato Auditável de Créditos
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Saldo anterior, entrada/saída, motivo obrigatório e novo saldo registrado
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAdjustModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Novo Lançamento
                  </button>
                </div>

                {creditLogs.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                    Nenhuma movimentação de crédito registrada.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Data / Hora</th>
                          <th className="py-2.5 px-3">Saldo Anterior</th>
                          <th className="py-2.5 px-3">Movimento</th>
                          <th className="py-2.5 px-3">Saldo Atual</th>
                          <th className="py-2.5 px-3">Motivo / Descrição</th>
                          <th className="py-2.5 px-3">Origem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {creditLogs.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                              {formatDateTime(tx.createdAt)}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-500">
                              {tx.previousBalance} pts
                            </td>
                            <td className="py-2.5 px-3 font-bold whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                                  tx.type === 'credit'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {tx.type === 'credit' ? '+' : '-'} {tx.amount} pts
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              {tx.currentBalance} pts
                            </td>
                            <td className="py-2.5 px-3 max-w-xs text-slate-700">
                              {tx.reason}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-400 capitalize">
                              {tx.performedBy === 'system'
                                ? 'Automático (Juros)'
                                : tx.performedBy === 'admin'
                                ? 'Gestor'
                                : 'Cliente'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Edit Customer */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSaveEdit} className="space-y-4 max-w-xl">
                {editSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Dados do cliente atualizados com sucesso!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      CPF / Documento *
                    </label>
                    <input
                      type="text"
                      value={editDoc}
                      onChange={(e) => setEditDoc(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chave Pix do Cliente
                    </label>
                    <input
                      type="text"
                      value={editPix}
                      onChange={(e) => setEditPix(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Anotações Internas
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Salvar Alterações
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Child Modals */}
      {isAdjustModalOpen && (
        <AdjustCreditsModal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          customer={customer}
        />
      )}

      {isNewLoanOpen && (
        <NewLoanModal
          isOpen={isNewLoanOpen}
          onClose={() => setIsNewLoanOpen(false)}
          preselectedCustomerId={customer.id}
        />
      )}

      {selectedPayTarget && (
        <PayInstallmentModal
          isOpen={Boolean(selectedPayTarget)}
          onClose={() => setSelectedPayTarget(null)}
          loan={selectedPayTarget.loan}
          installment={selectedPayTarget.installment}
          onPaymentSuccess={(paidInst) => {
            setSelectedReceiptTarget({
              loan: selectedPayTarget.loan,
              installment: paidInst,
            });
          }}
        />
      )}

      {selectedReceiptTarget && (
        <ReceiptModal
          isOpen={Boolean(selectedReceiptTarget)}
          onClose={() => setSelectedReceiptTarget(null)}
          loan={selectedReceiptTarget.loan}
          installment={selectedReceiptTarget.installment}
        />
      )}
    </>
  );
};

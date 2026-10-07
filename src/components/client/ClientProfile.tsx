import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, ShieldCheck, Check, CreditCard, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCPF, formatPhone, formatDate } from '../../utils/formatters';

export const ClientProfile: React.FC = () => {
  const { currentCustomer, updateCustomer } = useApp();

  const [phone, setPhone] = useState(currentCustomer?.phone || '');
  const [address, setAddress] = useState(currentCustomer?.address || '');
  const [saved, setSaved] = useState(false);

  if (!currentCustomer) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer(currentCustomer.id, {
      phone,
      address,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Meus Dados Cadastrais</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Suas informações pessoais cadastradas com segurança no sistema
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            Dados atualizados com sucesso!
          </div>
        )}

        {/* Read only sensitive data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Nome Completo
            </span>
            <div className="font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {currentCustomer.name}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              CPF / Documento
            </span>
            <div className="font-mono font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {formatCPF(currentCustomer.document)}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              E-mail Principal
            </span>
            <div className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 truncate">
              {currentCustomer.email || 'Não informado'}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Cliente Desde
            </span>
            <div className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {formatDate(currentCustomer.createdAt)}
            </div>
          </div>
        </div>

        {/* Editable info */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Atualizar Informações de Contato
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Endereço Completo
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-slate-900">Privacidade Garantida:</strong>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Seu acesso é individual e restrito. Nenhuma informação financeira, contratos ou saldo de
              créditos é visível para outros clientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

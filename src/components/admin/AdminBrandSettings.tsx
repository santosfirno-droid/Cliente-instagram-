import React, { useState } from 'react';
import {
  Palette,
  Image,
  Upload,
  Check,
  RotateCcw,
  Building,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Landmark,
  Coins,
  Wallet,
  Gem,
  CreditCard,
  Phone,
  Mail,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';

export const AdminBrandSettings: React.FC = () => {
  const { brand, updateBrand, resetAllData } = useApp();

  const [companyName, setCompanyName] = useState(brand.companyName);
  const [tradingName, setTradingName] = useState(brand.tradingName);
  const [slogan, setSlogan] = useState(brand.slogan);
  const [logoUrl, setLogoUrl] = useState(brand.logoUrl);
  const [logoIcon, setLogoIcon] = useState(brand.logoIcon);
  const [primaryColor, setPrimaryColor] = useState(brand.primaryColor);
  const [pixKey, setPixKey] = useState(brand.pixKey);
  const [pixReceiverName, setPixReceiverName] = useState(brand.pixReceiverName);
  const [contactPhone, setContactPhone] = useState(brand.contactPhone);
  const [contactEmail, setContactEmail] = useState(brand.contactEmail);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const colorPresets = [
    { name: 'Teal / Esmeralda', hex: '#0f766e', desc: 'Sóbrio e confiável' },
    { name: 'Azul Real / Navy', hex: '#1e3a8a', desc: 'Bancos e corporativo' },
    { name: 'Índigo Moderno', hex: '#4338ca', desc: 'Fintech tecnológica' },
    { name: 'Dourado / Ouro', hex: '#b45309', desc: 'Crédito premium' },
    { name: 'Verde Floresta', hex: '#15803d', desc: 'Crescimento e capital' },
    { name: 'Roxo Deep', hex: '#6b21a8', desc: 'Inovação e benefícios' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand({
      companyName,
      tradingName,
      slogan,
      logoUrl,
      logoIcon,
      primaryColor,
      pixKey,
      pixReceiverName,
      contactPhone,
      contactEmail,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Identidade Visual & Marca Própria
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalize a logomarca, paleta de cores e dados da empresa aplicados em todo o sistema e no Portal do Cliente
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Deseja resetar todos os dados e restaurar o estado inicial demonstrativo?')) {
              resetAllData();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar Demonstração
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Settings (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            {savedSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Identidade visual e configurações salvas com sucesso em todo o sistema!
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Nome e Apresentação da Marca
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Empresa / Marca *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: CrediCapital"
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Razão Social / Nome Completo
                  </label>
                  <input
                    type="text"
                    value={tradingName}
                    onChange={(e) => setTradingName(e.target.value)}
                    placeholder="Ex: CrediCapital Soluções Financeiras Ltda"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slogan ou Frase de Efeito no Portal
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Ex: Crédito inteligente com juros que viram vantagens para você"
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Logo Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Logotipo da Empresa
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fazer Upload de Imagem (PNG, JPG, SVG)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 cursor-pointer bg-slate-50 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700">Escolher arquivo</span>
                    <span className="text-[10px] text-slate-400">Dimensão ideal: quadrada</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ou Inserir URL da Imagem da Logo
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://suaempresa.com.br/logo.png"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="mt-1 text-[11px] text-rose-600 hover:underline"
                    >
                      Remover logotipo e usar ícone
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Icon Alternative */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Ícone Representativo (caso não tenha imagem):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'landmark', label: 'Financeiro', icon: <Landmark className="w-4 h-4" /> },
                    { id: 'shield-check', label: 'Segurança', icon: <ShieldCheck className="w-4 h-4" /> },
                    { id: 'coins', label: 'Moedas', icon: <Coins className="w-4 h-4" /> },
                    { id: 'wallet', label: 'Carteira', icon: <Wallet className="w-4 h-4" /> },
                    { id: 'gem', label: 'Vantagens', icon: <Gem className="w-4 h-4" /> },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setLogoIcon(item.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        logoIcon === item.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                3. Paleta de Cores do Sistema
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.hex}
                    onClick={() => setPrimaryColor(preset.hex)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      primaryColor === preset.hex
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-lg shrink-0 shadow-2xs flex items-center justify-center text-white"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {primaryColor === preset.hex && <Check className="w-3.5 h-3.5" />}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400">{preset.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-slate-700">Ou Cor Hexadecimal Personalizada:</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-28 text-xs font-mono font-bold px-2 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Pix & Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                4. Dados de Contato e Chave Pix Padrão
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chave Pix para Recebimento das Parcelas *
                  </label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="financeiro@suaempresa.com.br"
                    className="w-full text-xs font-medium px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-400">
                    Aparecerá no aplicativo do cliente na hora de pagar a parcela
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Beneficiário da Chave Pix
                  </label>
                  <input
                    type="text"
                    value={pixReceiverName}
                    onChange={(e) => setPixReceiverName(e.target.value)}
                    placeholder="Nome ou Razão Social"
                    className="w-full text-xs font-medium px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone / WhatsApp de Suporte
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail de Atendimento
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contato@suaempresa.com.br"
                    className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Salvar Identidade Visual & Configurações
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 sticky top-24">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pré-visualização em Tempo Real
            </h3>

            {/* Mini Header Preview */}
            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                Topo do Aplicativo:
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs p-2 overflow-hidden shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Landmark className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 truncate">
                    {companyName || 'Sua Empresa'}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {slogan || 'Seu slogan aqui'}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Credit Card Mockup */}
            <div
              className="rounded-2xl p-4 text-white shadow-md relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 100%)`,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold block">
                    {companyName}
                  </span>
                  <span className="text-xs font-extrabold text-white">Cartão de Créditos</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-300">Saldo Disponível</span>
                <div className="text-2xl font-black text-white">
                  350 <span className="text-xs font-semibold text-amber-400">créditos</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[10px] text-slate-300 font-mono">
                <span>CLIENTE EXCLUSIVO</span>
                <span>CHAVE PIX ATIVA</span>
              </div>
            </div>

            {/* Pix payment card preview */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Dados Pix para o Cliente
              </span>
              <div className="flex justify-between font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200">
                <span className="truncate">{pixKey}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Beneficiário: {pixReceiverName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

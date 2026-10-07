export type Role = 'admin' | 'client';

export interface BrandSettings {
  companyName: string;
  tradingName: string;
  slogan: string;
  logoUrl: string;
  logoIcon: 'landmark' | 'shield-check' | 'coins' | 'wallet' | 'gem';
  primaryColor: string; // e.g. '#0f766e' (Teal/Emerald), '#1e3a8a', '#4338ca', '#b45309'
  primaryColorPreset: 'emerald' | 'navy' | 'indigo' | 'amber' | 'teal' | 'purple' | 'custom';
  accentColor: string;
  pixKey: string;
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  pixReceiverName: string;
  pixCity: string;
  contactPhone: string;
  contactEmail: string;
}

export interface Customer {
  id: string;
  name: string;
  document: string; // CPF or CNPJ
  email: string;
  phone: string;
  creditBalance: number; // Saldo atual de créditos
  address: string;
  pixKey?: string;
  password?: string;
  notes?: string;
  createdAt: string;
  status: 'active' | 'blocked';
}

export type LoanFrequency = 'monthly' | 'biweekly' | 'weekly';

export interface Installment {
  id: string;
  loanId: string;
  customerId: string;
  number: number;
  totalInstallments: number;
  dueDate: string; // YYYY-MM-DD
  amount: number; // Total installment amount in R$
  principalAmount: number; // Capital a ser devolvido ao caixa
  interestAmount: number; // Juros que viram CRÉDITOS para o cliente!
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  paidAmount?: number;
  creditEarned?: number; // Créditos concedidos
  receiptNotes?: string;
}

export interface Loan {
  id: string;
  code: string; // e.g. EMP-001
  customerId: string;
  customerName: string;
  principalAmount: number; // Capital emprestado
  interestRatePercent: number; // Taxa de juros total % (ex: 20%)
  totalInterest: number; // Juros totais em R$
  totalAmount: number; // Capital + Juros em R$
  installmentsCount: number;
  installmentAmount: number;
  interestPerInstallment: number;
  principalPerInstallment: number;
  frequency: LoanFrequency;
  startDate: string;
  status: 'active' | 'completed' | 'defaulted';
  notes?: string;
  createdAt: string;
  installments: Installment[];
}

export type CreditTransactionType = 'credit' | 'debit';

export type CreditReferenceType =
  | 'installment_payment'
  | 'reward_redemption'
  | 'manual_adjustment'
  | 'bonus'
  | 'refund';

export interface CreditTransaction {
  id: string;
  customerId: string;
  customerName: string;
  previousBalance: number;
  type: CreditTransactionType;
  amount: number;
  currentBalance: number;
  reason: string; // Motivo obrigatório
  referenceType: CreditReferenceType;
  referenceId?: string;
  performedBy: 'admin' | 'system' | 'client';
  createdAt: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  category: 'servico' | 'produto' | 'vale' | 'consultoria' | 'outro';
  creditCost: number; // Valor em créditos
  available: boolean;
  stockQuantity: number;
  imageUrl?: string;
  iconName: string;
  highlight?: boolean;
}

export interface RedemptionOrder {
  id: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  productId: string;
  productTitle: string;
  creditCost: number;
  redemptionDate: string;
  status: 'pending_delivery' | 'completed' | 'cancelled';
  voucherCode: string;
  notes?: string;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BrandSettings,
  Customer,
  Loan,
  Installment,
  CreditTransaction,
  CatalogItem,
  RedemptionOrder,
  Role,
  LoanFrequency,
} from '../types';
import {
  initialBrandSettings,
  initialCustomers,
  initialLoans,
  initialCreditTransactions,
  initialCatalogItems,
  initialRedemptions,
} from '../data/initialData';

interface AppContextType {
  // Role & auth
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentCustomer: Customer | null;
  loginAsCustomer: (customerId: string) => boolean;
  logoutCustomer: () => void;

  // Brand identity
  brand: BrandSettings;
  updateBrand: (newBrand: Partial<BrandSettings>) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customerData: Omit<Customer, 'id' | 'creditBalance' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Loans & Installments
  loans: Loan[];
  createLoan: (params: {
    customerId: string;
    principalAmount: number;
    interestRatePercent: number;
    installmentsCount: number;
    frequency: LoanFrequency;
    startDate: string;
    notes?: string;
  }) => Loan;
  payInstallment: (params: {
    loanId: string;
    installmentId: string;
    paymentDate?: string;
    receiptNotes?: string;
  }) => { success: boolean; creditEarned: number; message: string };

  // Credits Management
  creditTransactions: CreditTransaction[];
  adjustCustomerCredits: (params: {
    customerId: string;
    amount: number; // positive number
    type: 'credit' | 'debit';
    reason: string;
    performedBy?: 'admin' | 'system' | 'client';
  }) => { success: boolean; message: string };
  getCustomerCreditTransactions: (customerId: string) => CreditTransaction[];

  // Catalog & Redemptions
  catalogItems: CatalogItem[];
  addCatalogItem: (item: Omit<CatalogItem, 'id'>) => void;
  updateCatalogItem: (id: string, item: Partial<CatalogItem>) => void;
  deleteCatalogItem: (id: string) => void;
  redemptions: RedemptionOrder[];
  redeemProduct: (productId: string, customerId: string) => { success: boolean; message: string };
  updateRedemptionStatus: (redemptionId: string, status: 'pending_delivery' | 'completed' | 'cancelled') => void;

  // Financial calculations
  metrics: {
    totalLentCapital: number;
    recoveredCapital: number;
    circulatingCapital: number;
    totalInterestGenerated: number;
    totalInterestPaid: number;
    totalCreditsIssued: number;
    totalCreditsRedeemed: number;
    currentActiveCredits: number;
    activeLoansCount: number;
    completedLoansCount: number;
    totalCustomersCount: number;
    overdueInstallmentsCount: number;
  };

  // Reset
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  BRAND: 'credicapital_brand_v1',
  CUSTOMERS: 'credicapital_customers_v1',
  LOANS: 'credicapital_loans_v1',
  TRANSACTIONS: 'credicapital_transactions_v1',
  CATALOG: 'credicapital_catalog_v1',
  REDEMPTIONS: 'credicapital_redemptions_v1',
  ROLE: 'credicapital_role_v1',
  CURRENT_CLIENT_ID: 'credicapital_client_id_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to defaults
  const [brand, setBrand] = useState<BrandSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRAND);
    return saved ? JSON.parse(saved) : initialBrandSettings;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
    return saved ? JSON.parse(saved) : initialLoans;
  });

  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialCreditTransactions;
  });

  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATALOG);
    return saved ? JSON.parse(saved) : initialCatalogItems;
  });

  const [redemptions, setRedemptions] = useState<RedemptionOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
    return saved ? JSON.parse(saved) : initialRedemptions;
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved === 'client' ? 'client' : 'admin';
  });

  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT_ID) || 'cli-1';
  });

  // Sync back to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BRAND, JSON.stringify(brand));
  }, [brand]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(creditTransactions));
  }, [creditTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalogItems));
  }, [catalogItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
  }, [redemptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentCustomerId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT_ID, currentCustomerId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT_ID);
    }
  }, [currentCustomerId]);

  // Current customer object derived from list
  const currentCustomer = customers.find((c) => c.id === currentCustomerId) || null;

  const loginAsCustomer = (customerId: string): boolean => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setCurrentCustomerId(customer.id);
      setCurrentRole('client');
      return true;
    }
    return false;
  };

  const logoutCustomer = () => {
    setCurrentCustomerId(null);
  };

  const updateBrand = (newBrand: Partial<BrandSettings>) => {
    setBrand((prev) => ({ ...prev, ...newBrand }));
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'creditBalance' | 'createdAt'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cli-${Date.now()}`,
      creditBalance: 0,
      createdAt: new Date().toISOString(),
      status: customerData.status || 'active',
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...customerData } : c))
    );
  };

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id);
  };

  // Loan creation with calculated installments, capital and interest
  const createLoan = (params: {
    customerId: string;
    principalAmount: number;
    interestRatePercent: number;
    installmentsCount: number;
    frequency: LoanFrequency;
    startDate: string;
    notes?: string;
  }): Loan => {
    const customer = customers.find((c) => c.id === params.customerId);
    const customerName = customer ? customer.name : 'Cliente';

    const principal = Number(params.principalAmount);
    const rate = Number(params.interestRatePercent);
    const count = Number(params.installmentsCount);

    const totalInterest = Math.round(((principal * rate) / 100) * 100) / 100;
    const totalAmount = Math.round((principal + totalInterest) * 100) / 100;
    const installmentAmount = Math.round((totalAmount / count) * 100) / 100;
    const principalPerInstallment = Math.round((principal / count) * 100) / 100;
    const interestPerInstallment = Math.round((totalInterest / count) * 100) / 100;

    const loanId = `emp-${Date.now()}`;
    const code = `EMP-${String(loans.length + 1).padStart(3, '0')}`;

    // Generate installments
    const installments: Installment[] = [];
    const baseDate = new Date(params.startDate + 'T00:00:00');

    for (let i = 1; i <= count; i++) {
      const dueDate = new Date(baseDate);
      if (params.frequency === 'monthly') {
        dueDate.setMonth(dueDate.getMonth() + i);
      } else if (params.frequency === 'biweekly') {
        dueDate.setDate(dueDate.getDate() + i * 14);
      } else if (params.frequency === 'weekly') {
        dueDate.setDate(dueDate.getDate() + i * 7);
      }

      installments.push({
        id: `parc-${loanId}-${i}`,
        loanId,
        customerId: params.customerId,
        number: i,
        totalInstallments: count,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: installmentAmount,
        principalAmount: principalPerInstallment,
        interestAmount: interestPerInstallment,
        status: 'pending',
      });
    }

    const newLoan: Loan = {
      id: loanId,
      code,
      customerId: params.customerId,
      customerName,
      principalAmount: principal,
      interestRatePercent: rate,
      totalInterest,
      totalAmount,
      installmentsCount: count,
      installmentAmount,
      interestPerInstallment,
      principalPerInstallment,
      frequency: params.frequency,
      startDate: params.startDate,
      status: 'active',
      notes: params.notes || '',
      createdAt: new Date().toISOString(),
      installments,
    };

    setLoans((prev) => [newLoan, ...prev]);
    return newLoan;
  };

  // Payment of an installment:
  // 1. Mark installment as paid
  // 2. Interest portion of this installment automatically transforms into CREDITS for the customer!
  // 3. Update customer's creditBalance
  // 4. Record credit transaction with full audit trail (previousBalance, amount, currentBalance, reason)
  // 5. If all installments are paid, update loan status to 'completed'
  const payInstallment = (params: {
    loanId: string;
    installmentId: string;
    paymentDate?: string;
    receiptNotes?: string;
  }): { success: boolean; creditEarned: number; message: string } => {
    const loan = loans.find((l) => l.id === params.loanId);
    if (!loan) return { success: false, creditEarned: 0, message: 'Empréstimo não encontrado.' };

    const installment = loan.installments.find((i) => i.id === params.installmentId);
    if (!installment) return { success: false, creditEarned: 0, message: 'Parcela não encontrada.' };

    if (installment.status === 'paid') {
      return { success: false, creditEarned: 0, message: 'Esta parcela já foi paga anteriormente.' };
    }

    const payDate = params.paymentDate || new Date().toISOString();
    const creditEarned = Math.round(installment.interestAmount); // Converted interest to credits

    // 1. Update customer's balance
    const customer = customers.find((c) => c.id === installment.customerId);
    if (!customer) return { success: false, creditEarned: 0, message: 'Cliente não encontrado.' };

    const previousBalance = customer.creditBalance;
    const newBalance = previousBalance + creditEarned;

    // 2. Create transaction record
    const transactionReason = `Juros da parcela #${installment.number}/${loan.installmentsCount} do empréstimo ${loan.code} convertidos em créditos`;
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      previousBalance,
      type: 'credit',
      amount: creditEarned,
      currentBalance: newBalance,
      reason: transactionReason,
      referenceType: 'installment_payment',
      referenceId: installment.id,
      performedBy: 'system',
      createdAt: new Date().toISOString(),
    };

    // 3. Update customer in state
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, creditBalance: newBalance } : c))
    );

    // 4. Update transaction list
    setCreditTransactions((prev) => [newTx, ...prev]);

    // 5. Update installment and check if all paid in loan
    let updatedLoanCompleted = false;
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id !== params.loanId) return l;

        const updatedInstallments = l.installments.map((inst) => {
          if (inst.id !== params.installmentId) return inst;
          return {
            ...inst,
            status: 'paid' as const,
            paidDate: payDate,
            paidAmount: inst.amount,
            creditEarned,
            receiptNotes: params.receiptNotes || `Pago com sucesso. +${creditEarned} créditos gerados!`,
          };
        });

        const allPaid = updatedInstallments.every((i) => i.status === 'paid');
        updatedLoanCompleted = allPaid;

        return {
          ...l,
          installments: updatedInstallments,
          status: allPaid ? ('completed' as const) : l.status,
        };
      })
    );

    return {
      success: true,
      creditEarned,
      message: `Parcela paga com sucesso! ${creditEarned} créditos foram adicionados à conta de ${customer.name}.${
        updatedLoanCompleted ? ' Empréstimo 100% quitado!' : ''
      }`,
    };
  };

  // Adjust customer credits manually (Admin)
  const adjustCustomerCredits = (params: {
    customerId: string;
    amount: number;
    type: 'credit' | 'debit';
    reason: string;
    performedBy?: 'admin' | 'system' | 'client';
  }): { success: boolean; message: string } => {
    const customer = customers.find((c) => c.id === params.customerId);
    if (!customer) return { success: false, message: 'Cliente não encontrado.' };

    if (!params.reason || params.reason.trim().length === 0) {
      return { success: false, message: 'O motivo da alteração é obrigatório para manter o histórico auditável.' };
    }

    const amount = Math.abs(Number(params.amount));
    if (amount <= 0) return { success: false, message: 'O valor deve ser maior que zero.' };

    const previousBalance = customer.creditBalance;

    if (params.type === 'debit' && previousBalance < amount) {
      return {
        success: false,
        message: `Saldo insuficiente. O cliente possui ${previousBalance} créditos, mas foram solicitados ${amount} créditos.`,
      };
    }

    const currentBalance =
      params.type === 'credit' ? previousBalance + amount : previousBalance - amount;

    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      previousBalance,
      type: params.type,
      amount,
      currentBalance,
      reason: params.reason.trim(),
      referenceType: 'manual_adjustment',
      performedBy: params.performedBy || 'admin',
      createdAt: new Date().toISOString(),
    };

    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, creditBalance: currentBalance } : c))
    );

    setCreditTransactions((prev) => [newTx, ...prev]);

    return {
      success: true,
      message: `Saldo atualizado com sucesso: de ${previousBalance} para ${currentBalance} créditos.`,
    };
  };

  const getCustomerCreditTransactions = (customerId: string) => {
    return creditTransactions.filter((tx) => tx.customerId === customerId);
  };

  // Catalog Item Management
  const addCatalogItem = (item: Omit<CatalogItem, 'id'>) => {
    const newItem: CatalogItem = {
      ...item,
      id: `prod-${Date.now()}`,
    };
    setCatalogItems((prev) => [newItem, ...prev]);
  };

  const updateCatalogItem = (id: string, itemData: Partial<CatalogItem>) => {
    setCatalogItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...itemData } : item))
    );
  };

  const deleteCatalogItem = (id: string) => {
    setCatalogItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Product Redemption with Customer Credits
  // E.g. Service costs 100 credits, client has 300 credits -> Balance becomes 200 credits
  const redeemProduct = (
    productId: string,
    customerId: string
  ): { success: boolean; message: string } => {
    const product = catalogItems.find((p) => p.id === productId);
    if (!product) return { success: false, message: 'Produto ou serviço não encontrado.' };
    if (!product.available || product.stockQuantity <= 0) {
      return { success: false, message: 'Este item não está disponível no momento.' };
    }

    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return { success: false, message: 'Cliente não encontrado.' };

    if (customer.creditBalance < product.creditCost) {
      return {
        success: false,
        message: `Saldo insuficiente! Você tem ${customer.creditBalance} créditos, mas este item custa ${product.creditCost} créditos.`,
      };
    }

    const previousBalance = customer.creditBalance;
    const currentBalance = previousBalance - product.creditCost;
    const orderCode = `RESG-${Date.now().toString().slice(-6)}`;
    const voucherCode = `VOUCHER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 1. Debit customer credits
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, creditBalance: currentBalance } : c))
    );

    // 2. Record credit transaction
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      previousBalance,
      type: 'debit',
      amount: product.creditCost,
      currentBalance,
      reason: `Resgate do item: ${product.title} (Código: ${voucherCode})`,
      referenceType: 'reward_redemption',
      referenceId: orderCode,
      performedBy: 'client',
      createdAt: new Date().toISOString(),
    };
    setCreditTransactions((prev) => [newTx, ...prev]);

    // 3. Decrement stock
    setCatalogItems((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - 1) } : p
      )
    );

    // 4. Create redemption order
    const order: RedemptionOrder = {
      id: `red-${Date.now()}`,
      orderCode,
      customerId: customer.id,
      customerName: customer.name,
      productId: product.id,
      productTitle: product.title,
      creditCost: product.creditCost,
      redemptionDate: new Date().toISOString(),
      status: 'pending_delivery',
      voucherCode,
      notes: 'Resgatado pelo Portal do Cliente com sucesso.',
    };
    setRedemptions((prev) => [order, ...prev]);

    return {
      success: true,
      message: `Resgate confirmado com sucesso! Seu voucher é: ${voucherCode}. Saldo restante: ${currentBalance} créditos.`,
    };
  };

  const updateRedemptionStatus = (
    redemptionId: string,
    status: 'pending_delivery' | 'completed' | 'cancelled'
  ) => {
    setRedemptions((prev) =>
      prev.map((r) => (r.id === redemptionId ? { ...r, status } : r))
    );
  };

  // Metrics computation for real financial control
  const metrics = (() => {
    let totalLentCapital = 0;
    let recoveredCapital = 0;
    let circulatingCapital = 0;
    let totalInterestGenerated = 0;
    let totalInterestPaid = 0;
    let overdueInstallmentsCount = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    loans.forEach((loan) => {
      totalLentCapital += loan.principalAmount;
      totalInterestGenerated += loan.totalInterest;

      loan.installments.forEach((inst) => {
        if (inst.status === 'paid') {
          recoveredCapital += inst.principalAmount;
          totalInterestPaid += inst.interestAmount;
        } else {
          circulatingCapital += inst.principalAmount;
          const dueDate = new Date(inst.dueDate + 'T00:00:00');
          if (dueDate < today) {
            overdueInstallmentsCount++;
          }
        }
      });
    });

    const totalCreditsIssued = creditTransactions
      .filter((t) => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCreditsRedeemed = creditTransactions
      .filter((t) => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentActiveCredits = customers.reduce((sum, c) => sum + c.creditBalance, 0);

    const activeLoansCount = loans.filter((l) => l.status === 'active').length;
    const completedLoansCount = loans.filter((l) => l.status === 'completed').length;

    return {
      totalLentCapital,
      recoveredCapital,
      circulatingCapital,
      totalInterestGenerated,
      totalInterestPaid,
      totalCreditsIssued,
      totalCreditsRedeemed,
      currentActiveCredits,
      activeLoansCount,
      completedLoansCount,
      totalCustomersCount: customers.length,
      overdueInstallmentsCount,
    };
  })();

  const resetAllData = () => {
    setBrand(initialBrandSettings);
    setCustomers(initialCustomers);
    setLoans(initialLoans);
    setCreditTransactions(initialCreditTransactions);
    setCatalogItems(initialCatalogItems);
    setRedemptions(initialRedemptions);
    setCurrentRole('admin');
    setCurrentCustomerId('cli-1');
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentCustomer,
        loginAsCustomer,
        logoutCustomer,
        brand,
        updateBrand,
        customers,
        addCustomer,
        updateCustomer,
        getCustomerById,
        loans,
        createLoan,
        payInstallment,
        creditTransactions,
        adjustCustomerCredits,
        getCustomerCreditTransactions,
        catalogItems,
        addCatalogItem,
        updateCatalogItem,
        deleteCatalogItem,
        redemptions,
        redeemProduct,
        updateRedemptionStatus,
        metrics,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

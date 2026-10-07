import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminCustomers } from './AdminCustomers';
import { AdminLoans } from './AdminLoans';
import { AdminCredits } from './AdminCredits';
import { AdminCatalog } from './AdminCatalog';
import { AdminBrandSettings } from './AdminBrandSettings';
import { CustomerDetailModal } from './CustomerDetailModal';

interface AdminLayoutProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab = 'dashboard',
  onTabChange,
}) => {
  const { customers, loans, metrics } = useApp();
  const [internalTab, setInternalTab] = useState<string>(currentTab);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const activeTab = onTabChange ? currentTab : internalTab;
  const setTab = onTabChange || setInternalTab;

  return (
    <div className="pb-8 space-y-5">
      {/* Active Tab Screen */}
      <div>
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onNavigateToTab={(tab) => setTab(tab)}
            onOpenCustomer={(id) => setSelectedCustomerId(id)}
          />
        )}
        {activeTab === 'customers' && (
          <AdminCustomers onOpenCustomerDetails={(id) => setSelectedCustomerId(id)} />
        )}
        {activeTab === 'loans' && (
          <AdminLoans onOpenCustomer={(id) => setSelectedCustomerId(id)} />
        )}
        {activeTab === 'credits' && <AdminCredits />}
        {activeTab === 'catalog' && <AdminCatalog />}
        {activeTab === 'brand' && <AdminBrandSettings />}
      </div>

      {/* Customer Detail Modal if triggered from anywhere */}
      {selectedCustomerId && (
        <CustomerDetailModal
          isOpen={Boolean(selectedCustomerId)}
          onClose={() => setSelectedCustomerId(null)}
          customerId={selectedCustomerId}
        />
      )}
    </div>
  );
};

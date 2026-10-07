import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientOverview } from './ClientOverview';
import { ClientLoans } from './ClientLoans';
import { ClientCredits } from './ClientCredits';
import { ClientCatalog } from './ClientCatalog';
import { ClientProfile } from './ClientProfile';

interface ClientPortalProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  currentTab = 'overview',
  onTabChange,
}) => {
  const { currentCustomer } = useApp();
  const [internalTab, setInternalTab] = useState<string>(currentTab);

  const activeTab = onTabChange ? currentTab : internalTab;
  const setTab = onTabChange || setInternalTab;

  if (!currentCustomer) return null;

  return (
    <div className="pb-8">
      {activeTab === 'overview' && (
        <ClientOverview onNavigateTab={(tab) => setTab(tab)} />
      )}
      {activeTab === 'loans' && <ClientLoans />}
      {activeTab === 'credits' && (
        <ClientCredits onGoToCatalog={() => setTab('catalog')} />
      )}
      {activeTab === 'catalog' && <ClientCatalog />}
      {activeTab === 'profile' && <ClientProfile />}
    </div>
  );
};

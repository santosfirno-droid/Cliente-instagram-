import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/common/AppHeader';
import { BottomNav } from './components/common/BottomNav';
import { DrawerMenu } from './components/common/DrawerMenu';
import { AdminLayout } from './components/admin/AdminLayout';
import { ClientPortal } from './components/client/ClientPortal';
import { ClientLogin } from './components/client/ClientLogin';

const AppShell: React.FC = () => {
  const { currentRole, currentCustomer, brand } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [clientTab, setClientTab] = useState('overview');

  const showBottomNav = currentRole === 'admin' || Boolean(currentCustomer);

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Mobile App Header with 3 lines hamburger button */}
      <AppHeader
        onOpenMenu={() => setIsDrawerOpen(true)}
        onOpenCreditsTab={() => setClientTab('credits')}
      />

      {/* Main Content Area with bottom navigation clearance */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 pb-24">
        {currentRole === 'admin' ? (
          <AdminLayout currentTab={adminTab} onTabChange={setAdminTab} />
        ) : currentCustomer ? (
          <ClientPortal currentTab={clientTab} onTabChange={setClientTab} />
        ) : (
          <ClientLogin />
        )}
      </main>

      {/* Persistent Mobile Bottom Navigation Bar */}
      {showBottomNav && (
        <BottomNav
          activeTab={currentRole === 'admin' ? adminTab : clientTab}
          onTabChange={(tab) => {
            if (currentRole === 'admin') {
              setAdminTab(tab);
            } else {
              setClientTab(tab);
            }
          }}
          onOpenMenu={() => setIsDrawerOpen(true)}
        />
      )}

      {/* Side Drawer Menu (Triggered by 3 lines button) */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateAdminTab={(tab) => setAdminTab(tab)}
        onNavigateClientTab={(tab) => setClientTab(tab)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

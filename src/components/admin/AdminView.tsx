import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminDemandForecast } from './AdminDemandForecast';
import { AdminMenuManagement } from './AdminMenuManagement';
import { AdminQueueControl } from './AdminQueueControl';
import { AdminReports } from './AdminReports';
import { AdminSidebar } from './AdminSidebar';
import { AdminWasteLog } from './AdminWasteLog';

export function AdminView() {
  const { state } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderAdminScreen = () => {
    switch (state.activeAdminScreen) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'forecast':
        return <AdminDemandForecast />;
      case 'menu':
        return <AdminMenuManagement />;
      case 'queue':
        return <AdminQueueControl />;
      case 'waste':
        return <AdminWasteLog />;
      case 'reports':
        return <AdminReports />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">
      {/* Mobile Drawer Toggle for Admin Sidebar on small screens */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Admin Menu & Scope
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <div
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } lg:block lg:shrink-0 border-b lg:border-b-0`}
      >
        <AdminSidebar />
      </div>

      {/* Admin Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {renderAdminScreen()}
      </main>
    </div>
  );
}

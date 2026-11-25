import { Header } from './components/common/Header';
import { StudentView } from './components/student/StudentView';
import { AdminView } from './components/admin/AdminView';
import { AppProvider, useApp } from './context/AppContext';

function MainAppShell() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-500 selection:text-white">
      {/* Universal Sticky Header */}
      <Header />

      {/* Main Role Content */}
      <div className="flex-1">
        {state.currentRole === 'student' ? <StudentView /> : <AdminView />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}

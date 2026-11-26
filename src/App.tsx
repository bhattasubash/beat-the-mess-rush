import { Header } from './components/common/Header';
import { StudentView } from './components/student/StudentView';
import { AdminView } from './components/admin/AdminView';
import { AppProvider, useApp } from './context/AppContext';

function MainAppShell() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-blue-700 selection:text-white">
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

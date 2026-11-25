import { useApp } from '../../context/AppContext';
import { StudentBottomNav } from './StudentBottomNav';
import { StudentFeedback } from './StudentFeedback';
import { StudentHistory } from './StudentHistory';
import { StudentHome } from './StudentHome';
import { StudentMenu } from './StudentMenu';
import { StudentSlots } from './StudentSlots';

export function StudentView() {
  const { state } = useApp();

  const renderScreen = () => {
    switch (state.activeStudentScreen) {
      case 'home':
        return <StudentHome />;
      case 'menu':
        return <StudentMenu />;
      case 'slots':
        return <StudentSlots />;
      case 'feedback':
        return <StudentFeedback />;
      case 'history':
        return <StudentHistory />;
      default:
        return <StudentHome />;
    }
  };

  return (
    <div className="min-h-full">
      {state.mobilePreviewMode ? (
        <div className="flex justify-center py-6 px-4">
          <div className="w-full max-w-[420px] rounded-[42px] border-[10px] border-slate-800 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden min-h-[780px] relative flex flex-col">
            {/* Phone Notch/Speaker */}
            <div className="h-5 bg-slate-800 dark:bg-slate-700 flex justify-center items-center">
              <div className="w-20 h-3 bg-black rounded-full" />
            </div>
            {/* App content inside phone */}
            <div className="flex-1 overflow-y-auto p-4 pt-3 pb-24">
              {renderScreen()}
            </div>
            <StudentBottomNav />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
          {renderScreen()}
          <StudentBottomNav />
        </div>
      )}
    </div>
  );
}

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
          <div className="w-full max-w-[420px] rounded-[36px] border-[8px] border-neutral-800 dark:border-neutral-700 bg-[#F7F7F5] dark:bg-neutral-950 shadow-2xl overflow-hidden h-[780px] relative flex flex-col">
            {/* Phone Notch/Speaker */}
            <div className="h-5 bg-neutral-800 dark:bg-neutral-700 flex justify-center items-center shrink-0">
              <div className="w-20 h-2.5 bg-black rounded-full" />
            </div>
            {/* App content inside phone */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderScreen()}
            </div>
            <StudentBottomNav inPhoneFrame />
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-8">
          {renderScreen()}
          <StudentBottomNav />
        </div>
      )}
    </div>
  );
}

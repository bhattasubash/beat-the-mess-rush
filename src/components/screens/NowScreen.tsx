import {
  AlarmClock,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
import { CROWD_META } from '../../data/messData';
import { CrowdLevel, MessHall } from '../../types';

interface NowScreenProps {
  mess: MessHall;
  crowdLevel: CrowdLevel;
  breakTime: string;
  lastUpdatedLabel: string;
  onChangeMess: () => void;
  onSelectCrowd: (level: CrowdLevel) => void;
  onRefresh: () => void;
  onSeeBestTime: () => void;
}

const LEVELS: CrowdLevel[] = ['Calm', 'Busy', 'Packed'];

export function NowScreen({
  mess,
  crowdLevel,
  breakTime,
  lastUpdatedLabel,
  onChangeMess,
  onSelectCrowd,
  onRefresh,
  onSeeBestTime,
}: NowScreenProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 300);
  };

  return (
    <>
      {/* App Header: Mess Name + Change Link */}
      <div className="px-6 py-4 border-b border-[#D1D5DB] bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded border border-[#D1D5DB] bg-[#F3F4F6] flex items-center justify-center shrink-0">
            <MapPin className="w-[18px] h-[18px] text-[#4B5563]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[18px] leading-[22px] font-semibold text-[#111827] truncate">
              {mess.name}
            </h1>
            <p className="text-[13px] leading-[18px] font-medium text-[#6B7280]">
              {mess.subtitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeMess}
          className="min-h-[48px] px-3 py-2 text-[#2563EB] font-semibold text-[16px] hover:underline flex items-center justify-center rounded cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          Change
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-6 flex flex-col justify-between">
        <div>
          {/* Live Crowd Indicator Box */}
          <div className="p-5 border-2 border-[#9CA3AF] rounded-xl bg-white shadow-sm mb-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[13px] font-semibold text-[#4B5563] uppercase tracking-wider">
                Live Crowd Meter
              </span>
              <button
                type="button"
                onClick={handleRefreshClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg text-[13px] font-medium text-[#4B5563] hover:bg-gray-200 transition cursor-pointer whitespace-nowrap"
                title="Refresh crowd status"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    refreshing ? 'rotate-180' : ''
                  }`}
                />
                <span>{lastUpdatedLabel}</span>
              </button>
            </div>

            {/* Crowd Level Written in Words */}
            <div className="text-center my-2">
              <span className="text-[13px] font-medium text-[#6B7280] block mb-1">
                Current status
              </span>
              <div className="text-[28px] leading-[34px] font-bold text-[#111827] uppercase tracking-wide">
                {crowdLevel}
              </div>
            </div>

            {/* 3 Large Blocks: Calm, Busy, Packed */}
            <div
              className="grid grid-cols-3 gap-2.5 mt-5"
              role="group"
              aria-label="Report or view current crowd level"
            >
              {LEVELS.map((level) => {
                const isSelected = crowdLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onSelectCrowd(level)}
                    aria-pressed={isSelected}
                    className={`min-h-[48px] p-3 border-2 rounded-lg flex flex-col items-center justify-center text-center transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                      isSelected
                        ? 'border-[#111827] bg-[#111827] text-white shadow'
                        : 'border-[#D1D5DB] bg-[#F3F4F6] text-[#6B7280] hover:border-[#9CA3AF] hover:text-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span
                        className={`text-[16px] leading-[20px] ${
                          isSelected ? 'font-bold' : 'font-medium'
                        }`}
                      >
                        {level}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] mt-0.5 tabular-nums ${
                        isSelected ? 'text-gray-200' : 'text-[#6B7280]'
                      }`}
                    >
                      {isSelected ? 'Current' : CROWD_META[level].shortRange}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Estimated wait */}
            <div className="mt-5 pt-4 border-t border-[#D1D5DB] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#4B5563]">
                <Timer className="w-5 h-5" />
                <span className="text-[16px] font-medium">Estimated wait:</span>
              </div>
              <span className="text-[18px] font-bold text-[#111827] tabular-nums">
                {CROWD_META[crowdLevel].waitEstimate}
              </span>
            </div>
          </div>

          {/* Timetable context note */}
          <div className="p-4 border border-[#D1D5DB] bg-[#F3F4F6] rounded-lg mb-4 flex items-center gap-3">
            <AlarmClock className="w-5 h-5 text-[#4B5563] shrink-0" />
            <p className="text-[13px] leading-[18px] font-medium text-[#4B5563]">
              Your class break starts at{' '}
              <span className="font-semibold text-[#111827] tabular-nums">
                {breakTime}
              </span>
              . Find a quieter eating window.
            </p>
          </div>
        </div>

        {/* Primary Action: See best time */}
        <div className="pt-4 mb-2">
          <button
            type="button"
            onClick={onSeeBestTime}
            className="w-full min-h-[48px] px-6 py-3.5 bg-[#2563EB] text-white text-[16px] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#1D4ED8] active:scale-[0.99] transition shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <span>See best time</span>
            <Clock className="w-5 h-5" />
          </button>
          <div className="mt-2 text-center">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Next: Calmer times &amp; break match →
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

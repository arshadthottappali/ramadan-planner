import { useState, useEffect } from 'react';
import { useRamadanData } from './hooks/useRamadanData';
import DayNavigator from './components/DayNavigator';
import DayView from './components/DayView';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import PrayerTimes from './components/PrayerTimes';
import StatsView from './components/StatsView';
import StudyView from './components/StudyView';
import Onboarding from './components/Onboarding';
import { Calendar as CalendarIcon, Flame, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);
  const [activeTab, setActiveTab] = useState('home');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    data, updateDay, updateDayField, resetData, addCustom, toggleCustom, deleteCustom, toggleAdkar,
    customResources, addResource, removeResource,
    settings, updateSettings, exportData
  } = useRamadanData();

  // Helper to calculate streak
  const calculateStreak = () => {
    if (!data) return 0;
    let streak = 0;
    for (let i = currentDay - 1; i >= 1; i--) {
      const dayProgress = data[i];
      if (!dayProgress) break;
      const prayersDone = Object.values(dayProgress.prayers).filter(Boolean).length;
      if (prayersDone > 0) streak++;
      else break;
    }
    return streak;
  };

  const streak = calculateStreak();

  // Confetti Trigger
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1A4D2E', '#D4AF37', '#FDFBF7']
    });
  };

  // Safe check if data is loaded
  const dayData = data && data[currentDay] ? data[currentDay] : null;

  // Date Logic
  const RAMADAN_START_DATE = settings.ramadanStartDate || '2026-02-18';

  // Helper to get Local Date from YYYY-MM-DD string
  const getLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const RAMADAN_START = getLocalDate(RAMADAN_START_DATE);

  // Calculate displayed date for current viewed day
  const displayedDate = new Date(RAMADAN_START);
  displayedDate.setDate(RAMADAN_START.getDate() + (currentDay - 1));

  // Auto-jump to "Today" on load or setting change
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Local midnight

    const start = getLocalDate(RAMADAN_START_DATE);
    // start is already local midnight from getLocalDate

    const diffTime = today - start;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Use round instead of ceil for clean midnight diffs

    // If we are within Ramadan (Day 1 to 30), jump to that day
    if (diffDays >= 0 && diffDays < 30) {
      setCurrentDay(diffDays + 1);
    } else if (diffDays < 0) {
      // Before Ramadan starts
      setCurrentDay(1);
    }
  }, [settings.ramadanStartDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleDateChange = (e) => {
    // This is for the "Jump to date" feature, not changing the start date
    const selectedDate = new Date(e.target.value);
    const diffTime = Math.abs(selectedDate - RAMADAN_START);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 30) {
      setCurrentDay(diffDays + 1);
    }
    setShowDatePicker(false);
  };

  // Onboarding Handler
  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  // Show Onboarding if no name is set
  if (!settings.userName) {
    return <Onboarding onComplete={(name, date) => updateSettings({ userName: name, ramadanStartDate: date })} />;
  }

  if (!dayData) return <div className="h-screen flex items-center justify-center text-primary">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center font-sans text-[#1A4D2E]">

      {/* Mobile App Container - Responsive Fit */}
      <div className="w-full md:max-w-md bg-[#FDFBF7] h-[100dvh] shadow-2xl relative flex flex-col md:h-[90vh] md:my-8 md:rounded-[3rem] md:border-8 md:border-slate-800 overflow-hidden">

        {/* Header with Gamification */}
        <header className="px-6 pt-8 pb-2 flex justify-between items-center bg-gradient-to-b from-[#F4F1EA] to-transparent flex-none z-20">
          <div className="relative">
            <h1 className="text-2xl font-serif font-bold text-[#1A4D2E] drop-shadow-sm mb-1">Ramadan Planner</h1>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-[#D4AF37] uppercase tracking-wider font-bold">Ramadan 1447</span>
              <span>•</span>
              {/* Interactive Date Picker */}
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#D4AF37] transition-colors" onClick={() => setShowDatePicker(!showDatePicker)}>
                <span>{formatDate(displayedDate)}</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl p-2 z-50 border border-slate-100 animate-in fade-in zoom-in-95 ring-1 ring-slate-100">
                <input
                  type="date"
                  className="border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                  onChange={handleDateChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {/* Streak Badge */}
            {streak > 0 && (
              <div className="h-10 px-3 bg-orange-100 border border-orange-200 rounded-xl flex items-center justify-center gap-1 shadow-sm animate-in zoom-in">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span className="font-bold text-orange-700">{streak}</span>
              </div>
            )}

            {/* Hidden Redundant Calendar Button (since text is clickable) */}
            {/* Kept wrapper for layout stability if needed, or removed entirely */}
          </div>
        </header>

        {/* Day Navigation */}
        <div className="px-6 mb-6 flex-none z-10">
          <DayNavigator currentDay={currentDay} onDayChange={setCurrentDay} />
        </div>

        <main className="px-6 flex-1 overflow-y-auto scrollbar-hide pb-24">
          {activeTab === 'home' && (
            <DayView
              day={currentDay}
              data={dayData}
              updateDay={updateDay}
              updateDayField={updateDayField}
              addCustom={addCustom}
              toggleCustom={toggleCustom}
              deleteCustom={deleteCustom}
              onGoalComplete={triggerConfetti}
              settings={settings}
              updateSettings={updateSettings}
            />
          )}
          {activeTab === 'study' && (
            <StudyView
              day={currentDay}
              dayData={dayData || {}} // Just in case
              toggleAdkar={toggleAdkar}
              customResources={customResources}
              onAddResource={addResource}
              onRemoveResource={removeResource}
            />
          )}
          {activeTab === 'prayer' && (
            <PrayerTimes />
          )}
          {activeTab === 'profile' && (
            <StatsView
              data={data}
              settings={settings}
              updateSettings={updateSettings}
              onExport={exportData}
              onReset={resetData}
            />
          )}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;

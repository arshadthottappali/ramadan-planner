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
  const RAMADAN_START = new Date('2026-02-18'); // Ramadan 1447 approx start
  const currentDate = new Date(RAMADAN_START);
  currentDate.setDate(RAMADAN_START.getDate() + (currentDay - 1));

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const diffTime = Math.abs(selectedDate - RAMADAN_START);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Simple logic: mapping date to day index. 
    // In real app, would need precise Hijri calculation or user override.
    if (diffDays >= 0 && diffDays < 30) {
      setCurrentDay(diffDays + 1);
    }
    setShowDatePicker(false);
  };

  // Onboarding Handler
  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  // Show Onboarding if no name is set
  if (!settings.userName) {
    return <Onboarding onComplete={(name) => updateSettings({ userName: name })} />;
  }

  if (!dayData) return <div className="h-screen flex items-center justify-center text-primary">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center font-sans text-[#1A4D2E]">

      {/* Mobile App Container - Responsive Fit */}
      <div className="w-full md:max-w-md bg-[#FDFBF7] min-h-screen shadow-2xl relative pb-28 md:my-8 md:min-h-[90vh] md:rounded-[3rem] md:overflow-hidden md:border-8 md:border-slate-800">

        {/* Header with Gamification */}
        <header className="px-6 pt-12 pb-6 flex justify-between items-start bg-gradient-to-b from-[#F4F1EA] to-transparent">
          <div className="relative">
            <div className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase mb-1">Ramadan 1446 AH</div>
            <h1 className="text-3xl font-serif text-[#1A4D2E] drop-shadow-sm">Ramadan Planner</h1>

            {/* Interactive Date Picker */}
            <div className="flex items-center gap-2 mt-1 cursor-pointer group" onClick={() => setShowDatePicker(!showDatePicker)}>
              <div className="text-sm text-slate-400 font-medium group-hover:text-[#D4AF37] transition-colors">
                {formatDate(currentDate)}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#D4AF37]" />
            </div>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl p-2 z-50 border border-slate-100 animate-in fade-in zoom-in-95">
                <input
                  type="date"
                  className="border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  onChange={handleDateChange}
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
            <div
              className="w-10 h-10 bg-white border border-[#EBE7DE] rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
        </header>

        {/* Day Navigation */}
        <div className="px-6 mb-6">
          <DayNavigator currentDay={currentDay} onDayChange={setCurrentDay} />
        </div>

        <main className="px-6 h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide pb-20">
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

import React, { useState } from 'react';
import { PawPrint, CalendarCheck } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/Home';
import { QuizView } from './views/Quiz';
import { ServicesView } from './views/Services';
import { ContactView } from './views/Contact';
import { BreedsView } from './views/Breeds';
import { ServiceDetailView } from './views/ServiceDetail';
import { ScheduleView } from './views/Schedule';
import { AdminView } from './views/Admin';
import { Tab, QuizState } from './types';
import { AppConfigProvider, useAppConfig } from './contexts/AppConfigContext';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { config, themeClasses } = useAppConfig();
  
  const [quizState, setQuizState] = useState<QuizState>({
    step: 1,
    name: '',
    age: '',
    problem: '',
    breed: '',
    size: ''
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedServiceId(null); // Reset detail view when changing tabs
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  };

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  };

  const handleGlobalSchedule = () => {
    setActiveTab('schedule');
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  };

  const renderContent = () => {
    // Look up service in the Context Config
    const selectedService = config.services.find(s => s.id === selectedServiceId);

    // If a service is selected, show detail view (overlays everything else within the tab)
    if (selectedServiceId && selectedService) {
      return (
        <ServiceDetailView 
          service={selectedService} 
          onBack={() => setSelectedServiceId(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={handleTabChange} onServiceSelect={handleServiceSelect} />;
      case 'diagnosis':
        return <QuizView quizState={quizState} setQuizState={setQuizState} />;
      case 'breeds':
        return <BreedsView />;
      case 'services':
        return <ServicesView onServiceSelect={handleServiceSelect} />;
      case 'contact':
        return <ContactView />;
      case 'schedule':
        return <ScheduleView onBack={() => handleTabChange('home')} />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView onNavigate={handleTabChange} onServiceSelect={handleServiceSelect} />;
    }
  };

  return (
    // Outer container
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-slate-900 sm:p-8">
      
      <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[850px] bg-slate-50 sm:rounded-[2.5rem] sm:border-8 border-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Header (Sticky) */}
        <header className="bg-white/95 backdrop-blur-sm px-4 py-3 shadow-sm z-40 flex justify-between items-center sticky top-0 shrink-0 sm:rounded-t-[2rem]">
          <div className="flex items-center gap-2">
            <PawPrint className={themeClasses.primaryText} size={28} />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 font-brand leading-none">{config.professionalName}</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">{config.appName}</span>
            </div>
          </div>
          <button 
            onClick={() => handleTabChange('schedule')}
            className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-slate-200 transition active:scale-95 border border-slate-200"
          >
            <CalendarCheck size={20} className="text-slate-700"/>
          </button>
        </header>

        {/* Main Content */}
        <main 
          id="main-content" 
          className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50 no-scrollbar"
        >
          {renderContent()}
        </main>

        {/* GLOBAL FLOATING ACTION BUTTON (Agendar) */}
        {activeTab !== 'schedule' && activeTab !== 'admin' && (
          <div className="absolute bottom-24 right-4 z-50 pointer-events-none">
             <button 
               onClick={handleGlobalSchedule}
               className={`pointer-events-auto ${themeClasses.primary} text-white p-4 rounded-full shadow-xl ${themeClasses.shadow} active:scale-90 transition-all duration-300 flex items-center justify-center animate-bounce-slow border-4 border-white`}
               aria-label="Agendar Visita"
             >
                <CalendarCheck size={28} fill="currentColor" />
             </button>
          </div>
        )}

        {/* Bottom Nav */}
        {!selectedServiceId && activeTab !== 'schedule' && (
           <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}
        
      </div>
    </div>
  );
};

function App() {
  return (
    <AppConfigProvider>
      <AppContent />
    </AppConfigProvider>
  );
}

export default App;
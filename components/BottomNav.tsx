import React from 'react';
import { Home, PawPrint, Grid, User, BookOpen, Settings } from 'lucide-react';
import { Tab } from '../types';
import { useAppConfig } from '../contexts/AppConfigContext';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { config } = useAppConfig();
  
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Início', icon: <Home size={24} /> },
    { id: 'diagnosis', label: 'Avaliar', icon: <PawPrint size={24} /> },
    { id: 'breeds', label: 'Guia', icon: <BookOpen size={24} /> },
    { id: 'services', label: 'Serviços', icon: <Grid size={24} /> },
    { id: 'contact', label: 'Perfil', icon: <User size={24} /> },
    { id: 'admin', label: 'Admin', icon: <Settings size={24} /> },
  ];

  return (
    <nav className="bg-white border-t border-slate-100 h-[72px] flex justify-around items-center shrink-0 z-50 px-2 pb-2 sm:rounded-b-[2rem]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors active:scale-95 ${
            activeTab === item.id ? `text-${config.themeColor}-500` : 'text-slate-400'
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
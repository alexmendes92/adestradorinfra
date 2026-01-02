import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Battery, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full h-8 bg-white flex justify-between items-center px-6 text-[10px] font-bold text-slate-800 z-50 shrink-0 select-none sm:rounded-t-[2rem]">
      <span>{time}</span>
      <div className="flex gap-1.5 items-center">
        <Signal size={14} fill="currentColor" />
        {isOnline ? (
          <Wifi size={14} className="text-slate-800" />
        ) : (
          <WifiOff size={14} className="text-red-500 animate-pulse" />
        )}
        <Battery size={14} fill="currentColor" />
      </div>
    </div>
  );
};
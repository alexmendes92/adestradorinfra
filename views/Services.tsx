import React from 'react';
import { ArrowRight, Check, Star, Video, Home, Shield, Zap, Sparkles, CalendarCheck, PawPrint } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ServicesProps {
  onServiceSelect: (id: string) => void;
}

export const ServicesView: React.FC<ServicesProps> = ({ onServiceSelect }) => {
  const { config } = useAppConfig();
  const services = config.services;

  // Helper to get an icon based on tag or simple logic
  const getIcon = (tag: string) => {
    if (tag.includes('FILHOTES')) return <Sparkles size={18} />;
    if (tag.includes('POPULAR')) return <Zap size={18} />;
    if (tag.includes('REABILITAÇÃO')) return <Shield size={18} />;
    if (tag.includes('ONLINE')) return <Video size={18} />;
    return <PawPrint size={18} />;
  };

  return (
    <div className="bg-slate-50 min-h-full pb-24 animate-fade-in">
      
      {/* Header Moderno */}
      <div className="bg-slate-900 pt-8 pb-12 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-xl mb-6">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Home size={120} className="text-white transform rotate-12 translate-x-8 -translate-y-4" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
               <CalendarCheck size={10} /> Agenda Aberta
             </span>
             <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
             </div>
          </div>
          <h2 className="text-3xl font-bold text-white font-brand mb-2">Agende seu Treino</h2>
          <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-[80%]">
            Escolha o pacote ideal e garanta seu horário na agenda.
          </p>
        </div>
      </div>

      {/* Lista de Serviços */}
      <div className="px-5 space-y-5 -mt-8 relative z-20">
        {services.map((service, idx) => (
          <div 
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className={`bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-300 group relative border ${service.popular ? `border-${config.themeColor}-500 ring-4 ring-${config.themeColor}-500/10` : 'border-slate-100'}`}
          >
            {/* Tag Badge */}
            <div className={`absolute top-4 right-4 ${service.popular ? `bg-${config.themeColor}-500` : (service.tagColor === 'purple' ? 'bg-purple-600' : service.tagColor === 'green' ? 'bg-green-600' : 'bg-slate-800')} text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm z-10 uppercase tracking-wide`}>
              {service.tag}
            </div>

            {/* Image Area */}
            <div className="h-36 relative overflow-hidden">
               <img 
                 src={service.image} 
                 alt={service.title} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-3 left-4 text-white flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                    {getIcon(service.tag)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none">{service.title}</h3>
                    <p className="text-[10px] text-slate-200 font-medium">{service.duration}</p>
                  </div>
               </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
                {service.description}
              </p>
              
              {/* Features Checklist */}
              {service.benefits && service.benefits.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                   <ul className="space-y-2">
                      {service.benefits.slice(0, 3).map((benefit, i) => (
                         <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <div className="bg-green-100 text-green-600 rounded-full p-0.5">
                               <Check size={10} strokeWidth={4} />
                            </div>
                            {benefit}
                         </li>
                      ))}
                   </ul>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                  {service.price && (
                      <div className="bg-green-50 text-green-700 font-bold px-3 py-2 rounded-xl text-xs border border-green-100 shadow-sm shrink-0">
                          {service.price}
                      </div>
                  )}
                  <button className={`flex-1 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${service.popular ? `bg-${config.themeColor}-500 text-white hover:bg-${config.themeColor}-600 shadow-md shadow-${config.themeColor}-200` : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                    Quero agendar este
                    <ArrowRight size={14} />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-6 mt-8 mb-4">
         <div className={`bg-${config.themeColor}-50 border border-${config.themeColor}-100 rounded-2xl p-4 text-center`}>
            <p className={`text-xs text-${config.themeColor}-800 font-bold mb-2`}>Não sabe qual escolher?</p>
            <button 
               onClick={() => {
                 const nav = document.querySelector('nav button:nth-child(2)') as HTMLButtonElement; 
                 if(nav) nav.click();
               }}
               className={`text-${config.themeColor}-600 text-sm font-bold underline decoration-2 underline-offset-2 hover:text-${config.themeColor}-700`}
            >
               Fazer Diagnóstico Gratuito
            </button>
         </div>
      </div>

    </div>
  );
};
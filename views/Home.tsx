import React from 'react';
import { ArrowRight, Star, Verified, Smile, FlaskConical, ChevronRight, Calendar, MessageCircle, Clock } from 'lucide-react';
import { Tab } from '../types';
import { useAppConfig } from '../contexts/AppConfigContext';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
  onServiceSelect: (id: string) => void;
}

export const HomeView: React.FC<HomeProps> = ({ onNavigate, onServiceSelect }) => {
  const { config, themeClasses } = useAppConfig();

  // Show all services on Home
  const featuredServices = config.services;

  return (
    <div className="animate-fade-in pb-6">
      
      {/* Hero de Alta Conversão */}
      <div className="relative w-full h-96 rounded-b-[2.5rem] overflow-hidden shadow-lg mb-6 group">
        <img
          alt="Capa Principal"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={config.heroImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-end p-6">
          
          {/* Badge de Urgência */}
          <div className="inline-flex items-center gap-1.5 bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full w-fit mb-3 animate-pulse-slow shadow-lg shadow-green-900/20 border border-green-400">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            AGENDA ABERTA
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight mb-2 font-brand">
            {config.slogan} <span className={`${themeClasses.primaryText} underline decoration-${config.themeColor}-400/30`}>hoje</span>.
          </h1>
          <p className="text-slate-200 text-sm mb-5 font-medium leading-relaxed">
            Agende sua visita com {config.professionalName} e transforme a convivência em casa.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('schedule')}
              className={`flex-1 ${themeClasses.primary} text-white font-bold py-3.5 px-4 rounded-xl ${themeClasses.shadow} active:scale-95 transition flex items-center justify-center gap-2`}
            >
              <Calendar size={18} />
              Agendar Visita
            </button>
            <button
              onClick={() => onNavigate('diagnosis')}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3.5 px-4 rounded-xl active:scale-95 transition flex items-center justify-center gap-2 hover:bg-white/20"
            >
              Avaliar Grátis
            </button>
          </div>
        </div>
      </div>

      {/* Faixa de Escassez/Status */}
      <div className="px-6 mb-8 -mt-2">
         <div className="bg-slate-800 text-white p-3 rounded-xl flex items-center justify-between shadow-lg border border-slate-700">
            <div className="flex items-center gap-2">
               <div className="bg-green-500/20 p-1.5 rounded-lg">
                  <Clock size={16} className="text-green-400"/>
               </div>
               <div>
                  <span className="block text-xs font-bold text-slate-200">Próxima Vaga:</span>
                  <span className="block text-[10px] text-slate-400">Terça-feira, 14:00</span>
               </div>
            </div>
            <button onClick={() => onNavigate('schedule')} className={`text-xs font-bold ${themeClasses.primaryText} hover:text-white underline`}>
               Reservar
            </button>
         </div>
      </div>

      {/* Social Proof Compacto */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                alt="Cliente"
                className="w-8 h-8 rounded-full border-2 border-slate-50 object-cover"
                src={`https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img${i}.png`}
              />
            ))}
          </div>
          <div className="text-left">
            <div className="flex text-yellow-400 text-xs gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
            </div>
            <p className="text-[10px] text-slate-400 font-bold">+500 Famílias Atendidas</p>
          </div>
        </div>
      </div>

      {/* Services List (Focado em Venda) */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 font-brand">Escolha seu Plano</h2>
          <button
            onClick={() => onNavigate('services')}
            className={`${themeClasses.primaryText} text-xs font-bold hover:text-slate-600 uppercase tracking-wide`}
          >
            Ver tudo
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          {featuredServices.map((service) => {
            // Logic to style popular items differently using Theme Color
            const isPopular = service.popular; 
            const borderColor = isPopular ? `border-${config.themeColor}-100` : 'border-slate-100';
            const bgClass = isPopular ? `bg-${config.themeColor}-50` : 'bg-white';
            const hoverBorder = isPopular ? `hover:border-${config.themeColor}-200` : `hover:border-${config.themeColor}-200`;
            
            return (
              <div
                key={service.id}
                onClick={() => onServiceSelect(service.id)}
                className={`${bgClass} p-4 rounded-2xl border ${borderColor} shadow-sm flex items-center gap-4 active:scale-95 transition cursor-pointer group ${hoverBorder} relative overflow-hidden`}
              >
                <div className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 z-10 ${isPopular ? 'bg-white' : 'bg-slate-100'}`}>
                   <img
                    alt={service.title}
                    className="w-full h-full object-cover"
                    src={service.image}
                  />
                </div>
                <div className="flex-1 min-w-0 z-10">
                   <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm truncate pr-2">{service.title}</h3>
                      {isPopular && <span className={`text-[8px] font-bold bg-${config.themeColor}-500 text-white px-1.5 py-0.5 rounded`}>POPULAR</span>}
                   </div>
                   <p className="text-xs text-slate-500 mb-2 truncate">{service.description}</p>
                   <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isPopular ? `text-${config.themeColor}-700 bg-white/50 border border-${config.themeColor}-200` : 'text-blue-600 bg-blue-50'}`}>
                          {isPopular ? 'Consultar Agenda' : 'Saiba Mais'}
                       </span>
                       {service.price && (
                           <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                               {service.price}
                           </span>
                       )}
                   </div>
                </div>
                {!isPopular && (
                  <div className="text-slate-300">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
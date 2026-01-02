import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, Ruler, HeartPulse, Zap, Brain, Shield, Home, Stethoscope, BookOpen, Sparkles, Activity, Clock, AlertTriangle, Filter, X, Globe, MapPin, Weight, Hourglass, Wind, ArrowUpDown } from 'lucide-react';
import { BreedData } from '../types';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

type FilterType = 'all' | 'apartment' | 'beginner' | 'guard' | 'family';

export const BreedsView: React.FC = () => {
  const { config } = useAppConfig();
  const [selectedBreed, setSelectedBreed] = useState<BreedData | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'apartment', label: 'Apartamento', icon: <Home size={12} /> },
    { id: 'beginner', label: 'Iniciantes', icon: <Sparkles size={12} /> },
    { id: 'guard', label: 'Guarda', icon: <Shield size={12} /> },
    { id: 'family', label: 'Família', icon: <HeartPulse size={12} /> },
  ];

  const filteredBreeds = useMemo(() => {
    return BREEDS_DB.filter(b => {
      // Text Search
      const matchesSearch = b.identificacao.nome.toLowerCase().includes(search.toLowerCase());
      
      // Category Filter
      let matchesFilter = true;
      switch (activeFilter) {
        case 'apartment':
          matchesFilter = b.convivencia.apartamento === 'Sim';
          break;
        case 'beginner':
          matchesFilter = b.convivencia.nivelExperiencia === 'Iniciante';
          break;
        case 'guard':
          matchesFilter = b.estatisticas.guarda >= 4;
          break;
        case 'family':
          matchesFilter = b.estatisticas.afeto >= 4 && b.estatisticas.energia < 5;
          break;
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  if (selectedBreed) {
    return (
      <div className="bg-slate-50 min-h-full pb-20 animate-slide-in">
        {/* Header Imersivo */}
        <div className="relative h-96 w-full rounded-b-[3rem] overflow-hidden shadow-2xl group">
          <img 
            src={selectedBreed.imagens.img1 || 'https://placehold.co/600x600?text=No+Image'} 
            alt={selectedBreed.identificacao.nome} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          
          <button 
            onClick={() => setSelectedBreed(null)}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition active:scale-95 z-10 border border-white/10"
          >
            <ChevronLeft size={26} />
          </button>

          <div className="absolute bottom-10 left-6 right-6 text-left">
             {/* Origem (Reposicionado acima do título) */}
             <div className="flex items-center gap-2 mb-2 text-white/90 font-bold text-[10px] uppercase tracking-widest backdrop-blur-md bg-black/30 w-fit px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                <Globe size={12} className={`text-${config.themeColor}-400`} />
                {selectedBreed.identificacao.origem}
             </div>
            
            <h1 className="text-5xl font-bold text-white font-brand mb-2 leading-tight drop-shadow-lg tracking-tight">
              {selectedBreed.identificacao.nome}
            </h1>
            <p className={`text-slate-200 text-sm italic opacity-90 border-l-4 border-${config.themeColor}-500 pl-4 py-1`}>
              "{selectedBreed.identificacao.slogan}"
            </p>
          </div>
        </div>

        <div className="px-6 -mt-8 relative z-10 space-y-8">
          
          {/* Galeria de Imagens */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {[selectedBreed.imagens.img1, selectedBreed.imagens.img2, selectedBreed.imagens.categoria]
              .filter(img => img && img.length > 5)
              .map((img, idx) => (
              <div key={idx} className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-200 first:ml-0 snap-start">
                  <img src={img} alt={`Galeria ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* 1. VOCÊ SABIA? */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-xl shadow-indigo-200 text-white relative overflow-hidden group border border-indigo-500/50">
            <div className="absolute -top-6 -right-6 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-45">
               <Sparkles size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shrink-0 border border-white/20 shadow-inner">
                  <Sparkles size={20} className="text-yellow-300 fill-yellow-300" />
                </div>
                <h3 className="font-bold text-indigo-100 text-sm uppercase tracking-widest">Curiosidade</h3>
              </div>
              <p className="text-base font-medium leading-relaxed text-white drop-shadow-sm">
                {selectedBreed.identificacao.fatoCurioso}
              </p>
            </div>
          </div>

          {/* 2. CARACTERÍSTICAS FÍSICAS (COM ÍCONES ESPECÍFICOS) */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider pl-1">
              <Ruler size={16} className={`text-${config.themeColor}-500`} />
              Características Físicas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Altura */}
              <div className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 hover:border-${config.themeColor}-100 transition-colors relative overflow-hidden group`}>
                <div className={`absolute right-2 top-2 bg-slate-50 p-1.5 rounded-lg text-slate-300 group-hover:text-${config.themeColor}-400 group-hover:bg-${config.themeColor}-50 transition-colors`}>
                   <ArrowUpDown size={16} />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Altura</span>
                <span className="font-bold text-slate-800 text-lg">{selectedBreed.fisico.altura}</span>
              </div>

              {/* Peso */}
              <div className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 hover:border-${config.themeColor}-100 transition-colors relative overflow-hidden group`}>
                <div className={`absolute right-2 top-2 bg-slate-50 p-1.5 rounded-lg text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-50 transition-colors`}>
                   <Weight size={16} />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Peso</span>
                <span className="font-bold text-slate-800 text-lg">{selectedBreed.fisico.peso}</span>
              </div>

              {/* Vida */}
              <div className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 hover:border-${config.themeColor}-100 transition-colors relative overflow-hidden group`}>
                <div className={`absolute right-2 top-2 bg-slate-50 p-1.5 rounded-lg text-slate-300 group-hover:text-red-400 group-hover:bg-red-50 transition-colors`}>
                   <HeartPulse size={16} />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Vida</span>
                <span className="font-bold text-slate-800 text-lg">{selectedBreed.fisico.expectativaVida}</span>
              </div>

              {/* Queda de Pelo */}
              <div className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 hover:border-${config.themeColor}-100 transition-colors relative overflow-hidden group`}>
                <div className={`absolute right-2 top-2 bg-slate-50 p-1.5 rounded-lg text-slate-300 group-hover:text-indigo-400 group-hover:bg-indigo-50 transition-colors`}>
                   <Wind size={16} />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Queda de Pelo</span>
                <div className="flex gap-1 mt-auto">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-1.5 w-full rounded-full ${i < selectedBreed.fisico.quedaPelo ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. NÍVEIS DE ENERGIA */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider pl-1">
              <Activity size={16} className={`text-${config.themeColor}-500`} />
              Temperamento
            </h3>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              {[
                { label: 'Energia', val: selectedBreed.estatisticas.energia, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', bar: 'bg-yellow-500' },
                { label: 'Inteligência', val: selectedBreed.estatisticas.inteligencia, icon: Brain, color: 'text-blue-500', bg: 'bg-blue-50', bar: 'bg-blue-500' },
                { label: 'Afeto', val: selectedBreed.estatisticas.afeto, icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50', bar: 'bg-red-500' },
                { label: 'Guarda', val: selectedBreed.estatisticas.guarda, icon: Shield, color: 'text-slate-600', bg: 'bg-slate-100', bar: 'bg-slate-600' },
                { label: 'Treinabilidade', val: selectedBreed.estatisticas.treinabilidade, icon: BookOpen, color: 'text-green-500', bg: 'bg-green-50', bar: 'bg-green-500' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm shrink-0`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{stat.label}</span>
                      <span className="text-xs font-bold text-slate-400">{stat.val}/5</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${stat.bar}`} 
                        style={{ width: `${(stat.val / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. CONVIVÊNCIA */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold uppercase text-sm tracking-wider">
              <Home size={16} className={`text-${config.themeColor}-500`} />
              Convivência
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Vive em Apartamento?</span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${selectedBreed.convivencia.apartamento === 'Sim' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedBreed.convivencia.apartamento}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 font-medium">Nível de Experiência</span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">{selectedBreed.convivencia.nivelExperiencia}</span>
              </div>
              <div className="pt-2 bg-slate-50 p-4 rounded-xl mt-2">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Sociabilidade</span>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{selectedBreed.convivencia.sociabilidade}</p>
              </div>
            </div>
          </div>

          {/* 5. DESAFIOS & COMPORTAMENTO (ALERTA) */}
          <div className={`bg-${config.themeColor}-50 border border-${config.themeColor}-100 p-6 rounded-3xl shadow-sm relative overflow-hidden`}>
             <div className="absolute right-0 top-0 opacity-5 -mr-4 -mt-4">
                <AlertTriangle size={100} className={`text-${config.themeColor}-900`}/>
             </div>
             <div className={`flex items-center gap-2 mb-3 text-${config.themeColor}-700 font-bold text-sm uppercase tracking-wider relative z-10`}>
                <AlertTriangle size={18} />
                Desafios & Comportamento
             </div>
             <p className={`text-sm text-${config.themeColor}-900/80 leading-relaxed font-medium relative z-10`}>
                {selectedBreed.convivencia.problemasComportamento}
             </p>
          </div>

          {/* 6. SAÚDE & CUIDADOS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold uppercase text-sm tracking-wider">
              <Stethoscope size={16} className={`text-${config.themeColor}-500`} />
              Saúde & Cuidados
            </div>
            <div className="space-y-4">
                <div className="flex flex-col gap-1 py-2 border-b border-slate-50">
                <span className="text-xs text-slate-400 font-bold uppercase">Ração Diária (Estimativa)</span>
                <span className="text-sm font-bold text-slate-800">{selectedBreed.saude.consumoDiario}</span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Atenção Especial</span>
                <div className="flex gap-3 items-start">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedBreed.saude.problemasSaude}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 7. LINHA DO TEMPO (HISTÓRIA) */}
          {selectedBreed.historia?.cronologia && selectedBreed.historia.cronologia.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider pl-1">
                <Clock size={16} className={`text-${config.themeColor}-500`} />
                Linha do Tempo
              </h3>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-100"></div>
                <div className="space-y-8 relative z-10">
                  {selectedBreed.historia.cronologia.map((item, idx) => (
                    <div key={idx} className="flex gap-4 relative group">
                      <div className={`w-3.5 h-3.5 rounded-full bg-white border-4 border-${config.themeColor}-500 shadow-sm shrink-0 mt-1 group-hover:scale-125 transition-transform z-10`}></div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in bg-slate-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 font-brand">Guia de Raças</h2>
        <p className="text-slate-500 text-xs mt-1">Explore, filtre e descubra seu cão ideal.</p>
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-4 mb-6 sticky top-0 bg-slate-50 z-20 pt-2 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar raça (ex: Pug, Pastor...)"
            className={`w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:border-${config.themeColor}-500 focus:outline-none transition-colors`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilter === filter.id
                  ? `bg-${config.themeColor}-500 border-${config.themeColor}-500 text-white shadow-md transform scale-105`
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-4 pb-20 overflow-y-auto no-scrollbar content-start">
        {filteredBreeds.map((breed) => (
          <button
            key={breed.identificacao.id}
            onClick={() => setSelectedBreed(breed)}
            className={`bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center active:scale-95 transition group h-full hover:border-${config.themeColor}-200`}
          >
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 relative bg-slate-100 shadow-inner">
                <img 
                  src={breed.imagens.img1 || 'https://placehold.co/400x400?text=Dog'} 
                  alt={breed.identificacao.nome} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                />
            </div>
            
            <div className="w-full text-left px-1">
              <h3 className={`font-bold text-slate-800 text-sm mb-0.5 line-clamp-1 group-hover:text-${config.themeColor}-600 transition-colors`}>
                {breed.identificacao.nome}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1">
                   <MapPin size={10} />
                   {breed.identificacao.origem}
                </span>
                <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{breed.identificacao.bandeira}</span>
              </div>
            </div>
          </button>
        ))}
        
        {filteredBreeds.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 text-slate-400 opacity-60">
                <Filter size={48} className="mb-4" />
                <p className="text-sm font-medium">Nenhuma raça encontrada.</p>
                <button 
                  onClick={() => {setSearch(''); setActiveFilter('all');}} 
                  className={`mt-4 text-${config.themeColor}-500 text-xs font-bold hover:underline`}
                >
                  Limpar filtros
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
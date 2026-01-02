import React, { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Dog, Ruler, Search, AlertCircle } from 'lucide-react';
import { DogSize, ServiceDetailData } from '../types';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ServiceDetailProps {
  service: ServiceDetailData;
  onBack: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
  const { config } = useAppConfig();
  const [dogName, setDogName] = useState('');
  const [dogSize, setDogSize] = useState<DogSize>('');
  const [breed, setBreed] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Estados de Validação
  const [errors, setErrors] = useState({ name: false, size: false, breed: false });
  
  // Referência para scroll automático
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Filter breeds for autocomplete from BREEDS_DB
  const filteredBreeds = BREEDS_DB.filter(b => 
    b.identificacao.nome.toLowerCase().includes(breed.toLowerCase())
  );

  const handleBreedSelect = (selectedBreedName: string) => {
    setBreed(selectedBreedName);
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, breed: false }));
  };

  const handleWhatsAppClick = () => {
    // Reset errors
    setErrors({ name: false, size: false, breed: false });

    let hasError = false;
    const newErrors = { name: false, size: false, breed: false };

    if (!dogName.trim()) {
        newErrors.name = true;
        hasError = true;
        // Scroll para o input de nome se estiver vazio
        if (nameInputRef.current) {
            nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nameInputRef.current.focus();
        }
    }
    
    if (!dogSize) {
        newErrors.size = true;
        if (!hasError) hasError = true; // Mantém flag se já não tiver erro anterior
    }

    if (!breed.trim()) {
        newErrors.breed = true;
        if (!hasError) hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const sizeMap = { small: 'Pequeno', medium: 'Médio', large: 'Grande' };
    const text = `Olá ${config.professionalName.split(' ')[0]}! Gostaria de saber mais sobre o serviço *${service.title}*.\n\n🐶 *Meu Cão*\nNome: ${dogName}\nRaça: ${breed}\nPorte: ${sizeMap[dogSize] || 'Não informado'}`;
    
    window.open(`https://wa.me/${config.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="animate-slide-in bg-slate-50 min-h-full pb-20 relative z-50">
      {/* Header Image */}
      <div className="relative h-64 w-full">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 bg-${service.tagColor || config.themeColor}-500 text-white`}>
            {service.tag}
          </span>
          <h1 className="text-3xl font-bold text-white font-brand leading-tight">{service.title}</h1>
        </div>
      </div>

      <div className="p-6 -mt-6 bg-slate-50 rounded-t-[2rem] relative">
        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Sobre o Serviço</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {service.fullDescription}
          </p>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm mb-3">O que está incluso:</h3>
            <ul className="space-y-2">
              {service.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Form */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 font-brand">Perfil do Aluno</h2>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            
            {/* Name Input */}
            <div>
              <label className={`block text-xs font-bold uppercase mb-1 ${errors.name ? 'text-red-500' : 'text-slate-400'}`}>
                  Nome do Cão {errors.name && '*'}
              </label>
              <div className="relative">
                <Dog size={16} className={`absolute left-3 top-3.5 ${errors.name ? 'text-red-400' : 'text-slate-400'}`} />
                <input 
                  ref={nameInputRef}
                  type="text"
                  value={dogName}
                  onChange={(e) => {
                      setDogName(e.target.value);
                      if (e.target.value) setErrors(prev => ({...prev, name: false}));
                  }}
                  className={`w-full pl-9 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none transition-colors ${errors.name ? 'border-red-500 bg-red-50 focus:border-red-500' : `border-slate-200 focus:border-${config.themeColor}-500`}`}
                  placeholder="Ex: Thor"
                />
              </div>
              {errors.name && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 flex items-center gap-1 animate-pulse">
                      <AlertCircle size={10} /> Por favor, insira o nome do cão.
                  </p>
              )}
            </div>

            {/* Size Selector */}
            <div>
              <label className={`block text-xs font-bold uppercase mb-2 ${errors.size ? 'text-red-500' : 'text-slate-400'}`}>
                  Porte (Tamanho) {errors.size && '*'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Pequeno', w: 'text-xs' },
                  { id: 'medium', label: 'Médio', w: 'text-sm' },
                  { id: 'large', label: 'Grande' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                        setDogSize(s.id as DogSize);
                        setErrors(prev => ({...prev, size: false}));
                    }}
                    className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                      dogSize === s.id 
                        ? `border-${config.themeColor}-500 bg-${config.themeColor}-50 text-${config.themeColor}-600` 
                        : (errors.size ? 'border-red-200 bg-red-50 text-red-400' : 'border-slate-100 text-slate-400 hover:border-slate-300')
                    }`}
                  >
                    <Dog size={20} className={s.id === 'large' ? 'scale-125' : s.id === 'small' ? 'scale-75' : ''} />
                    <span className="text-[10px] font-bold uppercase">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Breed Autocomplete */}
            <div className="relative">
              <label className={`block text-xs font-bold uppercase mb-1 ${errors.breed ? 'text-red-500' : 'text-slate-400'}`}>
                  Raça {errors.breed && '*'}
              </label>
              <div className="relative">
                <Search size={16} className={`absolute left-3 top-3.5 ${errors.breed ? 'text-red-400' : 'text-slate-400'}`} />
                <input 
                  type="text"
                  value={breed}
                  onChange={(e) => { 
                      setBreed(e.target.value); 
                      setShowSuggestions(true); 
                      if(e.target.value) setErrors(prev => ({...prev, breed: false}));
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className={`w-full pl-9 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-700 focus:outline-none transition-colors ${errors.breed ? 'border-red-500 bg-red-50 focus:border-red-500' : `border-slate-200 focus:border-${config.themeColor}-500`}`}
                  placeholder="Digite para buscar..."
                />
              </div>
              
              {showSuggestions && breed.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg max-h-40 overflow-y-auto custom-scroll">
                  {filteredBreeds.length > 0 ? (
                    filteredBreeds.map((b) => (
                      <button
                        key={b.identificacao.id}
                        onClick={() => handleBreedSelect(b.identificacao.nome)}
                        className={`w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-${config.themeColor}-50 hover:text-${config.themeColor}-600 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3`}
                      >
                         <img src={b.imagens.img1} alt={b.identificacao.nome} className="w-8 h-8 rounded-full object-cover bg-slate-100 border border-slate-200" />
                        <span className="font-bold">{b.identificacao.nome}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-slate-400 italic">Nenhuma raça encontrada.</div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Floating CTA Placeholder height to prevent overlap */}
        <div className="h-20"></div>
      </div>

      {/* Floating CTA */}
      <div className="fixed sm:absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 z-50 sm:rounded-b-[2.5rem]">
        {service.price && (
            <div className="text-center mb-2">
                <span className="text-sm font-bold text-green-600 bg-green-50 px-4 py-1 rounded-full border border-green-100">
                    Investimento: {service.price}
                </span>
            </div>
        )}
        <button 
          onClick={handleWhatsAppClick}
          className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Consultar Disponibilidade
        </button>
      </div>
    </div>
  );
};
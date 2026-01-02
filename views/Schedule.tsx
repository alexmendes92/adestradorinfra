import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, User, Dog, CheckCircle2, Search, Loader2, ChevronRight, ChevronLeft, Sparkles, Home, PawPrint } from 'lucide-react';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ScheduleProps {
  onBack: () => void;
}

export const ScheduleView: React.FC<ScheduleProps> = ({ onBack }) => {
  const { config } = useAppConfig();
  const [step, setStep] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    dogName: '',
    breed: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    date: '',
    time: ''
  });

  // Filtro de raças para autocomplete
  const filteredBreeds = useMemo(() => {
    if (!formData.breed) return [];
    return BREEDS_DB.filter(b => 
      b.identificacao.nome.toLowerCase().includes(formData.breed.toLowerCase())
    ).slice(0, 5);
  }, [formData.breed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Máscara simples para CEP
    if (name === 'cep') {
      const cleanVal = value.replace(/\D/g, '').slice(0, 8);
      setFormData(prev => ({ ...prev, [name]: cleanVal }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectBreed = (breedName: string) => {
    setFormData(prev => ({ ...prev, breed: breedName }));
    setShowBreedSuggestions(false);
  };

  // Efeito para buscar CEP automaticamente
  useEffect(() => {
    if (formData.cep.length === 8) {
      fetchAddress(formData.cep);
    }
  }, [formData.cep]);

  const fetchAddress = async (cep: string) => {
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
        document.getElementById('number-input')?.focus();
      } else {
        alert("CEP não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.dogName) {
        alert("Por favor, preencha seus dados e do seu cão! 🐶");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.street || !formData.number) {
        alert("Precisamos do endereço da visita! 🏡");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step === 1) onBack();
    else setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) {
        alert("Escolha uma data para a visita! 📅");
        return;
    }

    const message = `Olá ${config.professionalName.split(' ')[0]}! 📅 Gostaria de agendar uma visita.\n\n👤 *Tutor:* ${formData.name}\n🐕 *Cão:* ${formData.dogName} (${formData.breed || 'SRD'})\n📱 *Tel:* ${formData.phone}\n\n📍 *Local:* ${formData.street}, ${formData.number}\n${formData.neighborhood} - ${formData.city}\n\n🗓 *Data:* ${formData.date}\n⏰ *Hora:* ${formData.time || 'A combinar'}`;

    window.open(`https://wa.me/${config.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-full animate-slide-in pb-20 relative z-50 flex flex-col">
      
      {/* Header Compacto */}
      <div className="bg-slate-900 pt-6 pb-8 px-6 rounded-b-[2rem] shadow-xl relative shrink-0">
        <div className="flex items-center justify-between relative z-10">
          <button 
            onClick={prevStep}
            className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
             <h2 className="text-xl font-bold text-white font-brand">Agendar Visita</h2>
             <p className="text-slate-400 text-[10px] uppercase tracking-widest">Etapa {step} de 3</p>
          </div>
          <div className="w-9"></div> {/* Spacer for balance */}
        </div>

        {/* Stepper Visual */}
        <div className="flex gap-2 mt-6 justify-center">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? `w-8 bg-${config.themeColor}-500` : 'w-2 bg-slate-700'}`}></div>
           ))}
        </div>
      </div>

      {/* Form Content Area */}
      <div className="px-6 -mt-4 relative z-20 flex-1 flex flex-col">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex-1 flex flex-col">
          
          {/* STEP 1: Tutor & Cão */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-2">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                      <User size={24} />
                   </div>
                   <h3 className="font-bold text-slate-800 text-lg">Quem vamos atender?</h3>
                   <p className="text-xs text-slate-400">Seus dados e do seu melhor amigo.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Seu Nome</label>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Ex: Maria Silva"
                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                        <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            type="tel"
                            placeholder="(00) 00000-0000"
                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                        />
                    </div>
                    
                    {/* Alteração: Campos agora em divs separadas (linhas individuais) */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome do Cão</label>
                        <input 
                            name="dogName"
                            value={formData.dogName}
                            onChange={handleInputChange}
                            placeholder="Ex: Rex"
                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                        />
                    </div>
                    
                    <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Raça 🐕</label>
                        <input 
                            name="breed"
                            value={formData.breed}
                            onChange={(e) => {
                                handleInputChange(e);
                                setShowBreedSuggestions(true);
                            }}
                            onFocus={() => setShowBreedSuggestions(true)}
                            placeholder="Busque..."
                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                        />
                        {/* Breed Autocomplete Dropdown */}
                        {showBreedSuggestions && formData.breed.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 shadow-xl rounded-xl mt-1 max-h-40 overflow-y-auto z-30">
                                {filteredBreeds.length > 0 ? (
                                    filteredBreeds.map(b => (
                                        <div 
                                            key={b.identificacao.id} 
                                            onClick={() => selectBreed(b.identificacao.nome)}
                                            className={`px-4 py-2 hover:bg-${config.themeColor}-50 text-sm text-slate-800 cursor-pointer border-b border-slate-50 last:border-0 flex items-center gap-2`}
                                        >
                                            <PawPrint size={10} className={`text-${config.themeColor}-400`} />
                                            {b.identificacao.nome}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-xs text-slate-400">Nenhuma raça encontrada</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
          )}

          {/* STEP 2: Endereço */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-2">
                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                      <Home size={24} />
                   </div>
                   <h3 className="font-bold text-slate-800 text-lg">Onde será a aula?</h3>
                   <p className="text-xs text-slate-400">Preencha o CEP para facilitar.</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">CEP (Busca Automática)</label>
                        <div className="relative">
                            <input 
                                name="cep"
                                value={formData.cep}
                                onChange={handleInputChange}
                                placeholder="00000-000"
                                maxLength={8}
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 tracking-widest focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                            />
                            <div className="absolute right-3 top-3.5 text-slate-400">
                                {loadingCep ? <Loader2 size={18} className={`animate-spin text-${config.themeColor}-500`}/> : <Search size={18}/>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-3">
                            <input 
                                name="street"
                                value={formData.street}
                                onChange={handleInputChange}
                                placeholder="Rua"
                                disabled={loadingCep}
                                className="w-full bg-slate-100 border-transparent rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none"
                            />
                        </div>
                        <div className="col-span-1">
                            <input 
                                id="number-input"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                placeholder="Nº"
                                className={`w-full bg-white border border-slate-200 rounded-xl px-2 py-3.5 text-sm font-bold text-slate-900 text-center focus:outline-none focus:border-${config.themeColor}-500 focus:bg-${config.themeColor}-50 transition-colors`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            name="neighborhood"
                            value={formData.neighborhood}
                            placeholder="Bairro"
                            disabled
                            className="bg-slate-100 border-transparent rounded-xl px-4 py-3.5 text-sm text-slate-600 font-medium"
                        />
                        <input 
                            name="city"
                            value={formData.city}
                            placeholder="Cidade"
                            disabled
                            className="bg-slate-100 border-transparent rounded-xl px-4 py-3.5 text-sm text-slate-600 font-medium"
                        />
                    </div>
                    
                    <input 
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        placeholder="Complemento (Apto, Bloco...)"
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                    />
                </div>
            </div>
          )}

          {/* STEP 3: Data & Confirmação */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-2">
                   <div className={`w-12 h-12 bg-${config.themeColor}-100 rounded-full flex items-center justify-center mx-auto mb-2 text-${config.themeColor}-600`}>
                      <Calendar size={24} />
                   </div>
                   <h3 className="font-bold text-slate-800 text-lg">Quando fica melhor?</h3>
                   <p className="text-xs text-slate-400">Sugira um horário para nossa visita.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Data 📅</label>
                        <input 
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Hora (Aprox) ⏰</label>
                        <input 
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-${config.themeColor}-500 transition-colors`}
                        />
                    </div>
                </div>

                {/* Resumo Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                        <Sparkles size={12} className={`text-${config.themeColor}-500`}/> Resumo do Agendamento
                    </h4>
                    <div className="space-y-2 text-sm text-slate-700">
                        <p className="flex items-center gap-2"><User size={14} className="text-slate-400"/> <strong>{formData.name}</strong></p>
                        <p className="flex items-center gap-2"><Dog size={14} className="text-slate-400"/> <strong>{formData.dogName}</strong> {formData.breed && <span className="text-xs text-slate-500">({formData.breed})</span>}</p>
                        <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> <span className="truncate">{formData.street}, {formData.number}</span></p>
                    </div>
                </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-auto pt-6">
            {step < 3 ? (
                <button 
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2 hover:bg-slate-800"
                >
                    Próximo Passo <ChevronRight size={18} />
                </button>
            ) : (
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 active:scale-95 transition flex items-center justify-center gap-2 hover:bg-green-600 animate-pulse-slow"
                >
                    <CheckCircle2 size={20} />
                    Enviar Solicitação no WhatsApp
                </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckSquare, Upload, Trash2, Clock, MapPin, List, AlignLeft, ImageIcon, Plus, X, Grid, DollarSign } from 'lucide-react';
import { ServiceDetailData } from '../types';
import { SERVICE_IMAGES_GALLERY } from '../data/serviceImages';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ServiceEditorProps {
  initialService?: ServiceDetailData | null;
  onSave: (service: ServiceDetailData) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

// Utilitário para comprimir imagem antes de salvar (Evita estourar o LocalStorage)
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxWidth = 800;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Comprime para JPEG 0.7 de qualidade
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ServiceEditorView: React.FC<ServiceEditorProps> = ({ initialService, onSave, onCancel, onDelete }) => {
  const { config } = useAppConfig();
  const [step, setStep] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Estado para o input de novo benefício
  const [newBenefit, setNewBenefit] = useState('');

  // Estado inicial padrão para novo serviço
  const defaultService: ServiceDetailData = {
    id: `custom-${Date.now()}`,
    title: "",
    description: "",
    fullDescription: "",
    image: "https://placehold.co/600x400?text=Nova+Imagem",
    tag: "NOVO",
    tagColor: "blue",
    popular: false,
    benefits: [],
    duration: "",
    location: "",
    price: ""
  };

  const [formData, setFormData] = useState<ServiceDetailData>(initialService || defaultService);
  
  // Estado local para controlar se o preço está ativado (checkbox)
  // Se já existir um preço preenchido, começa ativado.
  const [enablePrice, setEnablePrice] = useState(!!(initialService?.price && initialService.price.trim() !== ''));

  // Rola para o topo ao mudar de passo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const handleChange = (field: keyof ServiceDetailData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Lógica Dinâmica de Benefícios ---
  const addBenefit = () => {
    if (newBenefit.trim()) {
      handleChange('benefits', [...(formData.benefits || []), newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (indexToRemove: number) => {
    handleChange('benefits', formData.benefits.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDownBenefit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBenefit();
    }
  };
  // -------------------------------------

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await resizeImage(file);
        handleChange('image', compressedImage);
      } catch (err) {
        console.error("Erro ao processar imagem", err);
        alert("Erro ao processar a imagem. Tente outra.");
      }
    }
  };

  const handleSave = () => {
    if (!formData.title) {
        alert("O serviço precisa de um título!");
        return;
    }
    // Salva e fecha
    onSave(formData);
  };

  const handlePriceToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setEnablePrice(isChecked);
      if (!isChecked) {
          handleChange('price', ''); // Limpa o preço se desativar
      }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-8 relative">
      <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-100 -z-0">
         <div 
            className={`h-full bg-${config.themeColor}-500 transition-all duration-300`} 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
         ></div>
      </div>

      {[1, 2, 3].map((s) => (
        <div key={s} className="flex flex-col items-center relative z-10 cursor-pointer" onClick={() => setStep(s)}>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= s 
                ? `bg-${config.themeColor}-500 text-white shadow-lg transform scale-110` 
                : 'bg-white border-2 border-slate-100 text-slate-300'
            }`}
          >
            {s}
          </div>
          <span className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${step >= s ? 'text-slate-800' : 'text-slate-300'}`}>
            {s === 1 ? 'Básico' : s === 2 ? 'Visual' : 'Detalhes'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-full flex flex-col absolute inset-0 z-50 animate-slide-in">
        
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-4 shadow-sm border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
            <button onClick={onCancel} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-base font-bold text-slate-800 font-brand">
                {initialService ? 'Editar Plano' : 'Criar Novo Plano'}
            </h2>
            <div className="w-8"></div> {/* Spacer */}
        </div>

        {/* Content Scrollable */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-6">
            
            {renderStepIndicator()}

            {/* STEP 1: Identidade Básica */}
            {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Título do Serviço</label>
                        <input 
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-${config.themeColor}-500 shadow-sm`}
                            placeholder="Ex: Adestramento Avançado"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Tag (Etiqueta)</label>
                            <input 
                                value={formData.tag}
                                onChange={(e) => handleChange('tag', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm"
                                placeholder="Ex: NOVO"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 block">Cor da Tag</label>
                            <select 
                                value={formData.tagColor}
                                onChange={(e) => handleChange('tagColor', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm"
                            >
                                <option value="orange">Laranja</option>
                                <option value="blue">Azul</option>
                                <option value="green">Verde</option>
                                <option value="purple">Roxo</option>
                                <option value="slate">Cinza</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                        <input 
                            type="checkbox"
                            id="pop-check"
                            checked={formData.popular || false}
                            onChange={(e) => handleChange('popular', e.target.checked)}
                            className={`w-5 h-5 text-${config.themeColor}-500 rounded focus:ring-${config.themeColor}-500`}
                        />
                        <label htmlFor="pop-check" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                            Marcar este plano como "Destaque/Popular"
                        </label>
                    </div>
                </div>
            )}

            {/* STEP 2: Conteúdo e Imagem */}
            {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                    
                    {/* Image Upload Area */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                            <ImageIcon size={14}/> Imagem de Capa
                        </label>
                        
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-200 group">
                            <img src={formData.image} className="w-full h-full object-cover transition-all duration-300" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <label htmlFor="service-upload" className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-100 shadow-lg transform hover:scale-105 transition-all">
                                    <Upload size={14} /> Trocar Imagem
                                </label>
                            </div>
                        </div>

                        <input 
                            type="file" 
                            id="service-upload"
                            accept="image/*"
                            className="hidden" 
                            onChange={handleImageUpload}
                        />

                        {/* Galeria Rápida */}
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Grid size={10}/> Ou escolha da galeria:</p>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {SERVICE_IMAGES_GALLERY.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => handleChange('image', img.img_full)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${formData.image === img.img_full ? `border-${config.themeColor}-500 ring-2 ring-${config.themeColor}-200` : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <img src={img.img_thumb} className="w-full h-full object-cover" alt={`Opção ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 flex items-center gap-1"><AlignLeft size={12}/> Descrição Curta (Card)</label>
                        <input 
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-${config.themeColor}-500 shadow-sm`}
                            placeholder="Resumo em uma frase..."
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 flex items-center gap-1"><AlignLeft size={12}/> Descrição Completa</label>
                        <textarea 
                            rows={4}
                            value={formData.fullDescription}
                            onChange={(e) => handleChange('fullDescription', e.target.value)}
                            className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-${config.themeColor}-500 shadow-sm resize-none`}
                            placeholder="Explique todos os detalhes do serviço..."
                        />
                    </div>
                </div>
            )}

            {/* STEP 3: Detalhes Finais (Dinâmico) */}
            {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 flex items-center gap-1"><Clock size={12}/> Duração</label>
                            <input 
                                value={formData.duration}
                                onChange={(e) => handleChange('duration', e.target.value)}
                                className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-${config.themeColor}-500 shadow-sm`}
                                placeholder="Ex: 8 aulas"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 flex items-center gap-1"><MapPin size={12}/> Local</label>
                            <input 
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-${config.themeColor}-500 shadow-sm`}
                                placeholder="Ex: Domicílio"
                            />
                        </div>
                    </div>

                    {/* Novo Campo: Preço com Checkbox */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-1 flex items-center gap-1"><DollarSign size={12}/> Configuração de Preço</label>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <input 
                                    type="checkbox"
                                    id="price-toggle"
                                    checked={enablePrice}
                                    onChange={handlePriceToggle}
                                    className={`w-5 h-5 text-${config.themeColor}-500 rounded focus:ring-${config.themeColor}-500`}
                                />
                                <label htmlFor="price-toggle" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                                    Exibir preço para este serviço
                                </label>
                            </div>

                            {enablePrice && (
                                <div className="animate-fade-in pt-2 border-t border-slate-100 mt-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Valor a ser exibido</label>
                                    <input 
                                        value={formData.price || ''}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-${config.themeColor}-500 focus:bg-white transition-colors`}
                                        placeholder="Ex: R$ 250,00 ou Sob Consulta"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista Dinâmica de Benefícios */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1 mb-2 flex items-center gap-1"><List size={12}/> Lista de Benefícios</label>
                        <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm space-y-2">
                            
                            {/* Input para adicionar */}
                            <div className="flex gap-2">
                                <input 
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                    onKeyDown={handleKeyDownBenefit}
                                    placeholder="Digite um benefício e aperte +"
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                                />
                                <button 
                                    onClick={addBenefit}
                                    className={`bg-${config.themeColor}-500 text-white w-10 rounded-lg flex items-center justify-center hover:bg-${config.themeColor}-600 transition`}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Lista de Itens */}
                            <div className="space-y-1 mt-2">
                                {formData.benefits && formData.benefits.length > 0 ? (
                                    formData.benefits.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg group hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <CheckSquare size={14} className="text-green-500 shrink-0" />
                                                <span className="text-sm text-slate-700">{item}</span>
                                            </div>
                                            <button 
                                                onClick={() => removeBenefit(idx)}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-xs text-slate-400 italic">
                                        Nenhum benefício adicionado.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 border-t border-slate-100 flex items-center justify-between sticky bottom-0 z-40">
            {step > 1 ? (
                <button 
                    onClick={() => setStep(prev => prev - 1)}
                    className="text-slate-400 hover:text-slate-600 px-4 py-2 text-sm font-bold flex items-center gap-1"
                >
                    <ArrowLeft size={16} /> Voltar
                </button>
            ) : (
                initialService && onDelete ? (
                    <button 
                        onClick={() => onDelete(initialService.id)}
                        className="text-red-400 hover:text-red-600 px-4 py-2 text-sm font-bold flex items-center gap-1"
                    >
                        <Trash2 size={16} /> Excluir
                    </button>
                ) : <div className="w-20"></div>
            )}

            {step < 3 ? (
                <button 
                    onClick={() => setStep(prev => prev + 1)}
                    className={`bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform`}
                >
                    Próximo <ArrowRight size={16} />
                </button>
            ) : (
                <button 
                    onClick={handleSave}
                    className={`bg-green-500 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-500/30 flex items-center gap-2 active:scale-95 transition-transform hover:bg-green-600`}
                >
                    <CheckSquare size={18} /> Salvar Plano
                </button>
            )}
        </div>
    </div>
  );
};
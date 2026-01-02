import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Smartphone, User, Palette, Phone, MapPin, Instagram, Layout, Briefcase, Edit2, Plus, Upload, Camera, Image as ImageIcon, Grid, ChevronDown, ChevronUp, Loader2, Server, Database, CheckCircle, Sparkles, Zap, Eye, BarChart3, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';
import { AppConfig, ServiceDetailData } from '../types';
import { ServiceEditorView } from './ServiceEditor';
import { HERO_IMAGES_GALLERY } from '../data/heroImages';

// Utilitário para comprimir imagem
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxWidth = 800; // Limite seguro para localStorage
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compressão 70%
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const AdminView: React.FC = () => {
  const { config, updateConfig, resetConfig } = useAppConfig();
  
  // --- ONBOARDING STATE ---
  const [setupName, setSetupName] = useState('');
  const [setupPhone, setSetupPhone] = useState('');
  const [setupStep, setSetupStep] = useState<'form' | 'processing'>('form');
  const [loadingMsg, setLoadingMsg] = useState('Iniciando sistema...');
  // -----------------------

  const [tempConfig, setTempConfig] = useState<AppConfig>(config);
  const [saved, setSaved] = useState(false);
  
  // Controle de Navegação Interna do Admin
  const [viewMode, setViewMode] = useState<'dashboard' | 'editor'>('dashboard');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Estado para controlar qual seção está expandida.
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempConfig(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await resizeImage(file);
        setTempConfig(prev => ({ ...prev, profileImage: compressedImage }));
        setSaved(false);
      } catch (err) {
        console.error("Erro ao processar imagem de perfil", err);
        alert("Erro ao carregar imagem.");
      }
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await resizeImage(file);
        setTempConfig(prev => ({ ...prev, heroImage: compressedImage }));
        setSaved(false);
      } catch (err) {
        console.error("Erro ao processar imagem de capa", err);
        alert("Erro ao carregar imagem.");
      }
    }
  };

  const openEditor = (serviceId?: string) => {
    setEditingServiceId(serviceId || null);
    setViewMode('editor');
  };

  const closeEditor = () => {
    setViewMode('dashboard');
    setEditingServiceId(null);
  };

  const handleSaveService = (updatedService: ServiceDetailData) => {
    const newServices = tempConfig.services.map(s => s.id === updatedService.id ? updatedService : s);
    if (!tempConfig.services.find(s => s.id === updatedService.id)) {
        newServices.push(updatedService);
    }
    const newConfig = { ...tempConfig, services: newServices };
    setTempConfig(newConfig);
    updateConfig(newConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    closeEditor();
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este plano permanentemente?")) {
      const newConfig = {
        ...tempConfig,
        services: tempConfig.services.filter(s => s.id !== id)
      };
      setTempConfig(newConfig);
      updateConfig(newConfig);
      setSaved(false);
      closeEditor();
    }
  };

  const handleGlobalSave = () => {
    updateConfig(tempConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Componente de Card do Dashboard
  const DashboardCard = ({ id, title, icon: Icon, colorClass, children, summary }: any) => (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${expandedSection === id ? 'ring-2 ring-slate-200 shadow-md col-span-1 md:col-span-2' : 'hover:shadow-md'}`}>
        <button 
            onClick={() => toggleSection(id)}
            className="w-full flex items-center justify-between p-5 bg-white transition-colors hover:bg-slate-50/50"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
                    <Icon size={22} className={colorClass.replace('bg-', 'text-')} />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                    {!expandedSection && summary && (
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{summary}</p>
                    )}
                </div>
            </div>
            <div className={`text-slate-300 transition-transform duration-300 ${expandedSection === id ? 'rotate-180 text-slate-600' : ''}`}>
                <ChevronDown size={20} />
            </div>
        </button>
        
        {expandedSection === id && (
            <div className="p-6 border-t border-slate-50 animate-fade-in bg-slate-50/30">
                {children}
            </div>
        )}
    </div>
  );

  // --- LOGICA DE SETUP INICIAL (ONBOARDING) ---
  const handleStartSetup = () => {
    if(!setupName || !setupPhone) {
        alert("Por favor, preencha seu nome e WhatsApp.");
        return;
    }
    setSetupStep('processing');
  };

  // Efeito para animação de loading do setup
  useEffect(() => {
    if (setupStep === 'processing') {
        const messages = [
            "Conectando ao servidor...",
            "Criando perfil profissional...",
            `Configurando conta de ${setupName}...`,
            "Vinculando WhatsApp...",
            "Gerando painel administrativo...",
            "Aplicando tema visual...",
            "Finalizando configuração..."
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                setLoadingMsg(messages[i]);
                i++;
            } else {
                clearInterval(interval);
                // FINALIZA SETUP
                updateConfig({
                    professionalName: setupName,
                    phone: setupPhone.replace(/\D/g, ''),
                    isOnboarded: true
                });
                setTempConfig(prev => ({
                    ...prev,
                    professionalName: setupName,
                    phone: setupPhone.replace(/\D/g, ''),
                    isOnboarded: true
                }));
            }
        }, 800); // Velocidade da troca de mensagens

        return () => clearInterval(interval);
    }
  }, [setupStep]);

  // RENDERIZAÇÃO DO SETUP SE NÃO TIVER FEITO ONBOARDING
  if (!config.isOnboarded) {
    if (setupStep === 'form') {
        return (
            <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>

                <div className="w-full max-w-sm relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-6 shadow-2xl shadow-blue-500/10 animate-bounce-slow">
                            <Sparkles size={32} className="text-blue-400 fill-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 font-brand mb-2">
                            Bem-vindo, Treinador!
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Vamos configurar seu aplicativo profissional em menos de 1 minuto.
                        </p>
                    </div>

                    {/* Glass Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                        <div className="space-y-5">
                            <div className="group">
                                <label className="text-[10px] font-bold text-blue-300 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-1.5">
                                    <User size={10} /> Como quer ser chamado?
                                </label>
                                <div className="relative">
                                    <input 
                                        value={setupName}
                                        onChange={(e) => setSetupName(e.target.value)}
                                        placeholder="Ex: Carlos Adestrador"
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-4 pr-4 py-4 text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                                    />
                                    <div className="absolute right-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                        <Edit2 size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-bold text-green-300 uppercase tracking-wider ml-1 mb-1.5 flex items-center gap-1.5">
                                    <Smartphone size={10} /> Seu WhatsApp (Apenas números)
                                </label>
                                <div className="relative">
                                    <input 
                                        value={setupPhone}
                                        onChange={(e) => setSetupPhone(e.target.value)}
                                        type="tel"
                                        placeholder="11999999999"
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-4 pr-4 py-4 text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all text-sm"
                                    />
                                    <div className="absolute right-4 top-4 text-slate-500 group-focus-within:text-green-400 transition-colors">
                                        <ShieldCheck size={16} />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleStartSetup}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 group border border-white/10"
                            >
                                <span className="tracking-wide text-sm">Criar meu App</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
                        <Zap size={12} className="text-white" fill="currentColor"/>
                        <span className="text-[10px] text-white font-medium uppercase tracking-widest">Configuração Automática v2.0</span>
                    </div>
                </div>
            </div>
        );
    }

    if (setupStep === 'processing') {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Scanlines Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>

                <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                        <div className="relative z-10 w-24 h-24 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center shadow-2xl">
                            <Loader2 size={40} className="text-blue-500 animate-spin" />
                        </div>
                        {/* Orbiting Icons */}
                        <div className="absolute inset-0 animate-spin-slow">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 bg-slate-800 p-1.5 rounded-full border border-slate-700">
                                <Database size={12} className="text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 font-brand animate-pulse text-center">{loadingMsg}</h2>
                    
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-6 border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-full animate-progress origin-left shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                    
                    <p className="text-slate-500 text-[10px] mt-4 uppercase tracking-widest font-mono">Processando dados...</p>
                </div>
            </div>
        );
    }
  }
  // --- FIM DA LÓGICA DE ONBOARDING ---

  // Se estiver no modo Editor, renderiza a View de Edição
  if (viewMode === 'editor') {
    const serviceToEdit = tempConfig.services.find(s => s.id === editingServiceId);
    return (
      <ServiceEditorView 
        initialService={serviceToEdit}
        onSave={handleSaveService}
        onCancel={closeEditor}
        onDelete={handleDeleteService}
      />
    );
  }

  // Modo Dashboard
  return (
    <div className="bg-slate-50 min-h-full pb-32 animate-fade-in relative">
      
      {/* Header Admin Moderno */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 pb-16 px-6 rounded-b-[3rem] relative overflow-hidden shadow-2xl mb-6">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 p-12 opacity-5">
            <Layout size={180} className="text-white transform rotate-12 translate-x-10 -translate-y-10" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Painel de Controle
                </p>
                <h2 className="text-2xl font-bold text-white font-brand">Olá, {tempConfig.professionalName.split(' ')[0]}</h2>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
                 <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                    <img src={tempConfig.profileImage} className="w-full h-full object-cover" alt="Profile" />
                 </div>
              </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
             <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400">
                    <Briefcase size={18} />
                </div>
                <div>
                    <span className="block text-xl font-bold text-white leading-none">{tempConfig.services.length}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Serviços Ativos</span>
                </div>
             </div>
             <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <div className={`bg-${tempConfig.themeColor}-500/20 p-2 rounded-xl text-${tempConfig.themeColor}-400`}>
                    <Palette size={18} />
                </div>
                <div>
                    <span className="block text-xl font-bold text-white leading-none capitalize">{tempConfig.themeColor}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Tema Atual</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-20 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD 1: IDENTIDADE (Profile + Contact) */}
        <DashboardCard 
            id="identity" 
            title="Identidade & Contato" 
            icon={User} 
            colorClass="bg-blue-500"
            summary={`${tempConfig.phone} • ${tempConfig.locationText}`}
        >
            <div className="space-y-6">
                {/* Upload Foto Perfil */}
                <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-100 shadow-md">
                            <img src={tempConfig.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} className="text-white" />
                        </label>
                        <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleProfileImageUpload}/>
                    </div>
                    <div className="flex-1 space-y-2">
                        <input 
                            name="professionalName"
                            value={tempConfig.professionalName}
                            onChange={handleChange}
                            placeholder="Seu Nome"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none"
                        />
                        <input 
                            name="slogan"
                            value={tempConfig.slogan}
                            onChange={handleChange}
                            placeholder="Slogan"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Phone size={10}/> WhatsApp</label>
                        <input 
                            name="phone"
                            value={tempConfig.phone}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Instagram size={10}/> Instagram URL</label>
                        <input 
                            name="instagramUrl"
                            value={tempConfig.instagramUrl}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><MapPin size={10}/> Localização</label>
                        <input 
                            name="locationText"
                            value={tempConfig.locationText}
                            onChange={handleChange}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700"
                        />
                    </div>
                </div>
            </div>
        </DashboardCard>

        {/* CARD 2: APARÊNCIA (Theme + Hero) */}
        <DashboardCard 
            id="appearance" 
            title="Aparência do App" 
            icon={Palette} 
            colorClass="bg-purple-500"
            summary="Cores e Capa Principal"
        >
            <div className="space-y-6">
                {/* Hero Image */}
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">Capa Principal (Hero)</label>
                    <div className="relative group cursor-pointer w-full h-32 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-sm mb-3">
                        <img src={tempConfig.heroImage} alt="Hero" className="w-full h-full object-cover" />
                        <label htmlFor="hero-upload" className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <ImageIcon size={24} className="text-white mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase">Alterar Capa</span>
                        </label>
                        <input type="file" id="hero-upload" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                    </div>
                    
                    {/* Galeria Rápida */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {HERO_IMAGES_GALLERY.slice(0, 5).map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => { setTempConfig(prev => ({ ...prev, heroImage: img.img_full })); setSaved(false); }}
                                className={`flex-shrink-0 w-12 h-8 rounded-md overflow-hidden border transition-all ${tempConfig.heroImage === img.img_full ? `border-${tempConfig.themeColor}-500 ring-2 ring-${tempConfig.themeColor}-200` : 'border-slate-200'}`}
                            >
                                <img src={img.img_thumb} className="w-full h-full object-cover" alt="opt" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Color */}
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">Cor do Tema</label>
                    <div className="grid grid-cols-4 gap-3">
                        {['orange', 'blue', 'green', 'purple'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setTempConfig(prev => ({ ...prev, themeColor: color as any }))}
                                className={`group relative h-14 rounded-2xl border-2 transition-all flex flex-col items-center justify-center overflow-hidden ${
                                    tempConfig.themeColor === color 
                                    ? `border-${color}-500 bg-${color}-50 ring-2 ring-${color}-200` 
                                    : 'border-slate-100 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className={`w-full h-full absolute inset-0 opacity-10 bg-${color}-500`}></div>
                                <div className={`w-4 h-4 rounded-full bg-${color}-500 mb-1 shadow-sm`}></div>
                                <span className="text-[9px] font-bold uppercase text-slate-500">{color === 'orange' ? 'Solar' : color === 'blue' ? 'Ocean' : color === 'green' ? 'Nature' : 'Royal'}</span>
                                {tempConfig.themeColor === color && (
                                    <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                                        <CheckCircle size={8} className={`text-${color}-500`} fill="currentColor" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardCard>

        {/* CARD 3: SERVIÇOS */}
        <div className="col-span-1 md:col-span-2">
            <DashboardCard 
                id="services" 
                title="Meus Serviços" 
                icon={Briefcase} 
                colorClass="bg-orange-500"
                summary={`${tempConfig.services.length} Planos cadastrados`}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">Gerencie os serviços oferecidos.</p>
                        <button 
                            onClick={() => openEditor()}
                            className={`text-[10px] font-bold bg-${tempConfig.themeColor}-500 text-white px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-${tempConfig.themeColor}-600 transition-colors shadow-lg shadow-${tempConfig.themeColor}-500/20`}
                        >
                            <Plus size={14} /> Novo Serviço
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                    {tempConfig.services.map((service) => (
                        <div 
                            key={service.id} 
                            onClick={() => openEditor(service.id)}
                            className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                        >
                            {/* Popular Badge */}
                            {service.popular && <div className={`absolute top-0 left-0 w-1 h-full bg-${tempConfig.themeColor}-500`}></div>}
                            
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                <img src={service.image} alt="ico" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate">{service.title}</h4>
                                <div className="flex gap-2 items-center mt-0.5">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase`}>{service.tag}</span>
                                    <span className="text-[10px] text-slate-400">{service.duration}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                <Edit2 size={16} />
                            </div>
                        </div>
                    ))}
                    
                    {tempConfig.services.length === 0 && (
                        <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                            <Sparkles size={24} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-xs font-medium">Nenhum plano cadastrado.</p>
                        </div>
                    )}
                    </div>
                </div>
            </DashboardCard>
        </div>

      </div>

      {/* Floating Save Actions */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 z-40 transition-transform duration-300 ${saved ? 'translate-y-0' : (JSON.stringify(config) !== JSON.stringify(tempConfig) ? 'translate-y-0' : 'translate-y-24')}`}>
         <div className="max-w-md mx-auto bg-slate-900 text-white p-2 pl-4 rounded-2xl shadow-2xl shadow-slate-900/50 flex items-center justify-between border border-slate-700">
            <span className="text-xs font-bold flex items-center gap-2">
                {saved ? <CheckCircle size={16} className="text-green-400" /> : <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>}
                {saved ? 'Salvo com sucesso!' : 'Alterações pendentes'}
            </span>
            <div className="flex gap-2">
                <button 
                    onClick={() => {
                        resetConfig();
                        setTempConfig(useAppConfig().config);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors"
                    title="Restaurar"
                >
                    <RotateCcw size={18} />
                </button>
                <button 
                    onClick={handleGlobalSave}
                    className="bg-white text-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
                >
                    <Save size={16} /> Salvar
                </button>
            </div>
         </div>
      </div>

      {/* Botão Flutuante Permanente (Preview) */}
      <div className="fixed bottom-24 right-4 z-30">
         <button 
            onClick={() => alert("O modo preview já está ativo! Suas alterações refletem imediatamente nas outras abas.")}
            className="bg-white text-slate-400 p-3 rounded-full shadow-lg border border-slate-100 hover:text-slate-800 transition active:scale-90"
         >
            <Eye size={24} />
         </button>
      </div>

    </div>
  );
};
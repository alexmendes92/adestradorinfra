import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ArrowRight, Clock, MapPin, MessageCircle, RotateCcw, Bone, Dog, Search, Info, Globe, Zap, Check, PawPrint, Brain, Target, Star, AlertCircle } from 'lucide-react';
import { QuizState, ProblemType, DogSize } from '../types';
import { BREEDS_DB } from '../breedsData';
import { useAppConfig } from '../contexts/AppConfigContext';

interface QuizProps {
  quizState: QuizState;
  setQuizState: React.Dispatch<React.SetStateAction<QuizState>>;
}

export const QuizView: React.FC<QuizProps> = ({ quizState, setQuizState }) => {
  const { config } = useAppConfig();
  const { step, name, age, problem, breed, size } = quizState;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Iniciando análise...');
  
  // Estado de Erros de Validação
  const [errors, setErrors] = useState({
    name: false,
    breed: false,
    age: false,
    size: false
  });

  // Ref para scroll
  const topRef = useRef<HTMLDivElement>(null);

  // Loading messages sequence
  const loadingMessages = [
    "Analisando perfil comportamental...",
    "Verificando predisposição da raça...",
    "Calculando curva de aprendizado...",
    "Montando plano personalizado...",
    "Finalizando diagnóstico..."
  ];

  // Filter breeds from the full DB for autocomplete
  const filteredBreeds = useMemo(() => {
    if (!breed) return [];
    return BREEDS_DB.filter(b => 
      b.identificacao.nome.toLowerCase().includes(breed.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
  }, [breed]);

  // Find the exact selected breed data for display
  const selectedBreedData = useMemo(() => {
    return BREEDS_DB.find(b => b.identificacao.nome.toLowerCase() === breed.trim().toLowerCase());
  }, [breed]);

  const updateState = (updates: Partial<QuizState>) => {
    setQuizState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => updateState({ step: step + 1 });
  
  const resetQuiz = () => {
    setQuizState({ step: 1, name: '', age: '', problem: '', breed: '', size: '' });
    setErrors({ name: false, breed: false, age: false, size: false });
  };

  useEffect(() => {
    if (step === 3) {
      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        setLoadingMsg(loadingMessages[msgIndex]);
      }, 800);

      const timer = setTimeout(() => {
        clearInterval(msgInterval);
        updateState({ step: 4 });
      }, 4000); // Increased loading time for effect
      return () => { clearTimeout(timer); clearInterval(msgInterval); };
    }
  }, [step]);

  const handleStep1Submit = () => {
    const newErrors = {
        name: !name.trim(),
        breed: !breed.trim(),
        size: !size,
        age: !age
    };

    setErrors(newErrors);

    // Se houver algum erro
    if (Object.values(newErrors).some(Boolean)) {
        // Scroll para o topo para ver os erros se necessário
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    nextStep();
  };

  const handleProblemSelect = (p: ProblemType) => {
    updateState({ problem: p, step: 3 }); // Go to loading
  };

  const handleBreedSelect = (selectedBreedName: string) => {
    updateState({ breed: selectedBreedName });
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, breed: false }));
  };

  const getResult = () => {
    if (age === 'puppy') {
      return {
        title: "Protocolo Filhote Exemplar",
        subtitle: "Educação Sanitária & Socialização",
        desc: `Nesta fase, o cérebro do ${name} é uma esponja. O foco será prevenir maus hábitos antes que se instalem.`,
        img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img11.png",
        tags: ['Xixi no Lugar', 'Mordidinhas', 'Independência'],
        difficulty: 'Média'
      };
    }
    if (problem === 'aggression') {
      return {
        title: "Reabilitação Comportamental",
        subtitle: "Controle de Reatividade & Confiança",
        desc: `Um programa técnico para devolver a paz ao ${name}, focando em dessensibilização e contra-condicionamento.`,
        img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img13.png",
        tags: ['Segurança', 'Autocontrole', 'Vínculo'],
        difficulty: 'Alta'
      };
    }
    if (problem === 'leash') {
      return {
        title: "Passeio Educativo",
        subtitle: "Andar Junto & Foco no Condutor",
        desc: `Transformaremos o passeio do ${name} em um momento de conexão, acabando com os puxões através de técnicas de indução.`,
        img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img12.png",
        tags: ['Sem Puxar', 'Foco', 'Socialização'],
        difficulty: 'Média'
      };
    }
    return {
      title: "Obediência Funcional",
      subtitle: "Controle de Impulsos & Comandos",
      desc: `Ideal para o ${name} aprender a ter calma dentro de casa e respeitar limites, fortalecendo a liderança gentil.`,
      img: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img12.png",
        tags: ['Senta/Fica', 'Limites', 'Calma'],
        difficulty: 'Baixa'
    };
  };

  const result = getResult();
  
  // WhatsApp Message Construction
  const sizeMap = { small: 'Pequeno', medium: 'Médio', large: 'Grande' };
  const ageMap = { puppy: 'Filhote', adult: 'Adulto' };
  const problemMap = { leash: 'Puxa guia', potty: 'Xixi errado', destruction: 'Destruição', aggression: 'Agressividade' };
  
  const whatsappText = `Olá ${config.professionalName.split(' ')[0]}! 🐾\n\nFiz o diagnóstico no app e gostei do *${result.title}*.\n\n🐶 *Perfil do Aluno:*\nNome: ${name}\nRaça: ${breed}\nPorte: ${sizeMap[size as DogSize] || ''}\nIdade: ${ageMap[age] || ''}\n\n⚠️ *Principal Desafio:* ${problemMap[problem] || ''}`;

  return (
    <div className="bg-slate-50 min-h-full flex flex-col relative animate-fade-in pb-20">
      
      {/* Header com Progresso */}
      <div ref={topRef} className="bg-white px-6 pt-6 pb-4 rounded-b-3xl shadow-sm border-b border-slate-100 sticky top-0 z-40">
        <div className="flex justify-between items-end mb-3">
           <div>
              <h2 className="text-xl font-bold text-slate-900 font-brand leading-none">Diagnóstico</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                {step === 1 ? 'Perfil do Cão' : step === 2 ? 'Comportamento' : step === 3 ? 'Analisando' : 'Seu Plano'}
              </p>
           </div>
           <span className={`text-xs font-bold text-${config.themeColor}-500 bg-${config.themeColor}-50 px-2 py-1 rounded-lg`}>{step}/4</span>
        </div>
        {/* Progress Bar Segmentada */}
        <div className="flex gap-1.5 h-1.5">
           {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex-1 rounded-full transition-all duration-500 ${step >= s ? `bg-${config.themeColor}-500` : 'bg-slate-100'}`}></div>
           ))}
        </div>
      </div>

      {/* STEP 1: Profile */}
      {step === 1 && (
        <div className="p-6 flex-1 flex flex-col animate-slide-in">
          
          <div className="space-y-6">
            {/* NAME */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.name ? 'text-red-500' : 'text-slate-500'}`}>
                <Dog size={12} /> Nome do Cão {errors.name && '*'}
              </label>
              <input 
                value={name}
                onChange={(e) => {
                    updateState({ name: e.target.value });
                    if(e.target.value) setErrors(prev => ({...prev, name: false}));
                }}
                className={`w-full bg-white px-4 py-3.5 rounded-xl border focus:outline-none text-base font-bold text-slate-900 transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300 ${errors.name ? 'border-red-500 bg-red-50 focus:border-red-500' : `border-slate-200 focus:border-${config.themeColor}-500 focus:ring-2 focus:ring-${config.themeColor}-100`}`}
                placeholder="Ex: Thor"
                type="text"
              />
              {errors.name && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><AlertCircle size={10}/> Campo obrigatório</p>}
            </div>

            {/* BREED AUTOCOMPLETE */}
            <div className="relative space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.breed ? 'text-red-500' : 'text-slate-500'}`}>
                <Search size={12} /> Raça {errors.breed && '*'}
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={breed}
                  onChange={(e) => { 
                      updateState({ breed: e.target.value }); 
                      setShowSuggestions(true); 
                      if(e.target.value) setErrors(prev => ({...prev, breed: false}));
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className={`w-full bg-white px-4 py-3.5 rounded-xl border focus:outline-none text-base font-bold text-slate-900 transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300 ${errors.breed ? 'border-red-500 bg-red-50 focus:border-red-500' : `border-slate-200 focus:border-${config.themeColor}-500 focus:ring-2 focus:ring-${config.themeColor}-100`}`}
                  placeholder="Busque a raça..."
                />
                {breed && (
                   <button onClick={() => updateState({ breed: '' })} className="absolute right-3 top-3.5 text-slate-300 hover:text-slate-500">
                      <RotateCcw size={16} />
                   </button>
                )}
              </div>
              {errors.breed && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><AlertCircle size={10}/> Identifique a raça ou digite SRD</p>}
              
              {showSuggestions && breed.length > 0 && !selectedBreedData && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scroll">
                  {filteredBreeds.length > 0 ? (
                    filteredBreeds.map((b) => (
                      <button
                        key={b.identificacao.id}
                        onClick={() => handleBreedSelect(b.identificacao.nome)}
                        className={`w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-${config.themeColor}-50 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3`}
                      >
                         <img src={b.imagens.img1} alt={b.identificacao.nome} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                         <span className="font-bold">{b.identificacao.nome}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-slate-400 italic text-center">Raça não encontrada.</div>
                  )}
                </div>
              )}

              {/* SELECTED BREED CARD PREVIEW */}
              {selectedBreedData && (
                <div className="mt-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-3 flex gap-4 items-center animate-fade-in shadow-lg text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 text-white/5 -mr-4 -mt-4"><PawPrint size={80} /></div>
                  <img 
                    src={selectedBreedData.imagens.img1} 
                    alt={selectedBreedData.identificacao.nome} 
                    className="w-12 h-12 rounded-lg object-cover bg-white/10 border border-white/20 shadow-sm relative z-10" 
                  />
                  <div className="relative z-10">
                    <h4 className="font-bold text-sm leading-tight text-white">{selectedBreedData.identificacao.nome}</h4>
                    <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                       <Globe size={10} /> {selectedBreedData.identificacao.origem}
                    </span>
                  </div>
                  <div className="ml-auto relative z-10">
                     <Check size={18} className="text-green-400" />
                  </div>
                </div>
              )}
            </div>

            {/* AGE */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.age ? 'text-red-500' : 'text-slate-500'}`}>
                <Clock size={12} /> Idade {errors.age && '*'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { updateState({ age: 'puppy' }); setErrors(prev => ({...prev, age: false})); }}
                  className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${age === 'puppy' ? `border-${config.themeColor}-500 bg-${config.themeColor}-50 text-${config.themeColor}-700 shadow-sm` : (errors.age ? 'border-red-300 bg-red-50 text-red-400' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200')}`}
                >
                  <Bone size={18} className={age === 'puppy' ? 'fill-current' : ''}/>
                  <span className="font-bold text-sm">Filhote</span>
                </button>
                <button 
                   onClick={() => { updateState({ age: 'adult' }); setErrors(prev => ({...prev, age: false})); }}
                   className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${age === 'adult' ? `border-${config.themeColor}-500 bg-${config.themeColor}-50 text-${config.themeColor}-700 shadow-sm` : (errors.age ? 'border-red-300 bg-red-50 text-red-400' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200')}`}
                >
                  <Dog size={18} className={age === 'adult' ? 'fill-current' : ''}/>
                  <span className="font-bold text-sm">Adulto</span>
                </button>
              </div>
              {errors.age && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><AlertCircle size={10}/> Selecione a idade</p>}
            </div>

            {/* SIZE */}
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${errors.size ? 'text-red-500' : 'text-slate-500'}`}>
                <Target size={12} /> Porte {errors.size && '*'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Pequeno' },
                  { id: 'medium', label: 'Médio' },
                  { id: 'large', label: 'Grande' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { updateState({ size: s.id as DogSize }); setErrors(prev => ({...prev, size: false})); }}
                    className={`py-2.5 rounded-xl border-2 transition-all active:scale-95 ${
                      size === s.id 
                        ? 'border-slate-800 bg-slate-800 text-white shadow-md' 
                        : (errors.size ? 'border-red-300 bg-red-50 text-red-400' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200')
                    }`}
                  >
                    <span className="text-xs font-bold uppercase">{s.label}</span>
                  </button>
                ))}
              </div>
              {errors.size && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><AlertCircle size={10}/> Selecione o tamanho</p>}
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={handleStep1Submit}
              className={`w-full bg-${config.themeColor}-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-${config.themeColor}-500/30 active:scale-95 transition flex justify-center items-center gap-2 hover:bg-${config.themeColor}-600`}
            >
              Continuar
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Problem */}
      {step === 2 && (
        <div className="p-6 flex-1 flex flex-col animate-slide-in">
          <div className="text-center mb-6">
             <h2 className="text-2xl font-bold text-slate-900 font-brand">Principal Desafio</h2>
             <p className="text-slate-500 text-sm mt-1">
               O que precisamos resolver com o <span className={`font-bold text-${config.themeColor}-500`}>{name || 'Cão'}</span>?
             </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pb-4">
            {[
              { id: 'leash', label: 'Puxa a guia', sub: 'Passeio caótico', icon: '🦮' },
              { id: 'potty', label: 'Xixi Errado', sub: 'Sujeira na casa', icon: '💦' },
              { id: 'destruction', label: 'Destruição', sub: 'Rói tudo', icon: '🛋️' },
              { id: 'aggression', label: 'Reatividade', sub: 'Late/Avança', icon: 'u1F9AE' }, // Using emoji logic or string
            ].map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleProblemSelect(item.id as ProblemType)}
                className={`bg-white border-2 border-slate-100 rounded-2xl p-4 text-center hover:border-${config.themeColor}-500 hover:shadow-md transition-all active:scale-95 group flex flex-col items-center justify-center gap-3 aspect-square`}
              >
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                   {idx === 0 ? '🦮' : idx === 1 ? '🚽' : idx === 2 ? '🦴' : '🐕'}
                </div>
                <div>
                  <h4 className={`font-bold text-slate-800 text-sm group-hover:text-${config.themeColor}-600 transition-colors`}>{item.label}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
          
          <button 
             onClick={() => updateState({ step: 1 })}
             className="mt-auto text-slate-400 text-xs font-bold flex items-center justify-center gap-1 py-4 hover:text-slate-600"
          >
             <RotateCcw size={12} /> Voltar
          </button>
        </div>
      )}

      {/* STEP 3 (Loading Smart) */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in px-8">
           <div className="mb-8 relative">
              {/* Pulsing Circles */}
              <div className={`absolute inset-0 bg-${config.themeColor}-500 rounded-full animate-ping opacity-20`}></div>
              <div className={`absolute inset-2 bg-${config.themeColor}-500 rounded-full animate-pulse opacity-30`}></div>
              
              <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10 shadow-xl border-4 border-${config.themeColor}-100`}>
                 <Brain size={40} className={`text-${config.themeColor}-500 animate-bounce`} />
              </div>
           </div>
           
          <h3 className="text-xl font-bold text-slate-800 mb-2">{loadingMsg}</h3>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
             <div className={`h-full bg-${config.themeColor}-500 animate-progress w-full origin-left`}></div>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-medium">Processando dados do {name}...</p>
        </div>
      )}

      {/* STEP 4 (Result Premium) */}
      {step === 4 && (
        <div className="p-6 flex-1 flex flex-col animate-slide-in">
          <div className="bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full w-fit mb-4 flex items-center gap-1.5 border border-green-100">
            <Check size={12} /> DIAGNÓSTICO CONCLUÍDO
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-1 font-brand">Plano Ideal</h2>
          <p className="text-slate-500 text-sm mb-6">Baseado no perfil do <span className="font-bold text-slate-800">{name}</span>.</p>
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 mb-6">
             <div className="h-32 bg-slate-200 relative">
                <img src={result.img} alt="Cover" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                   <div className="text-white">
                      <span className={`text-[10px] font-bold bg-${config.themeColor}-500 px-2 py-0.5 rounded text-white mb-1 inline-block`}>RECOMENDADO</span>
                      <h3 className="text-xl font-bold leading-tight">{result.title}</h3>
                   </div>
                </div>
             </div>
             
             <div className="p-5">
                <p className="text-sm font-medium text-slate-600 leading-relaxed mb-4">
                   {result.desc}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                   {result.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                         #{tag}
                      </span>
                   ))}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                   <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Duração</span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                         <Clock size={12} className="text-blue-500" /> 8-12 Semanas
                      </span>
                   </div>
                   <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Dificuldade</span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                         <Star size={12} className="text-yellow-500" fill="currentColor" /> {result.difficulty}
                      </span>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="text-center mb-2">
               <p className="text-xs text-slate-400">Garanta sua vaga para avaliação presencial</p>
            </div>
            <a 
              href={`https://wa.me/${config.phone}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30 active:scale-95 transition flex justify-center items-center gap-2 hover:bg-green-600 animate-pulse-slow"
            >
              <MessageCircle size={20} />
              Solicitar este Plano
            </a>
            <button 
              onClick={resetQuiz}
              className="w-full text-slate-400 text-xs font-bold py-3 flex items-center justify-center gap-1 hover:text-slate-600"
            >
              <RotateCcw size={12} /> Refazer Diagnóstico
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
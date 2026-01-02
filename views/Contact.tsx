import React from 'react';
import { MapPin, Download, Star, Award, ShieldCheck, Clock, MessageCircle, Instagram, Mail, Phone, CheckCircle2, Quote, Calendar } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';

export const ContactView: React.FC = () => {
  const { config, themeClasses } = useAppConfig();

  const handleExportHtml = () => {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adestrador-app-snapshot.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reviews = [
    { name: "Ana Paula", dog: "Thor", text: `O ${config.professionalName.split(' ')[0]} salvou minha relação com o Thor! Ele parou de destruir o sofá.` },
    { name: "Roberto M.", dog: "Luna", text: "Profissional incrível. O método positivo realmente funciona." },
    { name: "Carla Diaz", dog: "Bolinha", text: "Super paciente e didático. Recomendo para todos." }
  ];

  return (
    <div className="animate-fade-in pb-24 bg-slate-50 min-h-full">
      {/* Header Profile Moderno */}
      <div className="relative bg-slate-900 pb-16 rounded-b-[2.5rem] overflow-hidden shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
            <div className={`absolute right-0 top-0 w-64 h-64 bg-${config.themeColor}-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
            <div className={`absolute left-0 bottom-0 w-64 h-64 bg-${config.themeColor}-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`}></div>
        </div>

        <div className="px-6 pt-8 relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className={`w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-${config.themeColor}-400 to-slate-600`}>
              <img 
                alt={config.professionalName} 
                className="w-full h-full rounded-full border-4 border-slate-900 object-cover bg-white" 
                src={config.profileImage} 
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-4 border-slate-900">
              <ShieldCheck size={16} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white font-brand flex items-center gap-2 justify-center">
            {config.professionalName}
            <span className="text-blue-400"><Award size={18} fill="currentColor" className="text-blue-400"/></span>
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">{config.slogan}</p>
          
          {/* Status Agenda */}
          <div className="mt-4 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Agenda Aberta: Março</span>
          </div>

          <div className="flex gap-3 mt-6 w-full justify-center">
             <button 
                onClick={() => window.open(`https://wa.me/${config.phone}`, '_blank')}
                className="flex-1 max-w-[140px] bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
             >
                <MessageCircle size={16} />
                WhatsApp
             </button>
             <button 
                onClick={() => window.open(config.instagramUrl, '_blank')}
                className="flex-1 max-w-[140px] bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2 border border-slate-700"
             >
                <Instagram size={16} />
                Instagram
             </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-20 space-y-6">
        
        {/* Stats Row */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex justify-between items-center divide-x divide-slate-100">
           <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-slate-800">10+</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Anos Exp.</span>
           </div>
           <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-slate-800">500+</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Alunos</span>
           </div>
           <div className="flex-1 flex flex-col items-center gap-1">
              <div className={`flex items-center gap-1 ${themeClasses.primaryText} font-bold text-2xl`}>
                 4.9 <Star size={16} fill="currentColor" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Avaliação</span>
           </div>
        </div>

        {/* Call to Action Secundário */}
        <div className={`${themeClasses.primary} p-5 rounded-2xl shadow-lg text-white flex items-center justify-between`}>
           <div>
              <h3 className="font-bold text-lg leading-none mb-1">Vamos começar?</h3>
              <p className={`text-xs text-${config.themeColor}-100`}>A transformação começa com o primeiro contato.</p>
           </div>
           <button 
             onClick={() => window.open(`https://wa.me/${config.phone}`, '_blank')}
             className={`bg-white ${themeClasses.primaryText} p-3 rounded-xl hover:bg-slate-50 transition active:scale-95`}
           >
              <Calendar size={24} />
           </button>
        </div>

        {/* Diferenciais */}
        <div>
           <h3 className="font-bold text-slate-800 mb-3 px-1">Por que me escolher?</h3>
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Award size={18} /></div>
                 <div>
                    <span className="block text-xs font-bold text-slate-800">Certificado</span>
                    <span className="text-[10px] text-slate-500">CBKC & Cia</span>
                 </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-lg text-green-600"><CheckCircle2 size={18} /></div>
                 <div>
                    <span className="block text-xs font-bold text-slate-800">Positivo</span>
                    <span className="text-[10px] text-slate-500">Sem punição</span>
                 </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Clock size={18} /></div>
                 <div>
                    <span className="block text-xs font-bold text-slate-800">Pontual</span>
                    <span className="text-[10px] text-slate-500">Respeito total</span>
                 </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><MessageCircle size={18} /></div>
                 <div>
                    <span className="block text-xs font-bold text-slate-800">Suporte</span>
                    <span className="text-[10px] text-slate-500">Pós-aula VIP</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Depoimentos (Scroll Horizontal) */}
        <div>
           <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-slate-800">O que dizem os clientes</h3>
              <span className={`text-xs ${themeClasses.primaryText} font-bold`}>Ver todos</span>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {reviews.map((rev, idx) => (
                 <div key={idx} className={`min-w-[260px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group hover:border-${config.themeColor}-200 transition-colors`}>
                    <Quote size={24} className={`text-slate-100 absolute top-4 right-4 group-hover:text-${config.themeColor}-100 transition-colors`} />
                    <div className="flex items-center gap-1 mb-2">
                       {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-yellow-400" fill="currentColor" />)}
                    </div>
                    <p className="text-xs text-slate-600 italic mb-3 leading-relaxed">"{rev.text}"</p>
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                          {rev.name.charAt(0)}
                       </div>
                       <div>
                          <span className="block text-xs font-bold text-slate-800">{rev.name}</span>
                          <span className="text-[10px] text-slate-400">Dono(a) do {rev.dog}</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Localização */}
        <div>
           <h3 className="font-bold text-slate-800 mb-3 px-1">Onde Atendo</h3>
           <div className="h-48 w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 relative bg-slate-100 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.267568541279!2d-46.66046792376288!3d-23.558830461498154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59cd33c94541%3A0x6790928230587210!2sConjunto%20Nacional%20-%20Av.%20Paulista%2C%202073%20-%20Consola%C3%A7%C3%A3o%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001311-940!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
                title="Mapa Avenida Paulista 2073"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 text-white">
                 <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className={`text-${config.themeColor}-400`} />
                    <span className="font-bold text-sm">{config.locationText.split('-')[0]}</span>
                 </div>
                 <p className="text-xs text-slate-200 pl-6">{config.locationText} (Domicílio)</p>
              </div>
           </div>
        </div>

        {/* Fale Comigo (Form) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Mail size={18} className={themeClasses.primaryText} />
              Envie uma mensagem
           </h3>
           <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Em um SaaS real, isso enviaria um email!'); }}>
             <div className="relative">
                <input 
                  className={`w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-${config.themeColor}-500 focus:outline-none focus:bg-white transition-colors text-slate-900`}
                  placeholder="Seu Nome" 
                  type="text" 
                />
             </div>
             <div className="relative">
                <input 
                  className={`w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-${config.themeColor}-500 focus:outline-none focus:bg-white transition-colors text-slate-900`}
                  placeholder="Seu WhatsApp" 
                  type="tel" 
                />
             </div>
             <div className="relative">
                <textarea 
                  className={`w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-${config.themeColor}-500 focus:outline-none focus:bg-white transition-colors resize-none text-slate-900`}
                  placeholder="Como posso ajudar seu cão?" 
                  rows={3} 
                ></textarea>
             </div>
             <button 
               type="submit" 
               className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition hover:bg-slate-800 flex items-center justify-center gap-2"
             >
               Solicitar Contato
               <Award size={16} />
             </button>
           </form>
        </div>

        {/* Footer Area */}
        <div className="pt-4 pb-4">
          <button 
            onClick={handleExportHtml}
            className="w-full text-slate-400 text-xs font-bold py-3 hover:text-slate-600 transition flex items-center justify-center gap-2 opacity-60 hover:opacity-100"
          >
            <Download size={14} />
            Baixar código fonte (Dev)
          </button>
          <div className="text-center text-[10px] text-slate-300 mt-2">
            © 2024 {config.professionalName} • Powered by TrainerBuilder
          </div>
        </div>

      </div>
    </div>
  );
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppConfig, ServiceDetailData } from '../types';

const DEFAULT_SERVICES: ServiceDetailData[] = [
  {
    id: 'puppy',
    title: "Educação de Filhotes",
    description: "Socialização segura, controle de mordidas e o fim do xixi errado.",
    fullDescription: "A fase de filhote é a mais crítica para o desenvolvimento do cão. Nosso programa foca em prevenir problemas futuros, criando uma base sólida de confiança e comunicação. Ensinamos seu filhote a gostar de ser manuseado, a fazer as necessidades no lugar certo e a interagir bem com o mundo.",
    image: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img11.png",
    tag: "FILHOTES",
    tagColor: "blue",
    benefits: [
      "Educação Sanitária (Xixi e Cocô)",
      "Inibição de mordidas",
      "Socialização com pessoas e barulhos",
      "Prevenção de ansiedade de separação"
    ],
    duration: "8 aulas",
    location: "Domiciliar",
    price: "R$ 1.200,00"
  },
  {
    id: 'obedience',
    title: "Obediência Básica",
    description: "Comandos essenciais e foco.",
    fullDescription: "Ter um cão obediente significa ter mais liberdade. Ensinamos comandos funcionais que servem para a vida real, não apenas truques de circo. Seu cão aprenderá a manter o foco em você mesmo com distrações, tornando os passeios e a convivência em casa muito mais tranquilos.",
    image: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img12.png",
    tag: "POPULAR",
    tagColor: "orange",
    popular: true,
    benefits: [
      "Andar junto sem puxar a guia",
      "Comandos: Senta, Fica, Vem",
      "Controle de impulsos (não pular)",
      "Melhora na comunicação dono-cão"
    ],
    duration: "10 aulas",
    location: "Domiciliar e Parque",
    price: "R$ 1.500,00"
  },
  {
    id: 'behavior',
    title: "Comportamental",
    description: "Reabilitação de agressividade e medos.",
    fullDescription: "Problemas comportamentais sérios exigem conhecimento técnico aprofundado. Trabalhamos a modificação comportamental baseada em desensibilização e contracondicionamento. Ideal para cães reativos, medrosos ou com histórico de agressividade.",
    image: "https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img13.png",
    tag: "REABILITAÇÃO",
    tagColor: "purple",
    benefits: [
      "Análise funcional do comportamento",
      "Redução de reatividade",
      "Tratamento de fobias e medos",
      "Reconstrução do vínculo de confiança"
    ],
    duration: "Sob avaliação",
    location: "Domiciliar",
    price: "Sob Consulta"
  },
  {
    id: 'online',
    title: "Consultoria Online",
    description: "Orientações via videochamada.",
    fullDescription: "Mora longe ou precisa de orientações pontuais? A consultoria online é perfeita para resolver questões específicas, tirar dúvidas sobre rotina, adaptação de novos cães ou correções simples que dependem mais da mudança de atitude do tutor.",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    tag: "ONLINE",
    tagColor: "green",
    benefits: [
      "Atendimento para qualquer lugar do mundo",
      "Gravação da aula para revisão",
      "Material de apoio em PDF",
      "Flexibilidade de horário"
    ],
    duration: "1 hora/sessão",
    location: "Google Meet / Zoom",
    price: "R$ 250,00"
  }
];

const DEFAULT_CONFIG: AppConfig = {
  appName: 'Adestramento Pro',
  professionalName: 'Carlos Eduardo',
  slogan: 'Adestrador Comportamentalista',
  phone: '5511999999999',
  profileImage: 'https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img14.png',
  heroImage: 'https://santanamendes.com.br/imagens/Site_Adestrador/Site_Adestrador_d0_img0.png',
  themeColor: 'orange',
  instagramUrl: 'https://instagram.com',
  locationText: 'São Paulo - SP',
  services: DEFAULT_SERVICES,
  isOnboarded: false // Inicia como falso para novos usuários
};

interface AppConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  resetConfig: () => void;
  themeClasses: {
    primary: string;
    primaryBg: string;
    primaryText: string;
    secondaryBg: string;
    border: string;
    shadow: string;
  }
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  // Load from local storage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('app_config_saas');
    if (savedConfig) {
      // Merge with default ensuring services exist if old config didn't have them
      const parsed = JSON.parse(savedConfig);
      setConfig({ ...DEFAULT_CONFIG, ...parsed });
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('app_config_saas', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const getThemeClasses = (color: string) => {
    return {
      primary: `bg-${color}-500 hover:bg-${color}-600`,
      primaryBg: `bg-${color}-50`,
      primaryText: `text-${color}-500`,
      secondaryBg: `bg-${color}-100`,
      border: `border-${color}-200`,
      shadow: `shadow-${color}-500/30`,
    };
  };

  return (
    <AppConfigContext.Provider value={{ config, updateConfig, resetConfig, themeClasses: getThemeClasses(config.themeColor) }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
};
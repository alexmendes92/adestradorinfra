import { IDENTIFICACAO_DATA } from './data/identificacao';
import { FISICO_DATA } from './data/fisico';
import { ESTATISTICAS_DATA } from './data/estatisticas';
import { SAUDE_DATA } from './data/saude';
import { CONVIVENCIA_DATA } from './data/convivencia';
import { HISTORIA_DATA } from './data/historia';
import { IMAGENS_DATA } from './data/imagens';
import { BreedData } from './types';

const mergeBreeds = (): BreedData[] => {
  return IDENTIFICACAO_DATA.map((item) => {
    const uuid = item.uuid;
    
    // Fallbacks seguros para evitar erros de 'undefined' na renderização
    const fisico = FISICO_DATA.find(f => f.uuid === uuid)?.fisico || { altura: 'N/A', peso: 'N/A', expectativaVida: 'N/A', quedaPelo: 0 };
    const estatisticas = ESTATISTICAS_DATA.find(e => e.uuid === uuid)?.estatisticas || { energia: 0, inteligencia: 0, afeto: 0, guarda: 0, treinabilidade: 0, latidos: 0 };
    const saude = SAUDE_DATA.find(s => s.uuid === uuid)?.saude || { consumoDiario: 'N/A', problemasSaude: 'N/A', manutencao: 'N/A' };
    const convivencia = CONVIVENCIA_DATA.find(c => c.uuid === uuid)?.convivencia || { sociabilidade: 'N/A', adaptacao: 'N/A', apartamento: 'Não', nivelExperiencia: 'Intermediário', problemasComportamento: 'N/A' };
    const historia = HISTORIA_DATA.find(h => h.uuid === uuid)?.historia || { cronologia: [] };
    
    const imagensRaw = IMAGENS_DATA.find(i => i.uuid === uuid)?.imagens;
    // Ensure we provide a valid object if the found image data is empty or missing properties
    const imagens = (imagensRaw && 'img1' in imagensRaw) 
      ? (imagensRaw as any) 
      : { categoria: '', img1: '', img2: '' };

    return {
      identificacao: {
        ...item.identificacao,
        id: uuid
      },
      fisico,
      estatisticas,
      saude,
      convivencia,
      historia,
      imagens
    };
  });
};

export const BREEDS_DB: BreedData[] = mergeBreeds();
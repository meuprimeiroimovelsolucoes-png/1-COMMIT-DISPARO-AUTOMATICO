import { WhatsAppTemplate } from "./types";

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  { 
    id: 'welcome_1', 
    name: 'Boas-vindas', 
    content: 'Olá {{nome}}, sou o corretor e vi seu interesse no imóvel. Posso te ajudar?' 
  },
  { 
    id: 'docs_req', 
    name: 'Solicitação de Documentos', 
    content: 'Olá {{nome}}, para seguirmos com a proposta, preciso dos seguintes documentos: RG, CPF e Comp. Residência.' 
  },
  { 
    id: 'follow_up', 
    name: 'Follow-up (3 dias)', 
    content: 'Oi {{nome}}, conseguiu dar uma olhada nas opções que te enviei?' 
  }
];
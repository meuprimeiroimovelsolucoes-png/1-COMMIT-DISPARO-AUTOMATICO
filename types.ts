export type FunnelStatus = 'prospect' | 'docs_pending' | 'proposal' | 'closed' | 'lost';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  status: FunnelStatus;
  tags: string[];
  lastInteraction: string; // ISO Date
  createdAt: string; // ISO Date
}

export interface FunnelColumn {
  id: FunnelStatus;
  title: string;
  color: string;
}

export interface InteractionHistory {
  id: string;
  leadId: string;
  type: 'WHATSAPP_AUTO' | 'WHATSAPP_MANUAL' | 'NOTE';
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
}

export interface AutomationRule {
  id: string;
  triggerName: string; // Ex: Novo Lead
  actionName: string; // Ex: Enviar Boas-vindas
  description: string;
  templateId: string;
  isActive: boolean;
  icon: 'user-plus' | 'file-text' | 'clock';
}

export const FUNNEL_COLUMNS: FunnelColumn[] = [
  { id: 'prospect', title: 'Prospecção', color: 'border-blue-400' },
  { id: 'docs_pending', title: 'Doc. Pendente', color: 'border-yellow-400' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'border-purple-400' },
  { id: 'closed', title: 'Fechado/Vendido', color: 'border-green-500' },
  { id: 'lost', title: 'Perdido', color: 'border-red-400' },
];
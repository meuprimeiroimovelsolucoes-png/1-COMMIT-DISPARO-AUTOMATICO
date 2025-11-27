import { Lead, FunnelStatus, AutomationRule } from "../types";

// Initial Mock Data
const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Roberto Silva', whatsapp: '5511999991111', email: 'roberto@email.com', status: 'prospect', tags: ['Alto Padrão'], lastInteraction: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '2', name: 'Ana Souza', whatsapp: '5511999992222', email: 'ana@email.com', status: 'docs_pending', tags: ['Investidor'], lastInteraction: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date(Date.now() - 100000000).toISOString() },
  { id: '3', name: 'Carlos Ferreira', whatsapp: '5511999993333', email: 'carlos@email.com', status: 'proposal', tags: ['Minha Casa Minha Vida'], lastInteraction: new Date(Date.now() - 172800000).toISOString(), createdAt: new Date(Date.now() - 200000000).toISOString() },
  { id: '4', name: 'Mariana Lima', whatsapp: '5511999994444', email: 'mari@email.com', status: 'prospect', tags: [], lastInteraction: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '5', name: 'João Santos', whatsapp: '5511999995555', email: 'joao@email.com', status: 'closed', tags: ['VIP'], lastInteraction: new Date().toISOString(), createdAt: new Date().toISOString() },
];

const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'auto_1',
    triggerName: 'Novo Lead Chegou',
    actionName: 'Enviar "Olá, tudo bem?"',
    description: 'Envia uma mensagem de boas-vindas assim que você cadastrar ou importar um cliente.',
    templateId: 'welcome_1',
    isActive: true,
    icon: 'user-plus'
  },
  {
    id: 'auto_2',
    triggerName: 'Mover para "Doc. Pendente"',
    actionName: 'Pedir RG e CPF',
    description: 'Quando você arrastar o card para a coluna amarela, o sistema pede os documentos.',
    templateId: 'docs_req',
    isActive: false,
    icon: 'file-text'
  },
  {
    id: 'auto_3',
    triggerName: '3 Dias na Prospecção',
    actionName: 'Cobrar resposta (Follow-up)',
    description: 'Se o cliente não responder em 3 dias, o sistema manda um "Oi" para reativar.',
    templateId: 'follow_up',
    isActive: true,
    icon: 'clock'
  }
];

export const mockApi = {
  getLeads: async (): Promise<Lead[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...INITIAL_LEADS]), 500);
    });
  },

  getAutomations: async (): Promise<AutomationRule[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...INITIAL_AUTOMATIONS]), 300);
    });
  },

  toggleAutomation: async (id: string): Promise<AutomationRule | null> => {
    return new Promise((resolve) => {
      const rule = INITIAL_AUTOMATIONS.find(a => a.id === id);
      if (rule) {
        rule.isActive = !rule.isActive;
        resolve({ ...rule });
      } else {
        resolve(null);
      }
    });
  },

  updateLeadStatus: async (leadId: string, newStatus: FunnelStatus): Promise<Lead> => {
    return new Promise((resolve) => {
      // Logic would be on backend
      const lead = INITIAL_LEADS.find(l => l.id === leadId);
      if (lead) {
        lead.status = newStatus;
        // Mock Automation Trigger
        console.log(`[BACKEND] Status changed to ${newStatus}. Triggering Celery task for WhatsApp...`);
      }
      setTimeout(() => resolve(lead as Lead), 300);
    });
  },

  sendBulkMessage: async (leadIds: string[], templateId: string): Promise<{ success: boolean, count: number }> => {
    return new Promise((resolve) => {
      console.log(`[BACKEND] Queuing ${leadIds.length} messages with template ${templateId} via Celery/Redis.`);
      setTimeout(() => resolve({ success: true, count: leadIds.length }), 800);
    });
  },

  uploadLeads: async (file: File): Promise<{ added: number, newLeads: Lead[] }> => {
    return new Promise((resolve) => {
      console.log(`[BACKEND] Processing file ${file.name} for E.164 validation.`);
      
      // Simular criação de novos leads a partir do arquivo
      const newLeads: Lead[] = [
        { id: `new_${Date.now()}_1`, name: 'Novo Cliente Planilha 1', whatsapp: '5511988887777', email: 'novo1@email.com', status: 'prospect', tags: ['Importado'], lastInteraction: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: `new_${Date.now()}_2`, name: 'Novo Cliente Planilha 2', whatsapp: '5511988886666', email: 'novo2@email.com', status: 'prospect', tags: ['Importado'], lastInteraction: new Date().toISOString(), createdAt: new Date().toISOString() },
        { id: `new_${Date.now()}_3`, name: 'Novo Cliente Planilha 3', whatsapp: '5511988885555', email: 'novo3@email.com', status: 'prospect', tags: ['Importado'], lastInteraction: new Date().toISOString(), createdAt: new Date().toISOString() },
      ];

      setTimeout(() => resolve({ added: newLeads.length, newLeads }), 1000);
    });
  }
};
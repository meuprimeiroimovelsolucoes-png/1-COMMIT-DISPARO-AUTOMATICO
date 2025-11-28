
import { Lead, FunnelStatus, AutomationRule, Activity } from "../types";

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

// Dados Iniciais de Atividade (Para não começar vazio)
let activities: Activity[] = [
    { id: 'act_1', leadId: '1', type: 'LEAD_IMPORTED', message: 'Lead cadastrado via importação inicial.', timestamp: new Date(Date.now() - 100000).toISOString() },
    { id: 'act_2', leadId: '1', type: 'WHATSAPP_SENT', message: 'Automação: Boas-vindas enviada.', timestamp: new Date(Date.now() - 90000).toISOString() },
    { id: 'act_3', leadId: '2', type: 'STATUS_CHANGE', message: 'Status movido para Doc. Pendente.', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'act_4', leadId: '5', type: 'STATUS_CHANGE', message: 'Venda Fechada! Parabéns.', timestamp: new Date().toISOString() }
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

  createAutomation: async (newRule: Omit<AutomationRule, 'id' | 'isActive'>): Promise<AutomationRule> => {
    return new Promise((resolve) => {
        const rule: AutomationRule = {
            ...newRule,
            id: `auto_${Date.now()}`,
            isActive: true
        };
        INITIAL_AUTOMATIONS.push(rule);
        setTimeout(() => resolve(rule), 500);
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
      }
      setTimeout(() => resolve(lead as Lead), 300);
    });
  },

  updateLeadData: async (updatedLead: Lead): Promise<Lead> => {
    return new Promise((resolve) => {
      const index = INITIAL_LEADS.findIndex(l => l.id === updatedLead.id);
      if (index !== -1) {
        INITIAL_LEADS[index] = updatedLead;
      } else {
        // Se não achar (Lead Novo Manual), adiciona na lista
        INITIAL_LEADS.unshift(updatedLead);
      }
      setTimeout(() => resolve(updatedLead), 400);
    });
  },

  // Simula envio individual (usado no loop de massa)
  sendSingleMessage: async (leadId: string, templateId: string): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), 100);
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
      
      // Adicionar aos dados iniciais para persistir na sessão
      INITIAL_LEADS.push(...newLeads);

      setTimeout(() => resolve({ added: newLeads.length, newLeads }), 1000);
    });
  },

  // --- NOVAS FUNÇÕES PARA O HISTÓRICO DE ATIVIDADES ---
  
  registerActivity: async (activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> => {
    return new Promise(resolve => {
        const newActivity: Activity = { 
            ...activity, 
            id: `act_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            timestamp: new Date().toISOString()
        };
        activities.push(newActivity);
        setTimeout(() => resolve(newActivity), 100); 
    });
  },

  getActivities: async (): Promise<Activity[]> => {
    return new Promise(resolve => {
        // Retorna ordenado do mais recente para o mais antigo
        setTimeout(() => resolve(activities.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())), 150);
    });
  }
};

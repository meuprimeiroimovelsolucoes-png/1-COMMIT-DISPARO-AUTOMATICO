import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Upload, 
  Bell,
  Send,
  CheckCircle,
  X,
  Menu // Importando ícone do Menu
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { Lead, FunnelStatus, FUNNEL_COLUMNS, AutomationRule } from './types';
import { WHATSAPP_TEMPLATES } from './constants';
import { mockApi } from './services/mockApi';

import { KanbanBoard } from './components/KanbanBoard';
import { LeadTable } from './components/LeadTable';
import { StatsCard } from './components/StatsCard';
import { AutomationView } from './components/AutomationView';

enum ViewMode {
  DASHBOARD = 'dashboard',
  LEADS = 'leads',
  AUTOMATION = 'automation'
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(WHATSAPP_TEMPLATES[0].id);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  
  // Novo estado para controlar o menu no celular
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load initial data
    mockApi.getLeads().then(setLeads);
    mockApi.getAutomations().then(setAutomations);
  }, []);

  // Show notification toast
  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleAutomation = async (id: string) => {
    // 1. Optimistic Update (Update UI Immediately)
    setAutomations(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, isActive: !a.isActive };
      }
      return a;
    }));

    try {
      // 2. API Call in background
      const updatedRule = await mockApi.toggleAutomation(id);
      
      // 3. Confirm with Toast
      if (updatedRule) {
        showToast(
          updatedRule.isActive ? 'Automação ativada com sucesso!' : 'Automação desligada.', 
          updatedRule.isActive ? 'success' : 'info'
        );
      }
    } catch (error) {
      // Revert if error
      setAutomations(prev => prev.map(a => {
        if (a.id === id) {
          return { ...a, isActive: !a.isActive };
        }
        return a;
      }));
      showToast('Erro ao alterar status da automação.', 'info');
    }
  };

  // Handle Drag & Drop Status Change (Kanban)
  const handleStatusChange = async (leadId: string, newStatus: FunnelStatus) => {
    // Optimistic Update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    
    // API Call simulation
    await mockApi.updateLeadStatus(leadId, newStatus);
    
    // Check automation rules (simulated logic)
    if (newStatus === 'docs_pending') {
       const rule = automations.find(a => a.id === 'auto_2');
       if (rule && rule.isActive) {
         showToast('Automação Disparada: Solicitando Documentos via WhatsApp', 'success');
       }
    }
  };

  const handleBulkSend = async () => {
    await mockApi.sendBulkMessage(selectedLeadIds, selectedTemplate);
    setShowBulkModal(false);
    showToast(`${selectedLeadIds.length} mensagens enviadas para fila de processamento!`, 'success');
    setSelectedLeadIds([]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const res = await mockApi.uploadLeads(e.target.files[0]);
      showToast(`${res.added} leads importados e validados com sucesso!`, 'success');
    }
  };

  // Stats Calculation
  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'proposal').length,
    closed: leads.filter(l => l.status === 'closed').length,
    conversion: '12%'
  };

  const chartData = FUNNEL_COLUMNS.map(col => ({
    name: col.title.split(' ')[0], // Short name
    count: leads.filter(l => l.status === col.id).length
  }));

  const getPageTitle = () => {
    switch (activeView) {
      case ViewMode.DASHBOARD: return 'Dashboard de Vendas';
      case ViewMode.LEADS: return 'Base de Leads';
      case ViewMode.AUTOMATION: return 'Robô do WhatsApp';
      default: return '';
    }
  };

  // Função auxiliar para fechar menu ao clicar em um item (mobile)
  const handleNavClick = (view: ViewMode) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Agora responsiva */}
      <aside className={`
        fixed md:relative z-30 w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg">
              I
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">ImobCRM</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => handleNavClick(ViewMode.DASHBOARD)}
            className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${activeView === ViewMode.DASHBOARD ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:pl-6'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Funil & Dashboard
          </button>
          <button 
            onClick={() => handleNavClick(ViewMode.LEADS)}
            className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${activeView === ViewMode.LEADS ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:pl-6'}`}
          >
            <Users className="w-5 h-5" />
            Base de Leads
          </button>
          <button 
            onClick={() => handleNavClick(ViewMode.AUTOMATION)}
            className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${activeView === ViewMode.AUTOMATION ? 'bg-green-50 text-green-700 shadow-sm ring-1 ring-green-100' : 'text-gray-600 hover:bg-gray-50 hover:pl-6'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Automações WhatsApp
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex justify-between items-center px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Botão Menu Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-2xl font-bold text-gray-800 truncate">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {activeView === ViewMode.LEADS && selectedLeadIds.length > 0 && (
              <button 
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-colors animate-pulse shadow-green-200 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span className="hidden md:inline">Enviar Mensagem</span> ({selectedLeadIds.length})
              </button>
            )}

            {activeView === ViewMode.LEADS && (
                <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-gray-600 transition-all">
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline">Importar Planilha</span>
                <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleFileUpload} />
                </label>
            )}

            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg shadow-blue-200 transition-transform active:scale-95">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          
          {activeView === ViewMode.DASHBOARD && (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <StatsCard title="Total de Leads" value={stats.total} icon={Users} trend="+5%" trendUp={true} />
                    <StatsCard title="Em Negociação" value={stats.hot} icon={MessageSquare} trend="+2" trendUp={true} />
                    <StatsCard title="Vendas Fechadas" value={stats.closed} icon={CheckCircle} />
                    <StatsCard title="Conversão" value={stats.conversion} icon={LayoutDashboard} trend="-1%" trendUp={false} />
                </div>
                <div className="flex flex-col h-[calc(100vh-320px)]">
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 h-64 flex-shrink-0 hidden md:block">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Visão do Funil</h3>
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={50} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Kanban Section */}
                <div className="flex-1 min-h-0">
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Pipeline de Vendas</h3>
                    <div className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full text-xs">Arraste os cards</div>
                    </div>
                    <KanbanBoard leads={leads} onStatusChange={handleStatusChange} />
                </div>
                </div>
            </>
          )}

          {activeView === ViewMode.LEADS && (
            <LeadTable leads={leads} onSelectionChange={setSelectedLeadIds} />
          )}

          {activeView === ViewMode.AUTOMATION && (
            <AutomationView rules={automations} onToggle={handleToggleAutomation} />
          )}

        </div>
        
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed bottom-8 right-8 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl border transform transition-all duration-300 animate-bounce-in z-50
            ${notification.type === 'success' ? 'bg-white border-green-100 ring-2 ring-green-500' : 'bg-white border-blue-100 ring-2 ring-blue-500'}
          `}>
            <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-base">{notification.type === 'success' ? 'Tudo certo!' : 'Atenção'}</p>
              <p className="text-gray-500 text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Bulk Send Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 animate-fade-in transform scale-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Enviar WhatsApp em Massa</h3>
                    <p className="text-gray-500 mt-1">Isso enviará mensagens para <strong className="text-gray-900">{selectedLeadIds.length} clientes</strong>.</p>
                </div>
                <button onClick={() => setShowBulkModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Escolha a Mensagem</label>
                <div className="space-y-4">
                  {WHATSAPP_TEMPLATES.map((t) => (
                    <label 
                      key={t.id} 
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`block p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplate === t.id ? 'border-green-500 bg-green-50/50' : 'border-gray-100 hover:border-blue-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedTemplate === t.id ? 'border-green-500' : 'border-gray-300'}`}>
                            {selectedTemplate === t.id && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block text-lg">{t.name}</span>
                            <p className="text-sm text-gray-500 mt-1 leading-snug">
                            "{t.content}"
                            </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => setShowBulkModal(false)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleBulkSend}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-200 transition-transform active:scale-95"
                >
                  <Send className="w-5 h-5" />
                  Disparar Mensagens
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
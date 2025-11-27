
import React, { useState, useEffect } from 'react';
import { Lead, Activity } from '../types';
import { X, Save, User, Phone, Mail, Clock, MessageSquare, RefreshCcw, FileText, UserPlus } from 'lucide-react';

interface EditLeadModalProps {
  lead: Lead | null;
  activities: Activity[]; // Recebe o histórico global para filtrar
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLead: Lead) => void;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({ lead, activities, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Lead | null>(null);

  useEffect(() => {
    if (lead) {
      setFormData({ ...lead });
    } else {
      setFormData({
        id: '', 
        name: '',
        whatsapp: '',
        email: '',
        status: 'prospect',
        tags: ['Novo'],
        lastInteraction: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }
  }, [lead, isOpen]);

  if (!isOpen || !formData) return null;

  // Filtrar atividades deste lead específico
  const leadActivities = lead 
    ? activities.filter(a => a.leadId === lead.id)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
        case 'WHATSAPP_SENT': return <MessageSquare className="w-4 h-4 text-green-600" />;
        case 'STATUS_CHANGE': return <RefreshCcw className="w-4 h-4 text-blue-600" />;
        case 'LEAD_IMPORTED': return <UserPlus className="w-4 h-4 text-purple-600" />;
        case 'DATA_EDITED': return <FileText className="w-4 h-4 text-orange-600" />;
        default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch(type) {
        case 'WHATSAPP_SENT': return 'bg-green-100 border-green-200';
        case 'STATUS_CHANGE': return 'bg-blue-100 border-blue-200';
        case 'LEAD_IMPORTED': return 'bg-purple-100 border-purple-200';
        case 'DATA_EDITED': return 'bg-orange-100 border-orange-200';
        default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Lado Esquerdo: Formulário */}
        <div className="flex-1 flex flex-col min-w-[320px]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">{lead ? 'Ficha do Cliente' : 'Novo Cadastro'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors md:hidden">
                <X className="w-5 h-5" />
            </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nome Completo</label>
                <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    required
                    placeholder="Ex: Maria Silva"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">WhatsApp</label>
                <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    required
                    placeholder="Ex: 11999990000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
                <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="email" 
                    placeholder="Ex: maria@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                </div>
            </div>

            <div className="pt-4 flex gap-3">
                <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                Cancelar
                </button>
                <button 
                type="submit" 
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                <Save className="w-5 h-5" />
                Salvar
                </button>
            </div>
            </form>
        </div>

        {/* Lado Direito: Histórico (Timeline) */}
        {lead && (
            <div className="w-full md:w-80 bg-gray-50 border-l border-gray-100 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-100/50">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Histórico de Atividades</h3>
                    <button onClick={onClose} className="hidden md:block p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    {leadActivities.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">
                            <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Nenhuma atividade registrada.</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                            {leadActivities.map((activity) => (
                                <div key={activity.id} className="relative pl-6">
                                    {/* Bolinha na linha do tempo */}
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                        {/* Pequeno ponto interno opcional */}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`p-1 rounded-md ${getActivityColor(activity.type)}`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-700 font-medium leading-snug">
                                        {activity.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

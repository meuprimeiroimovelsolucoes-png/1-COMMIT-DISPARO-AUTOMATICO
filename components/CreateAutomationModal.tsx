
import React, { useState } from 'react';
import { X, Save, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import { AutomationRule } from '../types';
import { WHATSAPP_TEMPLATES } from '../constants';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRule: Omit<AutomationRule, 'id' | 'isActive'>) => void;
}

export const CreateAutomationModal: React.FC<CreateAutomationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [trigger, setTrigger] = useState('new_lead');
  const [templateId, setTemplateId] = useState(WHATSAPP_TEMPLATES[0].id);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Constrói o nome da regra baseado nas escolhas
    const triggerName = trigger === 'new_lead' ? 'Novo Lead Chegou' : 'Mudança de Status';
    const selectedTemplate = WHATSAPP_TEMPLATES.find(t => t.id === templateId);
    const actionName = `Enviar "${selectedTemplate?.name}"`;
    
    onSave({
        triggerName,
        actionName,
        description: description || `Envia mensagem automática quando ocorrer: ${triggerName}`,
        templateId,
        icon: trigger === 'new_lead' ? 'user-plus' : 'file-text'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Criar Novo Robô</h3>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Gatilho */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Passo 1: Quando isso acontecer...</label>
                <select 
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                >
                    <option value="new_lead">Novo Lead Cadastrado (Importação ou Manual)</option>
                    <option value="status_change">Cliente mudou de fase no Funil</option>
                </select>
            </div>

            <div className="flex justify-center text-gray-300">
                <ArrowRight className="w-6 h-6 rotate-90" />
            </div>

            {/* Ação */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Passo 2: O Robô deve fazer isso...</label>
                <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <select 
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-700"
                    >
                        {WHATSAPP_TEMPLATES.map(t => (
                            <option key={t.id} value={t.id}>Enviar WhatsApp: {t.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Descrição Opcional */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nome da Regra (Opcional)</label>
                <input 
                    type="text" 
                    placeholder="Ex: Boas-vindas para investidores"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="pt-2 flex gap-3">
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
                Criar Robô
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};

import React from 'react';
import { AutomationRule } from '../types';
import { UserPlus, FileText, Clock, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';

interface AutomationViewProps {
  rules: AutomationRule[];
  onToggle: (id: string) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({ rules, onToggle }) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-plus': return UserPlus;
      case 'file-text': return FileText;
      case 'clock': return Clock;
      default: return UserPlus;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl mb-8 flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
           <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-blue-900 mb-1">Como funciona a Automação?</h2>
          <p className="text-blue-800 leading-relaxed">
            Aqui você define as regras. Quando algo acontecer (Gatilho), o sistema envia uma mensagem automaticamente (Ação).
            Use os botões para ligar ou desligar cada regra.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {rules.map((rule) => {
          const Icon = getIcon(rule.icon);
          
          return (
            <div 
              key={rule.id} 
              className={`
                relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                ${rule.isActive 
                  ? 'border-green-500 bg-white shadow-lg scale-[1.01]' 
                  : 'border-gray-200 bg-gray-50 opacity-80'
                }
              `}
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                
                {/* Ícone e Gatilho */}
                <div className="flex flex-col items-center md:items-start min-w-[200px] text-center md:text-left">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-3
                    ${rule.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">QUANDO:</span>
                  <h3 className="font-bold text-lg text-gray-800">{rule.triggerName}</h3>
                </div>

                {/* Seta Visual */}
                <div className="hidden md:flex justify-center text-gray-300">
                  <ArrowRight className="w-8 h-8" />
                </div>

                {/* Ação e Descrição */}
                <div className="flex-1 text-center md:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">O SISTEMA VAI:</span>
                  <h3 className={`font-bold text-lg mb-2 ${rule.isActive ? 'text-green-700' : 'text-gray-700'}`}>
                    {rule.actionName}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    "{rule.description}"
                  </p>
                </div>

                {/* Botão Ligar/Desligar */}
                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                  <button 
                    onClick={() => onToggle(rule.id)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                    title={rule.isActive ? "Desligar Automação" : "Ligar Automação"}
                  >
                    {rule.isActive ? (
                      <ToggleRight className="w-16 h-16 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-16 h-16 text-gray-300" />
                    )}
                  </button>
                  <span className={`font-bold text-sm ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {rule.isActive ? 'LIGADO' : 'DESLIGADO'}
                  </span>
                </div>

              </div>
              
              {/* Barra de Status Inferior */}
              {rule.isActive && (
                <div className="bg-green-50 p-2 text-center text-xs font-medium text-green-700 border-t border-green-100">
                  Automação ativa e funcionando
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
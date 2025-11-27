
import React, { useState, useEffect } from 'react';
import { X, Save, Smartphone, Key, ShieldCheck, AlertTriangle, Phone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [instanceName, setInstanceName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Novo estado para o número
  const [simulationMode, setSimulationMode] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Carregar do cofre (localStorage) quando abrir
      const storedKey = localStorage.getItem('whatsapp_api_key') || '';
      const storedInstance = localStorage.getItem('whatsapp_instance') || '';
      const storedPhone = localStorage.getItem('whatsapp_phone') || '';
      const storedSim = localStorage.getItem('whatsapp_simulation_mode');
      
      setApiKey(storedKey);
      setInstanceName(storedInstance);
      setPhoneNumber(storedPhone);
      setSimulationMode(storedSim === 'false' ? false : true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Salvar no cofre
    localStorage.setItem('whatsapp_api_key', apiKey);
    localStorage.setItem('whatsapp_instance', instanceName);
    localStorage.setItem('whatsapp_phone', phoneNumber);
    localStorage.setItem('whatsapp_simulation_mode', String(simulationMode));
    
    // Dispara um evento para o App atualizar o número na tela sem recarregar
    window.dispatchEvent(new Event('storage'));
    
    alert('Configurações salvas no seu navegador com segurança!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[90] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div className="flex items-center gap-2">
                <div className="bg-gray-200 p-2 rounded-lg text-gray-700">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Configurar WhatsApp</h3>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                    Esses dados ficam salvos <strong>apenas no seu navegador</strong>. Nunca compartilhe sua API Key publicamente.
                </p>
            </div>

            {/* Campo do Número (Seguro) */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Seu WhatsApp (Remetente)</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Ex: 71993217575"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
            </div>

            {/* Modo Simulação */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSimulationMode(!simulationMode)}>
                <div>
                    <span className="font-bold text-gray-800 block">Modo Simulação</span>
                    <span className="text-xs text-gray-500">Testar sem enviar mensagem real</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${simulationMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${simulationMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>

            {!simulationMode && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Instance Name (API)</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Ex: MinhaInstancia"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={instanceName}
                                onChange={(e) => setInstanceName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">API Token (Chave Secreta)</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" 
                                placeholder="Coloque sua chave aqui..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-2">
                <button 
                type="submit" 
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-gray-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                <Save className="w-5 h-5" />
                Salvar Configurações
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};

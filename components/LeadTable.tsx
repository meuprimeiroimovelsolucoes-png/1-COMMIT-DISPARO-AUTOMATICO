
import React, { useState } from 'react';
import { Lead, FUNNEL_COLUMNS } from '../types';
import { Search, Filter, MoreHorizontal, Trash2, Edit, X, MessageCircle } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onSelectionChange: (selectedIds: string[]) => void;
  onDeleteLead?: (id: string) => void;
  onEditLead?: (lead: Lead) => void;
  onWhatsAppClick?: (lead: Lead) => void; // Nova Prop
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onSelectionChange, onDeleteLead, onEditLead, onWhatsAppClick }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para os menus e filtros
  const [activeMenuLeadId, setActiveMenuLeadId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    onSelectionChange(Array.from(newSelected));
  };

  const getStatusLabel = (statusId: string) => {
    const col = FUNNEL_COLUMNS.find(c => c.id === statusId);
    return col ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${col.color.replace('border-', 'text-').replace('400', '600')} bg-white`}>
        {col.title}
      </span>
    ) : statusId;
  };

  // Filtragem dos leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.whatsapp.includes(searchTerm);
    const matchesFilter = statusFilter === 'all' || l.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Lógica corrigida para selecionar apenas os visíveis/filtrados
  const toggleSelectAll = () => {
    const visibleIds = filteredLeads.map(l => l.id);
    const allVisibleSelected = visibleIds.every(id => selectedIds.has(id));

    if (allVisibleSelected) {
      // Se todos os visíveis estão selecionados, desseleciona eles
      const newSelected = new Set(selectedIds);
      visibleIds.forEach(id => newSelected.delete(id));
      setSelectedIds(newSelected);
      onSelectionChange(Array.from(newSelected));
    } else {
      // Caso contrário, seleciona todos os visíveis
      const newSelected = new Set(selectedIds);
      visibleIds.forEach(id => newSelected.add(id));
      setSelectedIds(newSelected);
      onSelectionChange(Array.from(newSelected));
    }
  };

  const isAllVisibleSelected = filteredLeads.length > 0 && filteredLeads.every(l => selectedIds.has(l.id));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible min-h-[500px] flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 z-20 relative">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${isFilterOpen || statusFilter !== 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Filter className="w-4 h-4" />
            {statusFilter === 'all' ? 'Filtros' : 'Filtro Ativo'}
            {(isFilterOpen || statusFilter !== 'all') && <div className="w-2 h-2 rounded-full bg-blue-500 ml-1"></div>}
          </button>

          {/* Menu Dropdown de Filtros */}
          {isFilterOpen && (
            <>
            <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)}></div>
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-30 p-2 animate-fade-in">
              <div className="flex justify-between items-center px-2 py-1 mb-2 border-b border-gray-50">
                 <span className="text-xs font-bold text-gray-400 uppercase">Filtrar por Status</span>
                 <button onClick={() => setIsFilterOpen(false)}><X className="w-3 h-3 text-gray-400 hover:text-red-500"/></button>
              </div>
              <button 
                onClick={() => { setStatusFilter('all'); setIsFilterOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${statusFilter === 'all' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                Ver Todos
              </button>
              {FUNNEL_COLUMNS.map(col => (
                <button 
                  key={col.id}
                  onClick={() => { setStatusFilter(col.id); setIsFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 flex items-center gap-2 ${statusFilter === col.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${col.color.replace('border-', 'bg-').replace('400', '500')}`}></div>
                  {col.title}
                </button>
              ))}
            </div>
            </>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto flex-1 pb-32">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-medium">
            <tr>
              <th className="px-6 py-3 w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={isAllVisibleSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-3">Lead / Cliente</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">WhatsApp</th>
              <th className="px-6 py-3">Última Interação</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(lead.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.has(lead.id)}
                    onChange={() => toggleSelect(lead.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-400">{lead.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusLabel(lead.status)}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {lead.whatsapp}
                </td>
                <td className="px-6 py-4 text-xs">
                  {new Date(lead.lastInteraction).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right relative flex items-center justify-end gap-2">
                  {/* Botão de WhatsApp Manual */}
                  <button
                    onClick={() => onWhatsAppClick && onWhatsAppClick(lead)}
                    className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors border border-transparent hover:border-green-100"
                    title="Abrir WhatsApp Web"
                  >
                     <MessageCircle className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={() => setActiveMenuLeadId(activeMenuLeadId === lead.id ? null : lead.id)}
                    className={`p-2 rounded-full transition-colors ${activeMenuLeadId === lead.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Menu de Ações */}
                  {activeMenuLeadId === lead.id && (
                    <>
                      <div className="fixed inset-0 z-10 cursor-default" onClick={() => setActiveMenuLeadId(null)}></div>
                      <div className="absolute right-8 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-bounce-in origin-top-right">
                        <button 
                            onClick={() => {
                                if (onEditLead) onEditLead(lead);
                                setActiveMenuLeadId(null);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                          Editar
                        </button>
                        <button 
                            onClick={() => {
                                if (onDeleteLead) onDeleteLead(lead.id);
                                setActiveMenuLeadId(null);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
               <tr>
                 <td colSpan={6} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 opacity-20" />
                        <p>Nenhum lead encontrado com este filtro.</p>
                        {statusFilter !== 'all' && (
                            <button onClick={() => setStatusFilter('all')} className="text-blue-500 font-bold hover:underline">Limpar Filtros</button>
                        )}
                    </div>
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

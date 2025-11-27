import React, { useState } from 'react';
import { Lead, FUNNEL_COLUMNS } from '../types';
import { Search, MessageSquare, Filter, MoreHorizontal } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onSelectionChange }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

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

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      const allIds = new Set(leads.map(l => l.id));
      setSelectedIds(allIds);
      onSelectionChange(Array.from(allIds));
    }
  };

  const getStatusLabel = (statusId: string) => {
    const col = FUNNEL_COLUMNS.find(c => c.id === statusId);
    return col ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${col.color.replace('border-', 'text-').replace('400', '600')} bg-white`}>
        {col.title}
      </span>
    ) : statusId;
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.whatsapp.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
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
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-medium">
            <tr>
              <th className="px-6 py-3 w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedIds.size === leads.length && leads.length > 0}
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
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
               <tr>
                 <td colSpan={6} className="text-center py-8 text-gray-400">Nenhum lead encontrado</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
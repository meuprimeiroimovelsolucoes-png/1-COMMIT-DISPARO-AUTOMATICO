import React, { useState } from 'react';
import { Lead, FunnelColumn, FUNNEL_COLUMNS, FunnelStatus } from '../types';
import { MessageCircle, MoreVertical, Clock, DollarSign } from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: FunnelStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, onStatusChange }) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: FunnelStatus) => {
    e.preventDefault();
    if (draggedLeadId) {
      onStatusChange(draggedLeadId, targetStatus);
      setDraggedLeadId(null);
    }
  };

  return (
    <div className="flex h-full overflow-x-auto pb-4 gap-6 kanban-scroll">
      {FUNNEL_COLUMNS.map((col) => {
        const colLeads = leads.filter((l) => l.status === col.id);
        
        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-80 flex flex-col bg-gray-50 rounded-xl border border-gray-200 h-full max-h-[calc(100vh-200px)]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className={`p-4 border-b-2 bg-white rounded-t-xl ${col.color} sticky top-0 z-10`}>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">{col.title}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                  {colLeads.length}
                </span>
              </div>
            </div>

            {/* Droppable Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[150px]">
              {colLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {lead.tags[0] || 'Lead'}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1">{lead.name}</h4>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>2 dias atrás</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                        {lead.name.charAt(0)}
                      </div>
                    </div>
                    <button 
                      className="text-green-600 hover:bg-green-50 p-1.5 rounded-full transition-colors"
                      title="Abrir WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {colLeads.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-4">
                  <p className="text-sm">Arraste leads aqui</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
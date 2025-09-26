import React, { useState } from 'react';
import { Task, Contact } from '../types';
import { X, Search, Filter, Edit3, Trash2, Calendar, User, AlertCircle, Expand, Paperclip } from 'lucide-react';

interface ExpandedTaskViewProps {
  column: string;
  tasks: Task[];
  contacts: Contact[];
  onClose: () => void;
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  isFullScreen?: boolean;
}

const columnTitles = {
  'não-iniciado': 'Não Iniciado',
  'em-andamento': 'Em Andamento',
  'concluído': 'Concluído',
  'interrompido': 'Interrompido',
  'all': 'Todas as Tarefas',
};

const priorityColors = {
  'baixa': 'bg-green-100 text-green-800',
  'média': 'bg-yellow-100 text-yellow-800',
  'alta': 'bg-orange-100 text-orange-800',
};

const priorityColorsDark = {
  'baixa': 'bg-green-900/30 text-green-300',
  'média': 'bg-yellow-900/30 text-yellow-300',
  'alta': 'bg-orange-900/30 text-orange-300',
};
const statusColors = {
  'não-iniciado': 'bg-gray-100 text-gray-800',
  'em-andamento': 'bg-blue-100 text-blue-800',
  'concluído': 'bg-green-100 text-green-800',
  'interrompido': 'bg-orange-100 text-orange-800',
};

const statusColorsDark = {
  'não-iniciado': 'bg-gray-700 text-gray-300',
  'em-andamento': 'bg-blue-900/30 text-blue-300',
  'concluído': 'bg-green-900/30 text-green-300',
  'interrompido': 'bg-orange-900/30 text-orange-300',
};
export function ExpandedTaskView({ 
  column, 
  tasks, 
  contacts, 
  onClose, 
  onTaskClick, 
  onTaskUpdate, 
  onTaskDelete,
  isFullScreen = false
}: ExpandedTaskViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [contactFilter, setContactFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'priority' | 'dueDate' | 'lastUpdated'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  const handlePriorityToggle = (priority: string) => {
    if (priorityFilter.includes(priority)) {
      setPriorityFilter(priorityFilter.filter(p => p !== priority));
    } else {
      setPriorityFilter([...priorityFilter, priority]);
    }
  };

  const handleContactToggle = (contactId: string) => {
    if (contactFilter.includes(contactId)) {
      setContactFilter(contactFilter.filter(c => c !== contactId));
    } else {
      setContactFilter([...contactFilter, contactId]);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
      const matchesContact = contactFilter.length === 0 || (task.contactId && contactFilter.includes(task.contactId));
      
      return matchesSearch && matchesPriority && matchesContact;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = ['alta', 'média', 'baixa'];
          comparison = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        default:
          // Ordenação padrão por prioridade quando nenhum campo específico é selecionado
          const defaultPriorityOrder = ['alta', 'média', 'baixa'];
          comparison = defaultPriorityOrder.indexOf(a.priority) - defaultPriorityOrder.indexOf(b.priority);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className={isFullScreen 
      ? (theme === 'escuro' ? "bg-gray-900 overflow-hidden" : "bg-white overflow-hidden")
      : (theme === 'escuro' ? "fixed inset-0 bg-gray-900 z-50 overflow-hidden" : "fixed inset-0 bg-white z-50 overflow-hidden")
    }>
      <div className="h-full flex flex-col">
        {/* Header */}
        {!isFullScreen && (
          <div className={`border-b p-6 ${
            theme === 'escuro' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${
                theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {columnTitles[column as keyof typeof columnTitles]} - Visualização Expandida
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'escuro'
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="flex gap-4">
                <div className="relative">
                  <select
                    multiple
                    value={priorityFilter}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setPriorityFilter(values);
                    }}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-40 ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    size={3}
                  >
                    <option value="alta">Alta</option>
                    <option value="média">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                  <label className={`absolute -top-2 left-2 px-1 text-xs ${
                    theme === 'escuro' 
                      ? 'bg-gray-800 text-gray-400' 
                      : 'bg-white text-gray-600'
                  }`}>
                    Prioridades ({priorityFilter.length})
                  </label>
                </div>

                <div className="relative">
                  <select
                    multiple
                    value={contactFilter}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setContactFilter(values);
                    }}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-48 ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    size={4}
                  >
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                  <label className={`absolute -top-2 left-2 px-1 text-xs ${
                    theme === 'escuro' 
                      ? 'bg-gray-800 text-gray-400' 
                      : 'bg-white text-gray-600'
                  }`}>
                    Contatos ({contactFilter.length})
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Table */}
        <div className={`flex-1 overflow-auto ${isFullScreen ? 'mt-6' : 'p-6'}`}>
          <div className={`rounded-lg border overflow-hidden ${
            theme === 'escuro' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <table className="w-full">
              <thead className={theme === 'escuro' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                      theme === 'escuro'
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSort('title')}
                  >
                    Título {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                      theme === 'escuro'
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSort('priority')}
                  >
                    Prioridade {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  {column === 'all' && (
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                  )}
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Contato
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Anexos
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                      theme === 'escuro'
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSort('dueDate')}
                  >
                    Data Conclusão {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                      theme === 'escuro'
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSort('lastUpdated')}
                  >
                    Última Atualização {sortBy === 'lastUpdated' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'escuro' 
                  ? 'bg-gray-800 divide-gray-700' 
                  : 'bg-white divide-gray-200'
              }`}>
                {filteredAndSortedTasks.map(task => {
                  const taskContacts = contacts.filter(c => task.contactIds.includes(c.id));
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'concluído';
                  
                  return (
                    <tr 
                      key={task.id} 
                      className={`cursor-pointer ${
                        theme === 'escuro'
                          ? `hover:bg-gray-700 ${isOverdue ? 'bg-red-900/20' : ''}`
                          : `hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`
                      }`}
                      onClick={() => onTaskClick(task)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`text-sm font-medium ${
                            theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                          }`}>{task.title}</div>
                          {isOverdue && <AlertCircle className={`w-4 h-4 ml-2 ${
                            theme === 'escuro' ? 'text-red-400' : 'text-red-500'
                          }`} />}
                        </div>
                        {task.notes && (
                          <div className={`text-sm truncate max-w-xs ${
                            theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                          }`}>{task.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          theme === 'escuro' ? priorityColorsDark[task.priority] : priorityColors[task.priority]
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      {column === 'all' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.isInterrupted ? 'bg-gray-200 text-gray-600' : statusColors[task.status]
                          } ${
                            theme === 'escuro' && !task.isInterrupted ? statusColorsDark[task.status] : ''
                          }`}>
                            {task.isInterrupted ? 'Interrompido' : task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.replace('-', ' ').slice(1)}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {taskContacts.length > 0 ? (
                            <>
                              <User className={`w-4 h-4 mr-2 ${
                                theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                              }`} />
                              <div>
                                {taskContacts.map((contact, index) => (
                                  <div key={contact.id}>
                                    <div className={`text-sm font-medium ${
                                      theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                                    }`}>{contact.name}</div>
                                    {contact.institution && (
                                      <div className={`text-sm ${
                                        theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                                      }`}>{contact.institution}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <span className={`text-sm ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Nenhum contato</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {task.attachments.length > 0 ? (
                            <>
                              <Paperclip className={`w-4 h-4 mr-2 ${
                                theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                              }`} />
                              <span className={`text-sm ${
                                theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                              }`}>
                                {task.attachments.length} arquivo{task.attachments.length !== 1 ? 's' : ''}
                              </span>
                            </>
                          ) : (
                            <span className={`text-sm ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Nenhum anexo</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className={`w-4 h-4 mr-2 ${
                            theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm ${
                            isOverdue 
                              ? (theme === 'escuro' ? 'text-red-400 font-medium' : 'text-red-600 font-medium')
                              : (theme === 'escuro' ? 'text-gray-100' : 'text-gray-900')
                          }`}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Não definida'}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {new Date(task.lastUpdated).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task);
                            }}
                            className={theme === 'escuro' 
                              ? 'text-blue-400 hover:text-blue-300' 
                              : 'text-blue-600 hover:text-blue-900'
                            }
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
                                onTaskDelete(task.id);
                              }
                            }}
                            className={theme === 'escuro' 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-red-600 hover:text-red-900'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredAndSortedTasks.length === 0 && (
              <div className="text-center py-12">
                <p className={theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'}>
                  Nenhuma tarefa encontrada
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
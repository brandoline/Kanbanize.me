import React, { useState, useRef, useEffect } from 'react';
import { Contact } from '../types';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priorityFilter: string[];
  setPriorityFilter: (priority: string[]) => void;
  statusFilter: string[];
  setStatusFilter: (status: string[]) => void;
  contactFilter: string[];
  setContactFilter: (contact: string[]) => void;
  contacts: Contact[];
}

interface DropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  color: string;
}

function FilterDropdown({ label, options, selectedValues, onSelectionChange, placeholder, color }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selecionados`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-w-[140px] px-3 py-2 text-left border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          theme === 'escuro'
            ? selectedValues.length > 0 
              ? 'bg-blue-900/30 border-blue-600 text-blue-300 hover:bg-blue-900/40'
              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            : selectedValues.length > 0 
              ? 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm truncate ${
            selectedValues.length > 0 
              ? theme === 'escuro' ? 'font-medium text-blue-300' : 'font-medium text-blue-900'
              : theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {getDisplayText()}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
          }`} />
        </div>
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto ${
          theme === 'escuro' 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-2">
            <div className={`text-xs font-medium uppercase tracking-wide px-2 py-1 mb-1 ${
              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {label}
            </div>
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center px-2 py-2 rounded cursor-pointer transition-colors ${
                  theme === 'escuro' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => handleToggleOption(option.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                    selectedValues.includes(option.value)
                      ? `${color} border-transparent`
                      : theme === 'escuro'
                        ? 'border-gray-500 bg-gray-700'
                        : 'border-gray-300 bg-white'
                  }`}>
                    {selectedValues.includes(option.value) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className={`ml-3 text-sm ${
                  theme === 'escuro' ? 'text-gray-200' : 'text-gray-900'
                }`}>{option.label}</span>
              </label>
            ))}
            
            {selectedValues.length > 0 && (
              <div className={`border-t mt-2 pt-2 ${
                theme === 'escuro' ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <button
                  onClick={() => onSelectionChange([])}
                  className={`w-full px-2 py-1 text-xs rounded transition-colors ${
                    theme === 'escuro'
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Limpar seleção
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  contactFilter,
  setContactFilter,
  contacts
}: SearchFiltersProps) {
  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  const priorityOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'média', label: 'Média' },
    { value: 'baixa', label: 'Baixa' }
  ];

  const statusOptions = [
    { value: 'não-iniciado', label: 'Não iniciado' },
    { value: 'em-andamento', label: 'Em andamento' },
    { value: 'concluído', label: 'Concluído' }
  ];

  const contactOptions = contacts.map(contact => ({
    value: contact.id,
    label: contact.name
  }));

  const hasActiveFilters = priorityFilter.length > 0 || statusFilter.length > 0 || contactFilter.length > 0;

  const clearAllFilters = () => {
    setPriorityFilter([]);
    setStatusFilter([]);
    setContactFilter([]);
  };

  return (
    <div className={`rounded-lg border p-4 space-y-4 ${
      theme === 'escuro' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
            theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Buscar tarefas por título ou observações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              theme === 'escuro'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'escuro' 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          {/* Priority Filter */}
          <FilterDropdown
            label="Prioridades"
            options={priorityOptions}
            selectedValues={priorityFilter}
            onSelectionChange={setPriorityFilter}
            placeholder="Todas as prioridades"
            color="bg-blue-500"
          />

          {/* Status Filter */}
          <FilterDropdown
            label="Status"
            options={statusOptions}
            selectedValues={statusFilter}
            onSelectionChange={setStatusFilter}
            placeholder="Todos os status"
            color="bg-green-500"
          />

          {/* Contact Filter */}
          {contacts.length > 0 && (
            <FilterDropdown
              label="Contatos"
              options={contactOptions}
              selectedValues={contactFilter}
              onSelectionChange={setContactFilter}
              placeholder="Todos os contatos"
              color="bg-purple-500"
            />
          )}

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                theme === 'escuro'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <X className="w-4 h-4 mr-1" />
              Limpar Tudo
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className={`flex flex-wrap gap-2 pt-2 border-t ${
          theme === 'escuro' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <span className={`text-xs font-medium flex items-center ${
            theme === 'escuro' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Filter className="w-3 h-3 mr-1" />
            Filtros ativos:
          </span>
          {priorityFilter.map(priority => (
            <span key={priority} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Prioridade: {priority.charAt(0).toUpperCase() + priority.slice(1)}
              <button
                onClick={() => setPriorityFilter(priorityFilter.filter(p => p !== priority))}
                className="ml-1 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {statusFilter.map(status => (
            <span key={status} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Status: {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
              <button
                onClick={() => setStatusFilter(statusFilter.filter(s => s !== status))}
                className="ml-1 hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {contactFilter.map(contactId => {
            const contact = contacts.find(c => c.id === contactId);
            return contact ? (
              <span key={contactId} className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Contato: {contact.name}
                <button
                  onClick={() => setContactFilter(contactFilter.filter(c => c !== contactId))}
                  className="ml-1 hover:text-purple-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
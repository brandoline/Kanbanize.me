import React from 'react';
import { Task, Contact, InfoTec } from '../types';
import { Calendar, User, AlertCircle, Clock, GraduationCap, RotateCcw, Paperclip } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  contacts: Contact[];
  infoTecs?: InfoTec[];
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onReactivate?: (task: Task) => void;
}

const priorityColors = {
  'baixa': 'bg-green-100 text-green-800 border-green-200',
  'média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'alta': 'bg-orange-100 text-orange-800 border-orange-200',
};

const priorityColorsDark = {
  'baixa': 'bg-green-900/30 text-green-300 border-green-700',
  'média': 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
  'alta': 'bg-orange-900/30 text-orange-300 border-orange-700',
};
export function TaskCard({ task, contacts, infoTecs = [], onClick, onDragStart, onDragEnd, onReactivate }: TaskCardProps) {
  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  const taskContacts = contacts.filter(c => task.contactIds.includes(c.id));
  const facultyCourse = taskContacts.find(c => c.isFaculty && c.courses && c.courses.length > 0)?.courses?.[0]
    ? infoTecs.find(course => course.id === taskContacts.find(c => c.isFaculty && c.courses && c.courses.length > 0)?.courses?.[0]) 
    : null;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'concluído';
  const isInterrupted = task.isInterrupted;

  return (
    <div
      className={`rounded-lg shadow-sm border-2 p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
        theme === 'escuro' 
          ? `bg-gray-800 ${isOverdue ? 'border-red-600 bg-red-900/20' : ''} ${isInterrupted ? 'opacity-60 bg-gray-700' : ''}`
          : `bg-white ${isOverdue ? 'border-red-300 bg-red-50' : ''} ${isInterrupted ? 'opacity-60 bg-gray-100' : ''}`
      } ${
        theme === 'escuro' ? 'hover:bg-gray-750' : ''
      }`}
      style={{
        borderColor: isOverdue ? undefined : (facultyCourse ? `${facultyCourse.color}40` : '#E5E7EB'),
        borderLeftWidth: facultyCourse ? '4px' : '2px',
        borderLeftColor: facultyCourse ? facultyCourse.color : undefined
      }}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-semibold text-sm leading-tight ${
          theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
        }`}>{task.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
          theme === 'escuro' ? priorityColorsDark[task.priority] : priorityColors[task.priority]
        }`}>
          {task.priority}
        </span>
      </div>

      {taskContacts.length > 0 && (
        <div className={`flex items-center mb-2 ${
          theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {taskContacts.some(c => c.isFaculty) ? (
            <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
          ) : (
            <User className={`w-4 h-4 mr-2 ${
              theme === 'escuro' ? 'text-gray-400' : 'text-gray-600'
            }`} />
          )}
          <div className="flex flex-wrap gap-1">
            {taskContacts.map((contact, index) => (
              <span key={contact.id} className="text-sm">
                {contact.name}
                {index < taskContacts.length - 1 && ', '}
              </span>
            ))}
          </div>
          {taskContacts.some(c => c.isFaculty) && (
            <span className={`ml-2 text-xs px-1 py-0.5 rounded ${
              theme === 'escuro' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
            }`}>
              {taskContacts.filter(c => c.isFaculty).length > 1 ? 'Docentes' : 'Docente'}
            </span>
          )}
        </div>
      )}

      {task.dueDate && (
        <div className={`flex items-center mb-2 ${
          isOverdue 
            ? (theme === 'escuro' ? 'text-red-400' : 'text-red-600')
            : (theme === 'escuro' ? 'text-gray-300' : 'text-gray-600')
        }`}>
          <Calendar className={`w-4 h-4 mr-2 ${
            isOverdue 
              ? (theme === 'escuro' ? 'text-red-400' : 'text-red-600')
              : (theme === 'escuro' ? 'text-gray-400' : 'text-gray-600')
          }`} />
          <span className="text-sm">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
          {isOverdue && <AlertCircle className={`w-4 h-4 ml-2 ${
            theme === 'escuro' ? 'text-red-400' : 'text-red-500'
          }`} />}
        </div>
      )}

      {/* Indicador de anexos */}
      {task.attachments.length > 0 && (
        <div className={`flex items-center mb-2 ${
          theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Paperclip className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {task.attachments.length} anexo{task.attachments.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      <div className={`flex items-center text-xs ${
        theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Clock className="w-3 h-3 mr-1" />
        <span>Atualizado: {new Date(task.lastUpdated).toLocaleDateString('pt-BR')}</span>
      </div>

      {/* Botão de reativar para tarefas interrompidas */}
      {isInterrupted && onReactivate && (
        <div className={`mt-3 pt-3 border-t ${
          theme === 'escuro' ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Tem certeza de que deseja reativar esta tarefa?')) {
                onReactivate(task);
              }
            }}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${
              theme === 'escuro' 
                ? 'bg-green-900/30 text-green-300 hover:bg-green-900/40' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reativar Tarefa
          </button>
        </div>
      )}
    </div>
  );
}
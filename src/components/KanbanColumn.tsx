import React from 'react';
import { Task, Contact, KanbanColumn as KanbanColumnType, InfoTec } from '../types';
import { TaskCard } from './TaskCard';
import { Expand } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  status: KanbanColumnType;
  tasks: Task[];
  contacts: Contact[];
  infoTecs: InfoTec[];
  onTaskClick: (task: Task) => void;
  onDrop: (taskId: string, newStatus: KanbanColumnType) => void;
  onTaskUpdate: (task: Task) => void;
}

const columnColors = {
  'não-iniciado': 'bg-gray-50 border-gray-200',
  'em-andamento': 'bg-blue-50 border-blue-200',
  'concluído': 'bg-green-50 border-green-200',
};

const columnColorsDark = {
  'não-iniciado': 'bg-gray-800 border-gray-700',
  'em-andamento': 'bg-blue-900/20 border-blue-800',
  'concluído': 'bg-green-900/20 border-green-800',
};
export function KanbanColumn({ title, status, tasks, contacts, infoTecs, onTaskClick, onDrop, onTaskUpdate }: KanbanColumnProps) {
  const [draggedOver, setDraggedOver] = React.useState(false);
  
  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    onDrop(taskId, status);
  };

  const handleReactivateTask = (task: Task) => {
    const reactivatedTask = { ...task, isInterrupted: false };
    onTaskUpdate(reactivatedTask);
  };

  return (
    <div 
      className={`flex-1 min-w-80 border-2 rounded-lg p-4 ${
        theme === 'escuro' ? columnColorsDark[status] : columnColors[status]
      } ${
        draggedOver 
          ? (theme === 'escuro' ? 'border-blue-500 bg-blue-900/30' : 'border-blue-400 bg-blue-100')
          : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-semibold ${
          theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
        }`}>{title}</h2>
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
          theme === 'escuro' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
        }`}>
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3 min-h-96">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            contacts={contacts}
            infoTecs={infoTecs}
            onClick={() => onTaskClick(task)}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', task.id);
            }}
            onDragEnd={() => {}}
            onReactivate={handleReactivateTask}
          />
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Task, Contact, KanbanColumn, InfoTec } from '../types';
import { KanbanColumn as Column } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  contacts: Contact[];
  infoTecs: InfoTec[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const columns: { status: KanbanColumn; title: string; }[] = [
  { status: 'não-iniciado', title: 'Não Iniciado' },
  { status: 'em-andamento', title: 'Em Andamento' },
  { status: 'concluído', title: 'Concluído' },
];

export function KanbanBoard({ tasks, contacts, infoTecs, onTaskClick, onTaskUpdate, onTaskDelete }: KanbanBoardProps) {
  const handleDrop = (taskId: string, newStatus: KanbanColumn) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      onTaskUpdate({ ...task, status: newStatus });
    }
  };

  const sortedTasks = (status: KanbanColumn) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => {
        // Se for a coluna de concluído, colocar tarefas interrompidas no final
        if (status === 'concluído') {
          if (a.isInterrupted && !b.isInterrupted) return 1;
          if (!a.isInterrupted && b.isInterrupted) return -1;
        }
        
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        const now = new Date();
        
        const aOverdue = dateA < now && a.status !== 'concluído';
        const bOverdue = dateB < now && b.status !== 'concluído';
        
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        
        return dateA.getTime() - dateB.getTime();
      });
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {columns.map(column => (
        <Column
          key={column.status}
          title={column.title}
          status={column.status}
          tasks={sortedTasks(column.status)}
          contacts={contacts}
          infoTecs={infoTecs}
          onTaskClick={onTaskClick}
          onDrop={handleDrop}
          onTaskUpdate={onTaskUpdate}
        />
      ))}
    </div>
  );
}
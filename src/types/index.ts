import React, { useState } from 'react';
import { Task, Contact } from '../types';
import { X, Calendar, User, FileText, Paperclip, Save, Edit3, AlertTriangle, RotateCcw, Upload, Trash2, Download, Plus, Eye } from 'lucide-react';

interface TaskModalProps {
  task: Task | null;
  contacts: Contact[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onSaveContact: (contact: Contact) => void;
}

export function TaskModal({ task, contacts, isOpen, onClose, onSave, onSaveContact }: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [showQuickContactForm, setShowQuickContactForm] = useState(false);
  const [quickContact, setQuickContact] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    city: '',
    position: '',
    notes: ''
  });

  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  React.useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!isOpen || !task || !editedTask) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && editedTask) {
      const newAttachments = Array.from(files).map(file => file.name);
      setEditedTask({
        ...editedTask,
        attachments: [...editedTask.attachments, ...newAttachments]
      });
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const removeAttachment = (index: number) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        attachments: editedTask.attachments.filter((_, i) => i !== index)
      });
    }
  };

  const handleSaveQuickContact = () => {
    if (!quickContact.name.trim()) return;

    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: quickContact.name.trim(),
      email: quickContact.email.trim(),
      phone: quickContact.phone.trim(),
      institution: quickContact.institution.trim(),
      city: quickContact.city.trim(),
      position: quickContact.position.trim(),
      notes: quickContact.notes.trim(),
    };

    onSaveContact(newContact);
    if (editedTask) {
      setEditedTask({ ...editedTask, contactIds: [...editedTask.contactIds, newContact.id] });
    }
    setShowQuickContactForm(false);
    setQuickContact({ name: '', email: '', phone: '', institution: '', city: '', position: '', notes: '' });
  };

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
  };

  const handleDownloadAttachment = (attachment: string) => {
    // Simular download do arquivo
    const link = document.createElement('a');
    link.href = '#'; // Em uma implementação real, seria a URL do arquivo
    link.download = attachment;
    link.click();
    
    // Feedback visual
    alert(`Download iniciado: ${attachment}`);
  };

  const handlePreviewAttachment = (attachment: string) => {
    // Simular preview do arquivo
    alert(`Visualizando: ${attachment}`);
  };

  const handleInterrupt = () => {
    if (confirm('Tem certeza de que deseja interromper esta tarefa?')) {
      const interruptedTask = { ...editedTask, status: 'concluído' as const, isInterrupted: true };
      onSave(interruptedTask);
      setIsEditing(false);
    }
  };

  const handleReactivate = () => {
    if (confirm('Tem certeza de que deseja reativar esta tarefa?')) {
      const reactivatedTask = { ...editedTask, isInterrupted: false };
      onSave(reactivatedTask);
      setIsEditing(false);
    }
  };

  const taskContacts = contacts.filter(c => task.contactIds.includes(c.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto ${
        theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {isEditing ? 'Editar Tarefa' : 'Detalhes da Tarefa'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'escuro'
                    ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'escuro'
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
              }`}>Título</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              ) : (
                <p className={`text-lg font-semibold ${
                  theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                }`}>{task.title}</p>
              )}
            </div>

            {/* Prioridade e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Prioridade</label>
                {isEditing ? (
                  <select
                    value={editedTask.priority}
                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as any })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'escuro' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority}
                  </span>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Status</label>
                {isEditing ? (
                  <select
                    value={editedTask.status}
                    onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as any })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="não-iniciado">Não iniciado</option>
                    <option value="em-andamento">Em andamento</option>
                    <option value="concluído">Concluído</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    task.isInterrupted 
                      ? (theme === 'escuro' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600')
                      : (theme === 'escuro' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                  }`}>
                    {task.isInterrupted ? 'Interrompido' : task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.replace('-', ' ').slice(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Contato */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <User className="w-4 h-4 inline mr-2" />
                Contatos Relacionados
              </label>
              {isEditing ? (
                <div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        onChange={(e) => {
                          const contactId = e.target.value;
                          if (contactId && !editedTask.contactIds.includes(contactId)) {
                            setEditedTask({ ...editedTask, contactIds: [...editedTask.contactIds, contactId] });
                          }
                          e.target.value = '';
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'escuro'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">Selecione um contato para adicionar</option>
                        {contacts.filter(contact => !editedTask.contactIds.includes(contact.id)).map(contact => (
                          <option key={contact.id} value={contact.id}>{contact.name}</option>
                        ))}
                      </select>
                      
                      {/* Selected contacts */}
                      {editedTask.contactIds.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {editedTask.contactIds.map(contactId => {
                            const contact = contacts.find(c => c.id === contactId);
                            return contact ? (
                              <div key={contactId} className={`flex items-center justify-between px-2 py-1 rounded ${
                                theme === 'escuro' ? 'bg-gray-600' : 'bg-gray-100'
                              }`}>
                                <span className={`text-sm ${
                                  theme === 'escuro' ? 'text-gray-200' : 'text-gray-700'
                                }`}>{contact.name}</span>
                                <button
                                  type="button"
                            )
                          }
                          )
                          }
                      )
                      }
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Nenhum contato selecionado</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowQuickContactForm(!showQuickContactForm)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      title="Cadastrar novo contato"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Formulário rápido de contato */}
                  {showQuickContactForm && (
                    <div className={`mt-4 p-4 border rounded-lg ${
                      theme === 'escuro' 
                        ? 'bg-green-900/20 border-green-700' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <h4 className={`text-sm font-medium mb-3 flex items-center ${
                        theme === 'escuro' ? 'text-green-300' : 'text-green-900'
                      }`}>
                        <User className="w-4 h-4 mr-2" />
                        Cadastro Rápido de Contato
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="Nome completo *"
                            value={quickContact.name}
                            onChange={(e) => setQuickContact({ ...quickContact, name: e.target.value })}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              theme === 'escuro'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder="Email"
                            value={quickContact.email}
                            onChange={(e) => setQuickContact({ ...quickContact, email: e.target.value })}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              theme === 'escuro'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="Telefone"
                            value={quickContact.phone}
                            onChange={(e) => setQuickContact({ ...quickContact, phone: e.target.value })}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              theme === 'escuro'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Instituição"
                            value={quickContact.institution}
                            onChange={(e) => setQuickContact({ ...quickContact, institution: e.target.value })}
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              theme === 'escuro'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={handleSaveQuickContact}
                          disabled={!quickContact.name.trim()}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Salvar Contato
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowQuickContactForm(false);
                            setQuickContact({ name: '', email: '', phone: '', institution: '', city: '', position: '', notes: '' });
                          }}
                          className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                            theme === 'escuro'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className={theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'}>
                  {contact ? contact.name : 'Nenhum contato selecionado'}
                </p>
              )}
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data de Início
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedTask.startDate || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, startDate: e.target.value || undefined })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'}>
                    {task.startDate ? new Date(task.startDate).toLocaleDateString('pt-BR') : 'Não definida'}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data de Conclusão
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedTask.dueDate || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value || undefined })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Não definida'}
                  </p>
                )}
              </div>
            </div>

            {/* Lembrete */}
            {(isEditing ? editedTask.dueDate : task.dueDate) && (
              <div>
                <label className="flex items-center">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedTask.reminderEnabled || false}
                      onChange={(e) => setEditedTask({ ...editedTask, reminderEnabled: e.target.checked })}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <div className={`w-4 h-4 mr-2 rounded border ${
                      task.reminderEnabled 
                        ? 'bg-blue-600 border-blue-600' 
                        : (theme === 'escuro' ? 'border-gray-600' : 'border-gray-300')
                    }`}>
                      {task.reminderEnabled && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      }
                    </div>
                  )}
                  <span className={`text-sm font-medium ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Lembrete de notificação ativo
                  </span>
                </label>
              </div>
            )}

            {/* Observações */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FileText className="w-4 h-4 inline mr-2" />
                Observações
              </label>
              {isEditing ? (
                <textarea
                  value={editedTask.notes}
                  onChange={(e) => setEditedTask({ ...editedTask, notes: e.target.value })}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Adicione observações sobre esta tarefa..."
                />
              ) : (
                <p className={`whitespace-pre-wrap ${
                  theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                }`}>{task.notes || 'Nenhuma observação'}</p>
              )}
            </div>

            {/* Anexos */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Paperclip className="w-4 h-4 inline mr-2" />
                Anexos
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  {/* Upload de arquivos */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors border border-blue-200">
                      <Upload className="w-4 h-4 mr-2" />
                      Adicionar Arquivo
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="*/*"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      Selecione um ou mais arquivos
                    </span>
                  </div>

                  {/* Lista de anexos */}
                  {editedTask.attachments.length > 0 && (
                    <div className={`border rounded-lg p-3 ${
                      theme === 'escuro' 
                        ? 'border-gray-600 bg-gray-700' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <h4 className={`text-sm font-medium mb-2 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Arquivos Anexados ({editedTask.attachments.length})
                      </h4>
                      <div className="space-y-2">
                        {editedTask.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded border ${
                              theme === 'escuro' 
                                ? 'bg-gray-800 border-gray-600' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              <Paperclip className={`w-4 h-4 mr-2 ${
                                theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                              }`} />
                              <span className={`text-sm truncate ${
                                theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {attachment}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDownloadAttachment(attachment)}
                                className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                title="Baixar anexo"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeAttachment(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Remover anexo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editedTask.attachments.length === 0 && (
                    <div className={`text-center py-4 text-sm border rounded-lg ${
                      theme === 'escuro' 
                        ? 'text-gray-400 border-gray-600 bg-gray-700' 
                        : 'text-gray-500 border-gray-200 bg-gray-50'
                    }`}>
                      Nenhum anexo adicionado
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {task.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {task.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded border ${
                            theme === 'escuro' 
                              ? 'bg-gray-700 border-gray-600' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <Paperclip className={`w-4 h-4 mr-2 ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm truncate ${
                              theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {attachment}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDownloadAttachment(attachment)}
                              className="p-1 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                              title="Baixar anexo"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-4 text-sm border rounded-lg ${
                      theme === 'escuro' 
                        ? 'text-gray-400 border-gray-600 bg-gray-700' 
                        : 'text-gray-500 border-gray-200 bg-gray-50'
                    }`}>
                      Nenhum anexo
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botões */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </button>
                
                {!task.isInterrupted && (
                  <button
                    onClick={handleInterrupt}
                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Interromper Tarefa
                  </button>
                )}
                
                {task.isInterrupted && (
                  <button
                    onClick={handleReactivate}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reativar Tarefa
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTask({ ...task });
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === 'escuro'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Task, Contact } from '../types';
import { X, Save, Edit3, Paperclip, Upload, Trash2, Plus, User, Download } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'lastUpdated'>) => void;
  contacts: Contact[];
  onSaveContact: (contact: Contact) => void;
}

export function AddTaskModal({ isOpen, onClose, onSave, contacts, onSaveContact }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
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
  const [formData, setFormData] = useState({
    priority: 'média' as Task['priority'],
    contactIds: [] as string[],
    status: 'não-iniciado' as Task['status'],
    startDate: '',
    dueDate: '',
    notes: '',
    reminderEnabled: false,
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => file.name);
      setAttachments([...attachments, ...newAttachments]);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSaveQuickContact = () => {
    if (!quickContact.name.trim()) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: quickContact.name.trim(),
      email: quickContact.email.trim(),
      phone: quickContact.phone.trim(),
      institution: quickContact.institution.trim(),
      city: quickContact.city.trim(),
      position: quickContact.position.trim(),
      notes: quickContact.notes.trim(),
    };

    onSaveContact(newContact);
    setFormData({ ...formData, contactIds: [...formData.contactIds, newContact.id] });
    setShowQuickContactForm(false);
    setQuickContact({ name: '', email: '', phone: '', institution: '', city: '', position: '', notes: '' });
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const task: Omit<Task, 'id' | 'lastUpdated'> = {
      title: title.trim(),
      priority: formData.priority,
      contactIds: formData.contactIds,
      status: formData.status,
      startDate: formData.startDate || undefined,
      dueDate: formData.dueDate || undefined,
      attachments: attachments,
      notes: formData.notes.trim(),
      categoryId: '',
      reminderEnabled: formData.reminderEnabled,
    };

    onSave(task);
    handleClose();
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleClose = () => {
    setTitle('');
    setShowEditForm(false);
    setAttachments([]);
    setShowQuickContactForm(false);
    setQuickContact({ name: '', email: '', phone: '', institution: '', city: '', position: '', notes: '' });
    setFormData({
      priority: 'média',
      contactIds: [],
      status: 'não-iniciado',
      startDate: '',
      dueDate: '',
      notes: '',
      reminderEnabled: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto ${
        theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
            }`}>Nova Tarefa</h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'escuro'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Título da Tarefa *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'escuro'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Digite o título da tarefa"
                autoFocus
              />
            </div>

            {/* Formulário expandido */}
            {showEditForm && (
              <div className={`space-y-6 border-t pt-6 ${
                theme === 'escuro' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                {/* Prioridade e Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Prioridade
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
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
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status Inicial
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
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
                  </div>
                </div>

                {/* Contato */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Contatos Relacionados
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        onChange={(e) => {
                          const contactId = e.target.value;
                          if (contactId && !formData.contactIds.includes(contactId)) {
                            setFormData({ ...formData, contactIds: [...formData.contactIds, contactId] });
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
                        {contacts.filter(contact => !formData.contactIds.includes(contact.id)).map(contact => (
                          <option key={contact.id} value={contact.id}>{contact.name}</option>
                        ))}
                      </select>
                      
                      {/* Selected contacts */}
                      {formData.contactIds.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {formData.contactIds.map(contactId => {
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
                                  onClick={() => setFormData({ 
                                    ...formData, 
                                    contactIds: formData.contactIds.filter(id => id !== contactId) 
                                  })}
                                  className={`text-red-500 hover:text-red-700 ${
                                    theme === 'escuro' ? 'hover:text-red-400' : ''
                                  }`}
                                >
                                  ×
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
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

                {/* Datas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Data de Conclusão
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Lembrete */}
                {formData.dueDate && (
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.reminderEnabled}
                        onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm font-medium ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Criar lembrete de notificação para fim da tarefa
                      </span>
                    </label>
                  </div>
                )}

                {/* Anexos */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Paperclip className="w-4 h-4 inline mr-2" />
                    Anexos
                  </label>
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
                    {attachments.length > 0 && (
                      <div className={`border rounded-lg p-3 ${
                        theme === 'escuro' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <h4 className={`text-sm font-medium mb-2 ${
                          theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Arquivos Selecionados ({attachments.length})
                        </h4>
                        <div className="space-y-2">
                          {attachments.map((attachment, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 border rounded-lg ${
                              theme === 'escuro' 
                                ? 'bg-gray-800 border-gray-600' 
                                : 'bg-white border-gray-200'
                            }`}>
                              <span className={`text-sm truncate flex-1 mr-2 ${
                                theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {attachment}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    // Simular download do arquivo
                                    const link = document.createElement('a');
                                    link.href = '#';
                                    link.download = attachment;
                                    link.click();
                                    alert(`Download iniciado: ${attachment}`);
                                  }}
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
                  </div>
                </div>
                {/* Observações */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Adicione observações sobre esta tarefa..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className={`flex gap-3 mt-8 pt-6 border-t ${
            theme === 'escuro' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </button>
            
            {!showEditForm && (
              <button
                onClick={handleEdit}
                className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar Detalhes
              </button>
            )}
            
            <button
              onClick={handleClose}
              className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                theme === 'escuro'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
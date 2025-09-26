import React, { useState } from 'react';
import { Task, Contact, InfoTec, Category } from './types';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSupabaseData } from './hooks/useSupabaseData';
import { AuthPage } from './components/AuthPage';
import { KanbanBoard } from './components/KanbanBoard';
import { ContactManager } from './components/ContactManager';
import { InfoTecManager } from './components/InfoTecManager';
import { AddTaskModal } from './components/AddTaskModal';
import { TaskModal } from './components/TaskModal';
import { SearchFilters } from './components/SearchFilters';
import { CategoryManager } from './components/CategoryManager';
import { ExpandedTaskView } from './components/ExpandedTaskView';
import { exportToCSV, exportToPDF } from './utils/exportData';
import { 
  Plus, 
  Users, 
  Settings, 
  Download, 
  Kanban,
  BookOpen,
  FileText,
  Expand,
  Home,
  LogOut
} from 'lucide-react';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    tasks,
    contacts,
    categories,
    infoTecs,
    loading: dataLoading,
    saveTask,
    deleteTask,
    saveContact,
    deleteContact,
    saveCategory,
    deleteCategory,
    saveInfoTec,
    deleteInfoTec
  } = useSupabaseData(user);
  
  const [defaultView, setDefaultView] = useLocalStorage<'kanban' | 'viewall'>('default-view', 'kanban');
  const [fontSize, setFontSize] = useLocalStorage<'pequena' | 'medio' | 'grande'>('font-size', 'medio');
  const [theme, setTheme] = useLocalStorage<'claro' | 'escuro'>('theme', 'claro');
  
  const [activeTab, setActiveTab] = useState<'kanban' | 'contacts' | 'infotec' | 'settings' | 'viewall'>(defaultView);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'personalization' | 'categories' | 'account'>('general');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [contactFilter, setContactFilter] = useState<string[]>([]);

  // Set activeCategoryId when categories are loaded
  React.useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const handleLogout = async () => {
    await signOut();
    setActiveTab(defaultView);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Show loading while fetching data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }
  const activeCategory = categories.find(cat => cat.id === activeCategoryId) || categories[0] || { id: '', name: 'Carregando...', color: '#6B7280' };

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategoryId ? task.categoryId === activeCategoryId : true;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    const matchesContact = contactFilter.length === 0 || task.contactIds.some(contactId => contactFilter.includes(contactId));
    
    return matchesCategory && matchesSearch && matchesPriority && matchesStatus && matchesContact;
  });

  const handleAddTask = (task: Omit<Task, 'id' | 'lastUpdated'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
      categoryId: activeCategoryId || categories[0]?.id || '',
      isInterrupted: false,
    };
    saveTask(newTask);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    saveTask({ ...updatedTask, lastUpdated: new Date().toISOString() });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleSaveContact = (contact: Contact) => {
    saveContact(contact);
  };

  const handleDeleteContact = (contactId: string) => {
    deleteContact(contactId);
  };

  const handleSaveInfoTec = (infoTec: InfoTec) => {
    saveInfoTec(infoTec);
  };

  const handleDeleteInfoTec = (infoTecId: string) => {
    deleteInfoTec(infoTecId);
  };

  const handleSaveCategory = (category: Category) => {
    saveCategory(category);
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
    if (activeCategoryId === categoryId) {
      const firstRemainingCategory = categories.find(c => c.id !== categoryId);
      if (firstRemainingCategory) {
        setActiveCategoryId(firstRemainingCategory.id);
      } else {
        setActiveCategoryId(null);
      }
    }
  };

  const handleExportTasks = () => {
    const exportData = filteredTasks.map(task => {
      const taskContacts = contacts.filter(c => task.contactIds.includes(c.id));
      return {
        título: task.title,
        prioridade: task.priority,
        status: task.status,
        contatos: taskContacts.map(c => c.name).join(', '),
        'data-início': task.startDate || '',
        'data-conclusão': task.dueDate || '',
        'última-atualização': new Date(task.lastUpdated).toLocaleDateString('pt-BR'),
        observações: task.notes,
        categoria: activeCategory.name
      };
    });
    exportToCSV(exportData, `tarefas-${activeCategory.name.toLowerCase()}`);
  };

  const handleExportTasksPDF = () => {
    const exportData = filteredTasks.map(task => {
      const taskContacts = contacts.filter(c => task.contactIds.includes(c.id));
      return {
        título: task.title,
        prioridade: task.priority,
        status: task.status,
        contatos: taskContacts.map(c => c.name).join(', '),
        'data-início': task.startDate || '',
        'data-conclusão': task.dueDate || '',
        'última-atualização': new Date(task.lastUpdated).toLocaleDateString('pt-BR'),
        observações: task.notes,
        categoria: activeCategory.name
      };
    });
    exportToPDF(exportData, `tarefas-${activeCategory.name.toLowerCase()}`);
  };

  const handleExportContacts = () => {
    exportToCSV(contacts, 'contatos');
  };

  const handleExportInfoTecs = () => {
    exportToCSV(infoTecs, 'infotec');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriorityFilter([]);
    setStatusFilter([]);
    setContactFilter([]);
  };

  return (
    <div className={`min-h-screen ${
      theme === 'escuro' ? 'bg-gray-900' : 'bg-gray-50'
    } ${
      fontSize === 'pequena' ? 'text-sm' : 
      fontSize === 'grande' ? 'text-lg' : 'text-base'
    }`}>
      <header className={`${
        theme === 'escuro' ? 'bg-gray-800 border-gray-700' : 'bg-white'
      } shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Kanban className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className={`text-xl font-bold ${
                  theme === 'escuro' ? 'text-white' : 'text-gray-900'
                }`}>Kanbanize.me</h1>
                <p className={`text-sm ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Bem-vindo, {user.user_metadata?.username || user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
              {[
                { id: 'kanban', label: 'Kanban', icon: Kanban, isDefault: defaultView === 'kanban' },
                { id: 'viewall', label: 'Ver Todas', icon: Expand, isDefault: defaultView === 'viewall' },
                { id: 'contacts', label: 'Contatos', icon: Users },
                { id: 'infotec', label: 'InfoTec', icon: BookOpen },
                { id: 'settings', label: 'Configurações', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : `${
                          theme === 'escuro' 
                            ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.isDefault && (
                    <Home className="w-3 h-3 ml-1 opacity-70" title="Tela principal" />
                  )}
                </button>
              ))}
              </nav>
              
              <button
                onClick={handleLogout}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  theme === 'escuro'
                    ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategoryId === category.id
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: activeCategoryId === category.id ? category.color : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </button>
                
                <button
                  onClick={handleExportTasks}
                  disabled={filteredTasks.length === 0}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </button>

                <button
                  onClick={handleExportTasksPDF}
                  disabled={filteredTasks.length === 0}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar PDF
                </button>

                {(searchTerm || priorityFilter.length > 0 || statusFilter.length > 0 || contactFilter.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} em {activeCategory.name}
              </div>
            </div>

            {/* Search and Filters */}
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              contactFilter={contactFilter}
              setContactFilter={setContactFilter}
              contacts={contacts}
            />

            {/* Kanban Board */}
            <KanbanBoard
              tasks={filteredTasks}
              contacts={contacts}
              infoTecs={infoTecs}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
            />
          </div>
        )}

        {activeTab === 'viewall' && (
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategoryId === category.id
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: activeCategoryId === category.id ? category.color : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </button>
                
                <button
                  onClick={handleExportTasks}
                  disabled={filteredTasks.length === 0}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </button>

                <button
                  onClick={handleExportTasksPDF}
                  disabled={filteredTasks.length === 0}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar PDF
                </button>

                {(searchTerm || priorityFilter.length > 0 || statusFilter.length > 0 || contactFilter.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} em {activeCategory.name}
              </div>
            </div>

            {/* Search and Filters */}
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              contactFilter={contactFilter}
              setContactFilter={setContactFilter}
              contacts={contacts}
            />

            {/* All Tasks View */}
            <ExpandedTaskView
              column="all"
              tasks={filteredTasks}
              contacts={contacts}
              onClose={() => {}} // Não precisa de close pois é uma aba
              onTaskClick={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              isFullScreen={true}
            />
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Contatos</h2>
              <button
                onClick={handleExportContacts}
                disabled={contacts.length === 0}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Contatos
              </button>
            </div>
            <ContactManager
              contacts={contacts}
              infoTecs={infoTecs}
              onSave={handleSaveContact}
              onDelete={handleDeleteContact}
            />
          </div>
        )}

        {activeTab === 'infotec' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar InfoTec</h2>
              <button
                onClick={handleExportInfoTecs}
                disabled={infoTecs.length === 0}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar InfoTec
              </button>
            </div>
            <InfoTecManager
              infoTecs={infoTecs}
              contacts={contacts}
              onSave={handleSaveInfoTec}
              onDelete={handleDeleteInfoTec}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'escuro' ? 'text-white' : 'text-gray-900'
            }`}>Configurações</h2>
            
            {/* Tabs de Configurações */}
            <div className={`border-b ${
              theme === 'escuro' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <nav className="flex space-x-8">
                {[
                  { id: 'general', label: 'Geral', icon: Settings },
                  { id: 'personalization', label: 'Personalização', icon: Kanban },
                  { id: 'categories', label: 'Categorias', icon: Plus },
                  { id: 'account', label: 'Conta', icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeSettingsTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : `border-transparent ${
                            theme === 'escuro' 
                              ? 'text-gray-400 hover:text-gray-300 hover:border-gray-300' 
                              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="mt-6">
              {activeSettingsTab === 'general' && (
                <div className="space-y-6">
                  {/* Configuração da Tela Principal */}
                  <div className={`${
                    theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow p-6`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'escuro' ? 'text-white' : 'text-gray-900'
                    }`}>Tela Principal</h3>
                    <div className="space-y-3">
                      <p className={`text-sm mb-4 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Escolha qual tela deve ser exibida por padrão ao abrir o sistema:
                      </p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="defaultView"
                            value="kanban"
                            checked={defaultView === 'kanban'}
                            onChange={(e) => setDefaultView(e.target.value as 'kanban' | 'viewall')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <Kanban className="w-4 h-4 mr-2 text-blue-600" />
                            <span className={`font-medium ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>Kanban</span>
                            <span className={`ml-2 text-sm ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>- Visualização em colunas</span>
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="defaultView"
                            value="viewall"
                            checked={defaultView === 'viewall'}
                            onChange={(e) => setDefaultView(e.target.value as 'kanban' | 'viewall')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <Expand className="w-4 h-4 mr-2 text-green-600" />
                            <span className={`font-medium ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>Ver Todas</span>
                            <span className={`ml-2 text-sm ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>- Visualização em tabela</span>
                          </div>
                        </label>
                      </div>
                      <div className={`mt-4 p-3 rounded-lg ${
                        theme === 'escuro' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
                      }`}>
                        <p className={`text-sm ${
                          theme === 'escuro' ? 'text-blue-300' : 'text-blue-800'
                        }`}>
                          <strong>Atual:</strong> {defaultView === 'kanban' ? 'Kanban' : 'Ver Todas'} será a tela inicial
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'personalization' && (
                <div className="space-y-6">
                  {/* Configuração do Tema */}
                  <div className={`${
                    theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow p-6`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'escuro' ? 'text-white' : 'text-gray-900'
                    }`}>Tema da Interface</h3>
                    <div className="space-y-3">
                      <p className={`text-sm mb-4 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Escolha entre o tema claro ou escuro para a interface:
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="claro"
                            checked={theme === 'claro'}
                            onChange={(e) => setTheme(e.target.value as 'claro' | 'escuro')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-3"></div>
                            <span className={`font-medium ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>Tema Claro</span>
                            <span className={`ml-2 text-sm ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>- Interface clara e tradicional</span>
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="theme"
                            value="escuro"
                            checked={theme === 'escuro'}
                            onChange={(e) => setTheme(e.target.value as 'claro' | 'escuro')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded mr-3"></div>
                            <span className={`font-medium ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>Tema Escuro</span>
                            <span className={`ml-2 text-sm ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>- Interface escura, reduz cansaço visual</span>
                          </div>
                        </label>
                      </div>
                      <div className={`mt-4 p-3 rounded-lg ${
                        theme === 'escuro' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
                      }`}>
                        <p className={`text-sm ${
                          theme === 'escuro' ? 'text-blue-300' : 'text-blue-800'
                        }`}>
                          <strong>Atual:</strong> Tema {theme} está sendo usado
                        </p>
                        <div className={`mt-2 p-2 rounded border ${
                          theme === 'escuro' 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <p className={`${
                            fontSize === 'pequena' ? 'text-sm' : 
                            fontSize === 'grande' ? 'text-lg' : 'text-base'
                          } ${
                            theme === 'escuro' ? 'text-gray-100' : 'text-gray-700'
                          }`}>
                            Exemplo de texto com o tema selecionado
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuração do Tamanho da Fonte */}
                  <div className={`${
                    theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow p-6`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'escuro' ? 'text-white' : 'text-gray-900'
                    }`}>Tamanho da Fonte</h3>
                    <div className="space-y-3">
                      <p className={`text-sm mb-4 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Escolha o tamanho da fonte que melhor se adequa à sua preferência:
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="fontSize"
                            value="pequena"
                            checked={fontSize === 'pequena'}
                            onChange={(e) => setFontSize(e.target.value as 'pequena' | 'medio' | 'grande')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <span className={`font-medium text-sm ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>Pequena</span>
                            <span className={`ml-2 text-xs ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>- Texto compacto, mais informações na tela</span>
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="fontSize"
                            value="medio"
                            checked={fontSize === 'medio'}
                            onChange={(e) => setFontSize(e.target.value as 'pequena' | 'medio' | 'grande')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <span className={`font-medium text-base ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>Médio</span>
                            <span className={`ml-2 text-sm ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>- Tamanho padrão, equilibrado</span>
                          </div>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="fontSize"
                            value="grande"
                            checked={fontSize === 'grande'}
                            onChange={(e) => setFontSize(e.target.value as 'pequena' | 'medio' | 'grande')}
                            className="mr-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <span className={`font-medium text-lg ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>Grande</span>
                            <span className={`ml-2 text-base ${
                              theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                            }`}>- Texto maior, mais fácil de ler</span>
                          </div>
                        </label>
                      </div>
                      <div className={`mt-4 p-3 rounded-lg ${
                        theme === 'escuro' ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
                      }`}>
                        <p className={`text-sm ${
                          theme === 'escuro' ? 'text-blue-300' : 'text-blue-800'
                        }`}>
                          <strong>Atual:</strong> Fonte {fontSize} está sendo usada
                        </p>
                        <div className={`mt-2 p-2 rounded border ${
                          theme === 'escuro' 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <p className={`text-gray-700 ${
                            fontSize === 'pequena' ? 'text-sm' : 
                            fontSize === 'grande' ? 'text-lg' : 'text-base'
                          } ${
                            theme === 'escuro' ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            Exemplo de texto com o tamanho selecionado
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'categories' && (
                <div className="space-y-6">
                  <div className={`${
                    theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow p-6`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-lg font-semibold ${
                        theme === 'escuro' ? 'text-white' : 'text-gray-900'
                      }`}>Gerenciar Categorias</h3>
                      <button
                        onClick={() => setIsCategoryManagerOpen(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Categoria
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {categories.map(category => (
                        <div
                          key={category.id}
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            theme === 'escuro' 
                              ? 'border-gray-600 bg-gray-700' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className={`font-medium ${
                              theme === 'escuro' ? 'text-white' : 'text-gray-900'
                            }`}>{category.name}</span>
                          </div>
                          <button
                            onClick={() => {
                              setIsCategoryManagerOpen(true);
                            }}
                            className={`${
                              theme === 'escuro' 
                                ? 'text-blue-400 hover:text-blue-300' 
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            Editar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'account' && (
                <div className="space-y-6">
                  {/* Configurações do Usuário */}
                  <div className={`${
                    theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow p-6`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'escuro' ? 'text-white' : 'text-gray-900'
                    }`}>Configurações da Conta</h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Nome de Usuário
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={user.user_metadata?.username || ''}
                            disabled
                            className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              theme === 'escuro'
                                ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            placeholder="Digite seu nome de usuário"
                          />
                        </div>
                        <p className={`text-sm mt-1 ${
                          theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          O nome de usuário não pode ser alterado
                        </p>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email da Conta
                        </label>
                        <input
                          type="email"
                          value={user.email || ''}
                          disabled
                          className={`w-full px-3 py-2 border rounded-lg cursor-not-allowed ${
                            theme === 'escuro'
                              ? 'bg-gray-600 border-gray-500 text-gray-400'
                              : 'bg-gray-50 border-gray-300 text-gray-500'
                          }`}
                        />
                        <p className={`text-sm mt-1 ${
                          theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          O email não pode ser alterado
                        </p>
                      </div>

                      <div className={`pt-4 border-t ${
                        theme === 'escuro' ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <div className={`border rounded-lg p-4 ${
                          theme === 'escuro' 
                            ? 'bg-blue-900/30 border-blue-700' 
                            : 'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className={`w-5 h-5 ${
                                theme === 'escuro' ? 'text-blue-300' : 'text-blue-400'
                              }`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className={`text-sm font-medium ${
                                theme === 'escuro' ? 'text-blue-300' : 'text-blue-800'
                              }`}>
                                Informações da Conta
                              </h4>
                              <div className={`mt-2 text-sm ${
                                theme === 'escuro' ? 'text-blue-400' : 'text-blue-700'
                              }`}>
                                <p>Conta criada em: {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSave={handleAddTask}
        contacts={contacts}
        onSaveContact={handleSaveContact}
      />

      <TaskModal
        task={selectedTask}
        contacts={contacts}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleUpdateTask}
        onSaveContact={handleSaveContact}
      />

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}

export default App;
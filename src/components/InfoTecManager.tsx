import React, { useState } from 'react';
import { InfoTec, Contact } from '../types';
import {
  Plus, Edit3, Search, X, Save,
  BookOpen, Palette, Calendar, Users, Clock, GraduationCap, Monitor, MapPin
} from 'lucide-react';

interface InfoTecManagerProps {
  infoTecs: InfoTec[];
  contacts: Contact[];
  onSave: (infoTec: InfoTec) => void;
  onDelete: (infoTecId: string) => void;
}

const predefinedColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280',
  '#14B8A6', '#F472B6', '#A855F7', '#22C55E', '#EAB308',
];

const weekDays = [
  'Segunda-feira',
  'Terça-feira', 
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

// ordem das prioridades
const priorityOrder = { alta: 1, media: 2, baixa: 3 };

export function InfoTecManager({ infoTecs, contacts, onSave, onDelete }: InfoTecManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfoTec, setEditingInfoTec] = useState<InfoTec | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState<'claro' | 'escuro'>(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  const [formData, setFormData] = useState<Partial<InfoTec>>({
    name: '',
    period: 'matutino',
    modality: 'presencial',
    color: predefinedColors[0],
    startDate: '',
    studentDays: '',
    classDays: '',
    duration: 0,
    priority: 'media'
  });

  const filteredInfoTecs = infoTecs
    .filter(infoTec =>
      infoTec.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!periodFilter || infoTec.period === periodFilter) &&
      (!modalityFilter || infoTec.modality === modalityFilter) &&
      (!priorityFilter || infoTec.priority === priorityFilter) &&
      (!colorFilter || infoTec.color === colorFilter)
    )
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Obter docentes que ministram cada curso
  const getDocentesByCourse = (courseId: string) => {
    return contacts.filter(contact => 
      contact.isFaculty && contact.courses && contact.courses.includes(courseId)
    );
  };

  // Obter valores únicos para filtros
  const uniquePeriods = [...new Set(infoTecs.map(course => course.period))];
  const uniqueModalities = [...new Set(infoTecs.map(course => course.modality))];
  const uniquePriorities = [...new Set(infoTecs.map(course => course.priority))];
  const uniqueColors = [...new Set(infoTecs.map(course => course.color))];

  const clearFilters = () => {
    setSearchTerm('');
    setPeriodFilter('');
    setModalityFilter('');
    setPriorityFilter('');
    setColorFilter('');
  };

  const hasActiveFilters = searchTerm || periodFilter || modalityFilter || priorityFilter || colorFilter;
  const handleDayToggle = (day: string) => {
    const currentDays = formData.classDays ? formData.classDays.split(', ') : [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setFormData({ ...formData, classDays: newDays.join(', ') });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const infoTec: InfoTec = {
      id: editingInfoTec?.id || crypto.randomUUID(),
      name: formData.name || '',
      period: formData.period || 'matutino',
      modality: formData.modality || 'presencial',
      color: formData.color || predefinedColors[0],
      startDate: formData.startDate || '',
      studentDays: formData.studentDays || '',
      classDays: formData.classDays || '',
      duration: formData.duration || 0,
      priority: formData.priority || 'media'
    };

    onSave(infoTec);
    handleCloseModal();
  };

  const handleEdit = (infoTec: InfoTec) => {
    setEditingInfoTec(infoTec);
    setFormData(infoTec);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInfoTec(null);
    setFormData({
      name: '',
      period: 'matutino',
      modality: 'presencial',
      color: predefinedColors[0],
      startDate: '',
      studentDays: '',
      classDays: '',
      duration: 0,
      priority: 'media'
    });
  };

  return (
    <div className={`p-6 ${theme === 'escuro' ? 'bg-gray-900' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className={`text-2xl font-bold ${
            theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
          }`}>Cursos InfoTec</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </button>
          {/*comentário helen
          <a
            href="/cadastro"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Cadastrar-se
          </a>*/}
        </div>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              theme === 'escuro'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
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
        
        {/* Filter Toggle Button */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              theme === 'escuro'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Search className="w-4 h-4 mr-2" />
            Filtros Avançados
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
          
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`text-sm underline ${
                  theme === 'escuro' 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Limpar filtros
              </button>
            )}
            <span className={`text-sm ${
              theme === 'escuro' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filteredInfoTecs.length} de {infoTecs.length} cursos
            </span>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className={`mt-4 p-4 rounded-lg border ${
            theme === 'escuro' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Period Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filtrar por Período
                </label>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todos os períodos</option>
                  {uniquePeriods.map(period => (
                    <option key={period} value={period}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modality Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filtrar por Modalidade
                </label>
                <select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todas as modalidades</option>
                  {uniqueModalities.map(modality => (
                    <option key={modality} value={modality}>
                      {modality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filtrar por Prioridade
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todas as prioridades</option>
                  {uniquePriorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Filtrar por Cor
                </label>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setColorFilter('')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      !colorFilter 
                        ? (theme === 'escuro' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white')
                        : (theme === 'escuro' 
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          )
                    }`}
                  >
                    Todas
                  </button>
                  {uniqueColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setColorFilter(color)}
                      className={`w-6 h-6 rounded border-2 ${
                        colorFilter === color ? 'border-gray-800 ring-2 ring-blue-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Filtrar por esta cor`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className={`mt-4 pt-4 border-t ${
                theme === 'escuro' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <p className={`text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Filtros ativos:</p>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Busca: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {periodFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Período: {periodFilter.charAt(0).toUpperCase() + periodFilter.slice(1)}
                      <button
                        onClick={() => setPeriodFilter('')}
                        className="ml-1 hover:text-green-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {modalityFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Modalidade: {modalityFilter}
                      <button
                        onClick={() => setModalityFilter('')}
                        className="ml-1 hover:text-purple-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {priorityFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Prioridade: {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
                      <button
                        onClick={() => setPriorityFilter('')}
                        className="ml-1 hover:text-orange-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {colorFilter && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      <div 
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: colorFilter }}
                      />
                      Cor selecionada
                      <button
                        onClick={() => setColorFilter('')}
                        className="ml-1 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        {filteredInfoTecs.length === 0 && infoTecs.length > 0 && (
          <div className={`mt-4 p-4 border rounded-lg ${
            theme === 'escuro' 
              ? 'bg-yellow-900/20 border-yellow-700' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-sm ${
              theme === 'escuro' ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              Nenhum curso encontrado com os filtros aplicados. 
              <button
                onClick={clearFilters}
                className={`ml-1 underline hover:no-underline ${
                  theme === 'escuro' ? 'text-yellow-200' : 'text-yellow-900'
                }`}
              >
                Limpar filtros
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInfoTecs.map(infoTec => (
          <div
            key={infoTec.id}
            className={`rounded-lg border-2 p-6 hover:shadow-lg transition-all duration-200 ${
              theme === 'escuro' 
                ? 'bg-gray-800 hover:bg-gray-750' 
                : 'bg-white'
            }`}
            style={{ borderColor: `${infoTec.color}30` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-sm"
                  style={{ backgroundColor: infoTec.color }}
                >
                  <span className="text-white font-bold text-lg">
                    {infoTec.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                  }`}>{infoTec.name}</h3>
                  <p className={`text-sm ${
                    theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Prioridade: {infoTec.priority}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(infoTec)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'escuro'
                      ? 'text-blue-400 hover:bg-gray-700'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(infoTec.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'escuro'
                      ? 'text-red-400 hover:bg-gray-700'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl m-4 ${
            theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {editingInfoTec ? 'Editar Curso' : 'Novo Curso'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                  placeholder="Nome do curso"
                />
              </div>

              {/* Período e Modalidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Período</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value as 'matutino' | 'vespertino' | 'noturno' })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="noturno">Noturno</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Modalidade</label>
                  <select
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value as 'presencial' | 'EAD' })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="presencial">Presencial</option>
                    <option value="EAD">EAD</option>
                  </select>
                </div>
              </div>

              {/* Data de início e Duração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Data de Início</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Duração (horas)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Ex: 1200"
                  />
                </div>
              </div>

              {/* Dias dos alunos */}
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Dias dos Alunos</label>
                <input
                  type="text"
                  value={formData.studentDays}
                  onChange={(e) => setFormData({ ...formData, studentDays: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Ex: Segunda a Sexta"
                />
              </div>

              {/* Dias de aula */}
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Dias de Aula</label>
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-lg ${
                  theme === 'escuro' 
                    ? 'border-gray-600 bg-gray-700' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  {weekDays.map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.classDays || '').split(', ').includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{day.split('-')[0]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prioridade */}
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'alta' | 'media' | 'baixa' })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>

              {/* Cor do curso */}
              <div>
                <label className={`block mb-2 text-sm font-medium ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>Cor do Curso</label>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-gray-800 ring-2 ring-blue-500 scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className={`flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t ${
                theme === 'escuro' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                    theme === 'escuro'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

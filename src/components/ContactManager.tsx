import React, { useState } from 'react';
import { Contact, InfoTec } from '../types';
import { 
  Plus, Edit3, Trash2, Search, X, Save, 
  User, Mail, Phone, Building, MapPin, 
  Briefcase, FileText, GraduationCap, Link,
  Calendar, Clock, Filter
} from 'lucide-react';

interface ContactManagerProps {
  contacts: Contact[];
  infoTecs: InfoTec[];
  onSave: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

const weekDays = [
  'Segunda-feira',
  'Terça-feira', 
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const shifts = [
  'Manhã',
  'Tarde',
  'Noite'
];

const santaCatarinaCities = [
  'Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma', 'Chapecó',
  'Itajaí', 'Lages', 'Jaraguá do Sul', 'Palhoça', 'Balneário Camboriú', 'Brusque',
  'Tubarão', 'São Bento do Sul', 'Caçador', 'Concórdia', 'Navegantes', 'Rio do Sul',
  'Araranguá', 'Gaspar', 'Biguaçu', 'Indaial', 'Itapema', 'Mafra', 'Canoinhas',
  'Videira', 'São Francisco do Sul', 'Joaçaba', 'Laguna', 'Imbituba'
];

export function ContactManager({ contacts, infoTecs, onSave, onDelete }: ContactManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    phone: '',
    email: '',
    institution: '',
    city: '',
    position: '',
    notes: '',
    isFaculty: false,
    courses: [],
    sgnLink: '',
    courseModality: 'qualificação',
    classDays: [],
    availableDays: [],
    availableShifts: []
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFaculty = !facultyFilter || 
                          (facultyFilter === 'faculty' && contact.isFaculty) ||
                          (facultyFilter === 'non-faculty' && !contact.isFaculty);
    
    const matchesCity = !cityFilter || contact.city.toLowerCase().includes(cityFilter.toLowerCase());
    
    const matchesInstitution = !institutionFilter || 
                              contact.institution.toLowerCase().includes(institutionFilter.toLowerCase());
    
    const matchesCourse = !courseFilter || 
                         (contact.isFaculty && contact.courses && contact.courses.includes(courseFilter));
    
    return matchesSearch && matchesFaculty && matchesCity && matchesInstitution && matchesCourse;
  });

  const uniqueCities = [...new Set(contacts.map(c => c.city).filter(Boolean))];
  const uniqueInstitutions = [...new Set(contacts.map(c => c.institution).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm('');
    setFacultyFilter('');
    setCityFilter('');
    setInstitutionFilter('');
    setCourseFilter('');
  };

  const hasActiveFilters = searchTerm || facultyFilter || cityFilter || institutionFilter || courseFilter;

  const handleDayToggle = (day: string, field: 'classDays' | 'availableDays') => {
    const currentDays = formData[field] || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setFormData({ ...formData, [field]: newDays });
  };

  const handleShiftToggle = (shift: string) => {
    const currentShifts = formData.availableShifts || [];
    const newShifts = currentShifts.includes(shift)
      ? currentShifts.filter(s => s !== shift)
      : [...currentShifts, shift];
    
    setFormData({ ...formData, availableShifts: newShifts });
  };

  const handleCourseToggle = (courseId: string) => {
    const currentCourses = formData.courses || [];
    const newCourses = currentCourses.includes(courseId)
      ? currentCourses.filter(id => id !== courseId)
      : [...currentCourses, courseId];
    
    setFormData({ ...formData, courses: newCourses });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const contact: Contact = {
      id: editingContact?.id || crypto.randomUUID(),
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      institution: formData.institution || '',
      city: formData.city || '',
      position: formData.position || '',
      notes: formData.notes || '',
      isFaculty: formData.isFaculty || false,
      courses: formData.isFaculty ? (formData.courses || []) : undefined,
      sgnLink: formData.isFaculty ? (formData.sgnLink || '') : undefined,
      courseModality: formData.isFaculty ? formData.courseModality : undefined,
      classDays: formData.isFaculty ? (formData.classDays || []) : undefined,
      availableDays: formData.isFaculty ? (formData.availableDays || []) : undefined,
      availableShifts: formData.isFaculty ? (formData.availableShifts || []) : undefined
    };

    onSave(contact);
    handleCloseModal();
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      ...contact,
      courses: contact.courses || [],
      classDays: contact.classDays || [],
      availableDays: contact.availableDays || [],
      availableShifts: contact.availableShifts || []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      institution: '',
      city: '',
      position: '',
      notes: '',
      isFaculty: false,
      courses: [],
      sgnLink: '',
      courseModality: 'qualificação',
      classDays: [],
      availableDays: [],
      availableShifts: []
    });
  };

  return (
    <div className={`p-6 ${theme === 'escuro' ? 'bg-gray-900' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <User className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className={`text-2xl font-bold ${
            theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
          }`}>Contatos</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Contato
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar contatos..."
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

        {/* Filter Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              theme === 'escuro'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
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
              {filteredContacts.length} de {contacts.length} contatos
            </span>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className={`p-4 rounded-lg border ${
            theme === 'escuro' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Faculty Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Tipo de Contato
                </label>
                <select
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todos os tipos</option>
                  <option value="faculty">Apenas Docentes</option>
                  <option value="non-faculty">Apenas Não-Docentes</option>
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Cidade
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todas as cidades</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Institution Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Instituição
                </label>
                <select
                  value={institutionFilter}
                  onChange={(e) => setInstitutionFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todas as instituições</option>
                  {uniqueInstitutions.map(institution => (
                    <option key={institution} value={institution}>{institution}</option>
                  ))}
                </select>
              </div>

              {/* Course Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Curso InfoTec
                </label>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    theme === 'escuro'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Todos os cursos</option>
                  {infoTecs.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contacts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className={`rounded-lg border p-6 hover:shadow-lg transition-all duration-200 ${
              theme === 'escuro' 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  contact.isFaculty 
                    ? (theme === 'escuro' ? 'bg-blue-900/30' : 'bg-blue-100')
                    : (theme === 'escuro' ? 'bg-gray-700' : 'bg-gray-100')
                }`}>
                  {contact.isFaculty ? (
                    <GraduationCap className={`w-6 h-6 ${
                      theme === 'escuro' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  ) : (
                    <User className={`w-6 h-6 ${
                      theme === 'escuro' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                  }`}>{contact.name}</h3>
                  {contact.isFaculty && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'escuro' 
                        ? 'bg-blue-900/30 text-blue-300' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      Docente
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'escuro'
                      ? 'text-blue-400 hover:bg-gray-700'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(contact.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'escuro'
                      ? 'text-red-400 hover:bg-gray-700'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {contact.email && (
                <div className="flex items-center">
                  <Mail className={`w-4 h-4 mr-2 ${
                    theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                  }`}>{contact.email}</span>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center">
                  <Phone className={`w-4 h-4 mr-2 ${
                    theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                  }`}>{contact.phone}</span>
                </div>
              )}
              
              {contact.institution && (
                <div className="flex items-center">
                  <Building className={`w-4 h-4 mr-2 ${
                    theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                  }`}>{contact.institution}</span>
                </div>
              )}
              
              {contact.city && (
                <div className="flex items-center">
                  <MapPin className={`w-4 h-4 mr-2 ${
                    theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                  }`}>{contact.city}</span>
                </div>
              )}
              
              {contact.position && (
                <div className="flex items-center">
                  <Briefcase className={`w-4 h-4 mr-2 ${
                    theme === 'escuro' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-600'
                  }`}>{contact.position}</span>
                </div>
              )}

              {contact.isFaculty && contact.courses && contact.courses.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className={`text-xs font-medium mb-2 ${
                    theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Cursos InfoTec:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {contact.courses.map(courseId => {
                      const course = infoTecs.find(c => c.id === courseId);
                      return course ? (
                        <span
                          key={courseId}
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: course.color }}
                        >
                          {course.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className={`text-center py-12 ${
          theme === 'escuro' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum contato encontrado</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl ${
            theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${
                  theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {editingContact ? 'Editar Contato' : 'Novo Contato'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'escuro'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Nome Completo *</label>
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
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Telefone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Instituição</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Nome da instituição"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Cidade</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Selecione uma cidade</option>
                      {santaCatarinaCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Cargo/Função</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'escuro'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Cargo ou função"
                    />
                  </div>
                </div>

                {/* Faculty Checkbox */}
                <div className={`border-t pt-4 ${
                  theme === 'escuro' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFaculty}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        isFaculty: e.target.checked,
                        courses: e.target.checked ? formData.courses : [],
                        sgnLink: e.target.checked ? formData.sgnLink : '',
                        courseModality: e.target.checked ? formData.courseModality : 'qualificação',
                        classDays: e.target.checked ? formData.classDays : [],
                        availableDays: e.target.checked ? formData.availableDays : [],
                        availableShifts: e.target.checked ? formData.availableShifts : []
                      })}
                      className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                      <span className={`text-sm font-medium ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        É um docente interessado em ministrar cursos
                      </span>
                    </div>
                  </label>
                </div>

                {/* Faculty-specific fields */}
                {formData.isFaculty && (
                  <div className={`rounded-lg p-4 space-y-4 ${
                    theme === 'escuro' 
                      ? 'bg-blue-900/20 border border-blue-700' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <h4 className={`font-medium flex items-center ${
                      theme === 'escuro' ? 'text-blue-300' : 'text-blue-900'
                    }`}>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Informações do Docente
                    </h4>

                    {/* SGN Link */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Link className="w-4 h-4 inline mr-1" />
                        Link do SGN
                      </label>
                      <input
                        type="url"
                        value={formData.sgnLink}
                        onChange={(e) => setFormData({ ...formData, sgnLink: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'escuro'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="https://sgn.exemplo.com/perfil"
                      />
                    </div>

                    {/* Course Modality */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Modalidade de Interesse
                      </label>
                      <select
                        value={formData.courseModality}
                        onChange={(e) => setFormData({ ...formData, courseModality: e.target.value as any })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'escuro'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="qualificação">Qualificação</option>
                        <option value="desenvolvimento">Desenvolvimento</option>
                        <option value="técnico">Técnico</option>
                      </select>
                    </div>

                    {/* Class Days */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Dias de Aula Preferidos
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {weekDays.map(day => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(formData.classDays || []).includes(day)}
                              onChange={() => handleDayToggle(day, 'classDays')}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${
                              theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{day.split('-')[0]}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Available Days */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Dias Disponíveis para Lecionar
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {weekDays.map(day => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(formData.availableDays || []).includes(day)}
                              onChange={() => handleDayToggle(day, 'availableDays')}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${
                              theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{day.split('-')[0]}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Available Shifts */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Clock className="w-4 h-4 inline mr-1" />
                        Turnos Disponíveis
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {shifts.map(shift => (
                          <label key={shift} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(formData.availableShifts || []).includes(shift)}
                              onChange={() => handleShiftToggle(shift)}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm ${
                              theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{shift}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    {infoTecs.length > 0 && (
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Cursos de Interesse
                        </label>
                        <div className={`space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3 ${
                          theme === 'escuro' 
                            ? 'border-gray-600 bg-gray-700' 
                            : 'border-gray-200 bg-white'
                        }`}>
                          {infoTecs.map(course => (
                            <label key={course.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={(formData.courses || []).includes(course.id)}
                                onChange={() => handleCourseToggle(course.id)}
                                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: course.color }}
                                />
                                <span className={`text-sm ${
                                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                                }`}>{course.name}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Observações</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      theme === 'escuro'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Informações adicionais sobre o contato..."
                  />
                </div>

                {/* Buttons */}
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
        </div>
      )}
    </div>
  );
}
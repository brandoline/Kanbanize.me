import React, { useState } from 'react';
import { Contact } from '../types';
import { Save, UserPlus, ArrowLeft, Check, Kanban, GraduationCap, Link, Calendar, Clock, Search, X } from 'lucide-react';

interface RegistrationPageProps {
  onSave: (contact: Contact) => void;
  onBack: () => void;
  infoTecs?: any[];
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

export function RegistrationPage({ onSave, onBack, infoTecs = [] }: RegistrationPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    institution: '',
    city: '',
    position: '',
    notes: '',
    isFaculty: false,
    courses: [] as string[],
    sgnLink: '',
    courseModality: 'qualificação' as 'qualificação' | 'desenvolvimento' | 'técnico',
    classDays: [] as string[],
    availableDays: [] as string[],
    availableShifts: [] as string[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const filteredCourses = infoTecs.filter(course =>
    course.name.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const santaCatarinaCities = [
    'Abdon Batista',
    'Abelardo Luz',
    'Agrolândia',
    'Agronômica',
    'Água Doce',
    'Águas de Chapecó',
    'Águas Frias',
    'Águas Mornas',
    'Alfredo Wagner',
    'Alto Bela Vista',
    'Anchieta',
    'Angelina',
    'Anita Garibaldi',
    'Anitápolis',
    'Antônio Carlos',
    'Apiúna',
    'Arabutã',
    'Araquari',
    'Araranguá',
    'Armazém',
    'Arroio Trinta',
    'Arvoredo',
    'Ascurra',
    'Atalanta',
    'Aurora',
    'Balneário Arroio do Silva',
    'Balneário Barra do Sul',
    'Balneário Camboriú',
    'Balneário Gaivota',
    'Balneário Piçarras',
    'Balneário Rincão',
    'Bandeirante',
    'Barra Bonita',
    'Barra Velha',
    'Bela Vista do Toldo',
    'Belmonte',
    'Benedito Novo',
    'Biguaçu',
    'Blumenau',
    'Bocaina do Sul',
    'Bom Jardim da Serra',
    'Bom Jesus',
    'Bom Jesus do Oeste',
    'Bom Retiro',
    'Bombinhas',
    'Botuverá',
    'Braço do Norte',
    'Braço do Trombudo',
    'Brunópolis',
    'Brusque',
    'Caçador',
    'Caibi',
    'Calmon',
    'Camboriú',
    'Campo Alegre',
    'Campo Belo do Sul',
    'Campo Erê',
    'Campos Novos',
    'Canelinha',
    'Canoinhas',
    'Capão Alto',
    'Capinzal',
    'Capivari de Baixo',
    'Catanduvas',
    'Caxambu do Sul',
    'Celso Ramos',
    'Cerro Negro',
    'Chapadão do Lageado',
    'Chapecó',
    'Cocal do Sul',
    'Concórdia',
    'Cordilheira Alta',
    'Coronel Freitas',
    'Coronel Martins',
    'Correia Pinto',
    'Corupá',
    'Criciúma',
    'Cunha Porã',
    'Cunhataí',
    'Curitibanos',
    'Descanso',
    'Dionísio Cerqueira',
    'Dona Emma',
    'Doutor Pedrinho',
    'Entre Rios',
    'Ermo',
    'Erval Velho',
    'Faxinal dos Guedes',
    'Flor do Sertão',
    'Florianópolis',
    'Formosa do Sul',
    'Forquilhinha',
    'Fraiburgo',
    'Frei Rogério',
    'Galvão',
    'Garopaba',
    'Garuva',
    'Gaspar',
    'Governador Celso Ramos',
    'Grão-Pará',
    'Gravatal',
    'Guabiruba',
    'Guaraciaba',
    'Guaramirim',
    'Guarujá do Sul',
    'Guatambu',
    'Herval d\'Oeste',
    'Ibiam',
    'Ibicaré',
    'Ibirama',
    'Içara',
    'Ilhota',
    'Imaruí',
    'Imbituba',
    'Imbuia',
    'Indaial',
    'Iomerê',
    'Ipira',
    'Iporã do Oeste',
    'Ipuaçu',
    'Ipumirim',
    'Iraceminha',
    'Irani',
    'Irati',
    'Irineópolis',
    'Itá',
    'Itaiópolis',
    'Itajaí',
    'Itapema',
    'Itapiranga',
    'Itapoá',
    'Ituporanga',
    'Jaborá',
    'Jacinto Machado',
    'Jaguaruna',
    'Jaraguá do Sul',
    'Jardinópolis',
    'Joaçaba',
    'Joinville',
    'José Boiteux',
    'Jupiá',
    'Lacerdópolis',
    'Lages',
    'Laguna',
    'Lajeado Grande',
    'Laurentino',
    'Lauro Müller',
    'Lebon Régis',
    'Leoberto Leal',
    'Lindóia do Sul',
    'Lontras',
    'Luiz Alves',
    'Luzerna',
    'Macieira',
    'Mafra',
    'Major Gercino',
    'Major Vieira',
    'Maracajá',
    'Maravilha',
    'Marema',
    'Massaranduba',
    'Matos Costa',
    'Meleiro',
    'Mirim Doce',
    'Modelo',
    'Mondaí',
    'Monte Carlo',
    'Monte Castelo',
    'Morro da Fumaça',
    'Morro Grande',
    'Navegantes',
    'Nova Erechim',
    'Nova Itaberaba',
    'Nova Trento',
    'Nova Veneza',
    'Novo Horizonte',
    'Orleans',
    'Otacílio Costa',
    'Ouro',
    'Ouro Verde',
    'Paial',
    'Painel',
    'Palhoça',
    'Palma Sola',
    'Palmeira',
    'Palmitos',
    'Papanduva',
    'Paraíso',
    'Passo de Torres',
    'Passos Maia',
    'Paulo Lopes',
    'Pedras Grandes',
    'Penha',
    'Peritiba',
    'Pescaria Brava',
    'Petrolândia',
    'Pinhalzinho',
    'Pinheiro Preto',
    'Piratuba',
    'Planalto Alegre',
    'Pomerode',
    'Ponte Alta',
    'Ponte Alta do Norte',
    'Ponte Serrada',
    'Porto Belo',
    'Porto União',
    'Pouso Redondo',
    'Praia Grande',
    'Presidente Castello Branco',
    'Presidente Getúlio',
    'Presidente Nereu',
    'Princesa',
    'Quilombo',
    'Rancho Queimado',
    'Rio das Antas',
    'Rio do Campo',
    'Rio do Oeste',
    'Rio do Sul',
    'Rio dos Cedros',
    'Rio Fortuna',
    'Rio Negrinho',
    'Rio Rufino',
    'Riqueza',
    'Rodeio',
    'Romelândia',
    'Salete',
    'Saltinho',
    'Salto Veloso',
    'Sangão',
    'Santa Cecília',
    'Santa Helena',
    'Santa Rosa de Lima',
    'Santa Rosa do Sul',
    'Santa Terezinha',
    'Santa Terezinha do Progresso',
    'Santiago do Sul',
    'Santo Amaro da Imperatriz',
    'São Bento do Sul',
    'São Bernardino',
    'São Bonifácio',
    'São Carlos',
    'São Cristóvão do Sul',
    'São Domingos',
    'São Francisco do Sul',
    'São João Batista',
    'São João do Itaperiú',
    'São João do Oeste',
    'São João do Sul',
    'São Joaquim',
    'São José',
    'São José do Cedro',
    'São José do Cerrito',
    'São Lourenço do Oeste',
    'São Ludgero',
    'São Martinho',
    'São Miguel da Boa Vista',
    'São Miguel do Oeste',
    'São Pedro de Alcântara',
    'Saudades',
    'Schroeder',
    'Seara',
    'Serra Alta',
    'Siderópolis',
    'Sombrio',
    'Sul Brasil',
    'Taió',
    'Tangará',
    'Tigrinhos',
    'Tijucas',
    'Timbé do Sul',
    'Timbó',
    'Timbó Grande',
    'Três Barras',
    'Treviso',
    'Treze de Maio',
    'Treze Tílias',
    'Trombudo Central',
    'Tubarão',
    'Tunápolis',
    'Turvo',
    'União do Oeste',
    'Urubici',
    'Urupema',
    'Urussanga',
    'Vargeão',
    'Vargem',
    'Vargem Bonita',
    'Vidal Ramos',
    'Videira',
    'Vitor Meireles',
    'Witmarsum',
    'Xanxerê',
    'Xavantina',
    'Xaxim',
    'Zortéa'
  ];

  const filteredCities = santaCatarinaCities.filter(city =>
    city.toLowerCase().includes((citySearchTerm || formData.city || '').toLowerCase())
  );

  // Close city dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowCityDropdown(false);
      }
    };

    if (showCityDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCityDropdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);

    const contact: Contact = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      institution: formData.institution.trim(),
      city: formData.city.trim(),
      position: formData.position.trim(),
      notes: formData.notes.trim(),
      isFaculty: formData.isFaculty,
      courses: formData.isFaculty ? formData.courses : [],
      sgnLink: formData.isFaculty ? formData.sgnLink.trim() : '',
      courseModality: formData.isFaculty ? formData.courseModality : undefined,
      classDays: formData.isFaculty ? formData.classDays : [],
      availableDays: formData.isFaculty ? formData.availableDays : [],
      availableShifts: formData.isFaculty ? formData.availableShifts : []
    };

    onSave(contact);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 4 seconds
    setTimeout(() => {
      setIsSubmitted(false);
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
    }, 4000);
  };

  const handleCourseToggle = (courseId: string) => {
    const newCourses = formData.courses.includes(courseId)
      ? formData.courses.filter(id => id !== courseId)
      : [...formData.courses, courseId];
    
    setFormData({ ...formData, courses: newCourses });
  };

  const handleDayToggle = (day: string, field: 'classDays' | 'availableDays') => {
    const currentDays = formData[field];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    setFormData({ ...formData, [field]: newDays });
  };

  const handleShiftToggle = (shift: string) => {
    const newShifts = formData.availableShifts.includes(shift)
      ? formData.availableShifts.filter(s => s !== shift)
      : [...formData.availableShifts, shift];
    
    setFormData({ ...formData, availableShifts: newShifts });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cadastro Realizado!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Suas informações foram registradas com sucesso. Nossa equipe entrará em contato em breve para dar continuidade ao processo.
          </p>
          <button
            onClick={onBack}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 mx-auto font-medium shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Sistema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Kanban className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Kanbanize.me</h1>
            </div>
            <button
              onClick={onBack}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Sistema
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Cadastro de Contato</h1>
            <p className="text-gray-600 leading-relaxed">
              Preencha suas informações para que nossa equipe possa entrar em contato e fornecer mais detalhes sobre nossos serviços.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instituição</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nome da sua instituição"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        setCitySearchTerm(e.target.value);
                        setShowCityDropdown(true);
                      }}
                      onFocus={() => setShowCityDropdown(true)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Digite ou selecione sua cidade"
                    />
                    {showCityDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredCities.length === 0 ? (
                          <div className="px-4 py-3 text-gray-500 text-sm">
                            Nenhuma cidade encontrada
                          </div>
                        ) : (
                          filteredCities.map(city => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, city });
                                setShowCityDropdown(false);
                                setCitySearchTerm('');
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-sm transition-colors"
                            >
                              {city}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo/Função</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Seu cargo"
                  />
                </div>
              </div>

              {/* Checkbox para docente */}
              <div className="border-t border-gray-200 pt-4">
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
                    <span className="text-sm font-medium text-gray-700">
                      Sou um docente interessado em ministrar cursos
                    </span>
                  </div>
                </label>
              </div>

              {/* Seção específica para docentes */}
              {formData.isFaculty && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-blue-900 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Informações do Docente
                  </h4>

                  {/* Link SGN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Link className="w-4 h-4 inline mr-1" />
                      Link do SGN
                    </label>
                    <input
                      type="url"
                      value={formData.sgnLink}
                      onChange={(e) => setFormData({ ...formData, sgnLink: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://sgn.exemplo.com/perfil"
                    />
                  </div>

                  {/* Modalidade do curso */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modalidade de Interesse
                    </label>
                    <select
                      value={formData.courseModality}
                      onChange={(e) => setFormData({ ...formData, courseModality: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="qualificação">Qualificação</option>
                      <option value="desenvolvimento">Desenvolvimento</option>
                      <option value="técnico">Técnico</option>
                    </select>
                  </div>

                  {/* Dias de aula preferidos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Dias de Aula Preferidos
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {weekDays.map(day => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.classDays.includes(day)}
                            onChange={() => handleDayToggle(day, 'classDays')}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{day.split('-')[0]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dias disponíveis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Dias Disponíveis para Lecionar
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {weekDays.map(day => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.availableDays.includes(day)}
                            onChange={() => handleDayToggle(day, 'availableDays')}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{day.split('-')[0]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Turnos disponíveis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Turnos Disponíveis
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {shifts.map(shift => (
                        <label key={shift} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.availableShifts.includes(shift)}
                            onChange={() => handleShiftToggle(shift)}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{shift}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cursos de interesse */}
                  {infoTecs.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cursos de Interesse
                      </label>
                      <div className="mb-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Buscar cursos..."
                            value={courseSearchTerm}
                            onChange={(e) => setCourseSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {courseSearchTerm && (
                            <button
                              type="button"
                              onClick={() => setCourseSearchTerm('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {filteredCourses.length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            {infoTecs.length === 0 
                              ? 'Nenhum curso InfoTec cadastrado' 
                              : 'Nenhum curso encontrado'}
                          </p>
                        ) : (
                          filteredCourses.map(course => (
                            <label key={course.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.courses.includes(course.id)}
                                onChange={() => handleCourseToggle(course.id)}
                                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: course.color }}
                                />
                                <span className="text-sm text-gray-700">{course.name}</span>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Informações adicionais, interesse em cursos específicos, etc. (opcional)"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
                className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" />
                    Cadastrar Contato
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Ao se cadastrar, você concorda em receber comunicações sobre nossos cursos e serviços.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
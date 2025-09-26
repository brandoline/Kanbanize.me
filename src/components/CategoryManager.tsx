import React, { useState } from 'react';
import { Category } from '../types';
import { X, Save, Plus, Palette } from 'lucide-react';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export function CategoryManager({ isOpen, onClose, categories, onSave, onDelete }: CategoryManagerProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: predefinedColors[0]
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Get theme from localStorage or default to 'claro'
  const [theme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      return stored ? JSON.parse(stored) : 'claro';
    } catch {
      return 'claro';
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const category: Category = {
      id: editingCategory?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      color: formData.color
    };

    onSave(category);
    handleClose();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      color: predefinedColors[0]
    });
    setEditingCategory(null);
    onClose();
  };

  const handleDelete = (categoryId: string) => {
    if (categories.length <= 1) {
      alert('Não é possível excluir a única categoria. Adicione outra categoria primeiro.');
      return;
    }
    
    if (confirm('Tem certeza de que deseja excluir esta categoria? As tarefas serão movidas para a primeira categoria disponível.')) {
      onDelete(categoryId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto ${
        theme === 'escuro' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold flex items-center ${
              theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              <Palette className="w-6 h-6 mr-3 text-blue-600" />
              Gerenciar Categorias
            </h2>
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

          {/* Add/Edit Form */}
          <form onSubmit={handleSubmit} className={`mb-8 p-4 rounded-lg ${
            theme === 'escuro' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'escuro'
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Digite o nome da categoria"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'escuro' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Cor da Categoria
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800 ring-2 ring-blue-500' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingCategory ? 'Atualizar' : 'Adicionar'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({ name: '', color: predefinedColors[0] });
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === 'escuro'
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold ${
              theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
            }`}>Categorias Existentes</h3>
            {categories.map(category => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-3 border rounded-lg hover:shadow-sm ${
                  theme === 'escuro' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border ${
                      theme === 'escuro' ? 'border-gray-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: category.color }}
                  />
                  <span className={`font-medium ${
                    theme === 'escuro' ? 'text-gray-100' : 'text-gray-900'
                  }`}>{category.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      theme === 'escuro'
                        ? 'text-blue-400 hover:bg-gray-600'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={categories.length <= 1}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors disabled:cursor-not-allowed ${
                      theme === 'escuro'
                        ? 'text-red-400 hover:bg-gray-600 disabled:text-gray-500'
                        : 'text-red-600 hover:bg-red-50 disabled:text-gray-400'
                    }`}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
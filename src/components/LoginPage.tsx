import React, { useState } from 'react';
import { User } from '../types';
import { Kanban, Mail, User as UserIcon, Lock, Eye, EyeOff, UserPlus, LogIn, Chrome } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  users: User[];
  onCreateAccount: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

export function LoginPage({ onLogin, users, onCreateAccount }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [useUsername, setUseUsername] = useState(false);
  const [useGoogleAuth, setUseGoogleAuth] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Simular autenticação com Google
      // Em uma implementação real, você usaria a API do Google
      const mockGoogleUser = {
        email: 'usuario@gmail.com',
        name: 'Usuário Google',
        googleId: '123456789'
      };

      if (isLogin) {
        // Tentar encontrar usuário existente
        const existingUser = users.find(u => u.email === mockGoogleUser.email);
        if (existingUser) {
          onLogin(existingUser);
        } else {
          setError('Conta Google não encontrada. Crie uma conta primeiro.');
        }
      } else {
        // Criar nova conta com Google
        if (users.some(u => u.email === mockGoogleUser.email)) {
          setError('Esta conta Google já está cadastrada');
          return;
        }

        const newUser: Omit<User, 'id' | 'createdAt'> = {
          username: mockGoogleUser.name,
          email: mockGoogleUser.email,
          password: '', // Senha vazia para contas Google
        };

        onCreateAccount(newUser);
      }
    } catch (err) {
      setError('Erro ao autenticar com Google. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const identifier = formData.email;
        const user = users.find(u => 
          u.email === identifier
        );

        if (!user || user.password !== formData.password) {
          setError('Credenciais inválidas');
          return;
        }

        onLogin(user);
      } else {
        // Registration logic
        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem');
          return;
        }

        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          return;
        }

        // Check if email already exists
        if (users.some(u => u.email === formData.email)) {
          setError('Este email já está cadastrado');
          return;
        }

        const newUser: Omit<User, 'id' | 'createdAt'> = {
          username: undefined,
          email: formData.email,
          password: formData.password
        };

        onCreateAccount(newUser);
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Kanban className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kanbanize.me
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Registration: Account Type Selection */}
          {!isLogin && (
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Conta
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    checked={!useGoogleAuth}
                    onChange={() => {
                      setUseUsername(false);
                      setUseGoogleAuth(false);
                    }}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">Email e senha</span>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    checked={useGoogleAuth}
                    onChange={() => {
                      setUseUsername(false);
                      setUseGoogleAuth(true);
                    }}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    <Chrome className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm text-gray-700">Com conta do Google</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Login: Account Type Selection */}
          {isLogin && (
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Entrar com
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="loginType"
                    checked={!useGoogleAuth}
                    onChange={() => {
                      setUseUsername(false);
                      setUseGoogleAuth(false);
                    }}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">Email</span>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="loginType"
                    checked={useGoogleAuth}
                    onChange={() => {
                      setUseUsername(false);
                      setUseGoogleAuth(true);
                    }}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    <Chrome className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm text-gray-700">Conta do Google</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Google Auth Button */}
          {useGoogleAuth && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Chrome className="w-5 h-5 mr-2 text-red-600" />
                )}
                {isLogin ? 'Entrar com Google' : 'Criar conta com Google'}
              </button>
              <div className="text-center">
                <span className="text-sm text-gray-500">
                  {isLogin 
                    ? 'Clique para fazer login com sua conta Google' 
                    : 'Clique para criar uma conta usando sua conta Google'
                  }
                </span>
              </div>
            </div>
          )}

          {/* Email field */}
          {!useGoogleAuth && (
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>
            </div>
          )}

          {/* Password field */}
          {!useGoogleAuth && (
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={isLogin ? "Digite sua senha" : "Mínimo 6 caracteres"}
                minLength={isLogin ? undefined : 6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            </div>
          )}

          {/* Confirm Password field (registration only) */}
          {!isLogin && !useGoogleAuth && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirme sua senha"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!useGoogleAuth && (
            <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </>
            )}
            </button>
          )}

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                type="button"
                onClick={switchMode}
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>
          </div>
        </form>

        {/* Divider for Google Auth */}
        {useGoogleAuth && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Chrome className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    Autenticação com Google
                  </p>
                  <p className="text-blue-800">
                    {isLogin 
                      ? 'Use sua conta Google para fazer login de forma rápida e segura.'
                      : 'Crie sua conta usando os dados da sua conta Google. Não é necessário criar uma senha.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
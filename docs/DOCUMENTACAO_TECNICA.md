# Documentação Técnica – Kanbanize.me

## 1. Visão Geral

- **Nome do Produto:** Kanbanize.me
- **Descrição:** Sistema completo de gerenciamento de tarefas em formato Kanban que permite autenticação de usuários, criação e organização de tarefas por categorias, gerenciamento de contatos, cursos InfoTec e acompanhamento de status em tempo real com suporte a anexos e filtros avançados.
- **Stack Principal:**
  • Frontend: React + TypeScript + Tailwind CSS + Vite
  • Backend: Supabase (PostgreSQL + Auth + Storage + Real-time)
  • Deploy: Bolt Hosting
  • Ícones: Lucide React
  • Exportação: jsPDF + jsPDF-AutoTable

## 2. Arquitetura do Sistema

- **Diagrama Simplificado:** [React Frontend] → [Supabase API / Auth / Real-time] → [PostgreSQL Database]
- **Principais módulos:**
  • Autenticação (Supabase Auth com email/senha)
  • API REST (gerada automaticamente pelo Supabase)
  • Real-time subscriptions (atualizações em tempo real)
  • Gerenciamento de estado (React Hooks customizados)
  • Sistema de temas (claro/escuro)
  • Exportação de dados (CSV/PDF)

## 3. Banco de Dados

- **Banco:** PostgreSQL (Supabase)
- **Tabelas principais:**
  • `categories(id, user_id, name, color, created_at)`
  • `tasks(id, user_id, title, priority, contact_id, status, start_date, due_date, attachments, notes, last_updated, category_id, reminder_enabled, is_interrupted, created_at)`
  • `contacts(id, user_id, name, phone, email, institution, city, position, notes, is_faculty, courses, sgn_link, course_modality, class_days, available_days, available_shifts, created_at)`
  • `info_tecs(id, user_id, name, period, modality, color, start_date, student_days, class_days, duration, priority, created_at)`
  • `users(id, username, email, created_at)` - extensão do auth.users

- **Relações:**
  • `auth.users` (1:N) `categories`
  • `auth.users` (1:N) `tasks`
  • `auth.users` (1:N) `contacts`
  • `auth.users` (1:N) `info_tecs`
  • `categories` (1:N) `tasks`
  • `contacts` (1:N) `tasks`

- **Índices para Performance:**
  • `idx_categories_user_id` - busca por categorias do usuário
  • `idx_contacts_user_id` - busca por contatos do usuário
  • `idx_tasks_user_id` - busca por tarefas do usuário
  • `idx_tasks_category_id` - busca por tarefas de categoria
  • `idx_info_tecs_user_id` - busca por cursos do usuário

## 4. API / Endpoints

- **Base URL:** https://qxbivnfqvrazimylyvgm.supabase.co/rest/v1
- **Exemplos principais:**
  • `GET /categories` → lista categorias do usuário
  • `POST /categories` → cria nova categoria
  • `GET /tasks` → lista tarefas do usuário
  • `POST /tasks` → cria nova tarefa
  • `PATCH /tasks?id=eq.{id}` → atualiza tarefa específica
  • `DELETE /tasks?id=eq.{id}` → remove tarefa específica
  • `GET /contacts` → lista contatos do usuário
  • `POST /contacts` → cria novo contato
  • `GET /info_tecs` → lista cursos InfoTec do usuário
  • `POST /info_tecs` → cria novo curso InfoTec

- **Headers obrigatórios:**
  • `Authorization: Bearer {supabase_anon_key}`
  • `Content-Type: application/json`
  • `Prefer: return=representation` (para operações que retornam dados)

## 5. Autenticação

- **Método:** Supabase Auth (JWT)
- **Tipos suportados:** Email e senha
- **Fluxo de autenticação:**
  1. Usuário cria conta com email/senha e username
  2. Supabase cria registro em `auth.users`
  3. Sistema cria perfil estendido em `public.users`
  4. Supabase retorna token JWT
  5. Frontend armazena sessão automaticamente
  6. Todas as chamadas à API incluem token automaticamente

- **Row Level Security (RLS):**
  • Todas as tabelas têm RLS habilitado
  • Políticas garantem que usuários só acessem seus próprios dados
  • Função `auth.uid()` identifica usuário autenticado

## 6. Funcionalidades Principais

### 6.1 Gerenciamento de Tarefas
- **Visualizações:**
  • Kanban (colunas: Não Iniciado, Em Andamento, Concluído)
  • Ver Todas (tabela expandida com todos os dados)
- **Recursos:**
  • Drag & drop entre colunas
  • Prioridades (baixa, média, alta)
  • Anexos de arquivos
  • Datas de início e conclusão
  • Lembretes de notificação
  • Sistema de interrupção/reativação
  • Filtros por prioridade, status, contato
  • Busca por título e observações

### 6.2 Gerenciamento de Contatos
- **Tipos de contato:**
  • Contatos gerais
  • Docentes (com informações específicas)
- **Informações de docentes:**
  • Cursos de interesse
  • Link do SGN
  • Modalidade preferida
  • Dias e turnos disponíveis
  • Dias de aula preferidos

### 6.3 Cursos InfoTec
- **Informações:**
  • Nome, período, modalidade
  • Cor personalizada
  • Data de início, duração
  • Dias dos alunos e de aula
  • Sistema de prioridades

### 6.4 Sistema de Categorias
- **Recursos:**
  • Cores personalizáveis
  • Organização de tarefas
  • Categorias padrão criadas automaticamente

## 7. Deploy / Infraestrutura

- **Frontend:** Bolt Hosting
  • URL de produção: https://kanbanize-me-e520.bolt.host/
  • Build automático via Vite
  • Hospedagem estática com CDN Cloudflare

- **Backend:** Supabase (gerenciado na nuvem)
  • URL: https://qxbivnfqvrazimylyvgm.supabase.co
  • PostgreSQL 15+ com extensões habilitadas
  • Backup automático
  • Monitoramento integrado

- **Ambientes:**
  • Produção → https://kanbanize-me-e520.bolt.host/
  • Desenvolvimento → http://localhost:5173

## 8. Segurança

- **Row Level Security (RLS):**
  • Ativo em todas as tabelas públicas
  • Políticas por operação (SELECT, INSERT, UPDATE, DELETE)
  • Isolamento completo de dados por usuário

- **Autenticação:**
  • Tokens JWT com expiração automática
  • Refresh tokens para sessões longas
  • Validação server-side em todas as operações

- **Validações:**
  • Constraints de banco para integridade
  • Validação de tipos no frontend
  • Sanitização de inputs

## 9. Configurações de Desenvolvimento

### 9.1 Variáveis de Ambiente
```env
VITE_SUPABASE_URL=https://qxbivnfqvrazimylyvgm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 9.2 Scripts Disponíveis
- `npm run dev` → servidor de desenvolvimento
- `npm run build` → build de produção
- `npm run preview` → preview do build
- `npm run lint` → verificação de código

### 9.3 Estrutura de Pastas
```
src/
├── components/          # Componentes React
├── hooks/              # Hooks customizados
├── lib/                # Configurações (Supabase)
├── types/              # Definições TypeScript
├── utils/              # Utilitários (exportação)
└── data/               # Dados iniciais
```

## 10. Fluxo de Desenvolvimento

- **Controle de versão:** Git (integrado ao Bolt)
- **Padrão de commits:** Commits descritivos em português
- **Deploy:** Automático via Bolt Hosting
- **Migrações:** Gerenciadas pelo Supabase
- **Testes:** Testes manuais em desenvolvimento

## 11. Monitoramento e Logs

- **Supabase Dashboard:**
  • Logs de API em tempo real
  • Métricas de performance
  • Monitoramento de autenticação
  • Análise de queries

- **Bolt Hosting:**
  • Logs de deploy
  • Métricas de CDN
  • Uptime monitoring

## 12. Backup e Recuperação

- **Banco de dados:**
  • Backup automático diário (Supabase)
  • Point-in-time recovery disponível
  • Exportação manual via SQL

- **Código:**
  • Versionamento Git
  • Deploy rollback disponível

## 13. Performance

- **Frontend:**
  • Lazy loading de componentes
  • Otimização de re-renders
  • Compressão de assets

- **Backend:**
  • Índices otimizados
  • Connection pooling
  • Cache de queries

## 14. Limitações Conhecidas

- **Anexos:** Simulados (não há upload real de arquivos)
- **Notificações:** Sistema de lembretes não implementado
- **Múltiplos contatos:** Interface suporta, mas banco salva apenas um
- **Offline:** Não há suporte offline

## 15. Roadmap Futuro

- Implementação real de upload de arquivos
- Sistema de notificações push
- Suporte completo a múltiplos contatos por tarefa
- Relatórios avançados
- Integração com calendários
- App mobile (React Native)

---

**Última atualização:** Janeiro 2025  
**Versão da documentação:** 1.0  
**Responsável técnico:** Sistema Kanbanize.me
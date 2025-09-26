# Supabase Database Scripts

Este diretório contém scripts SQL para criar e modificar as tabelas do banco de dados Supabase.

## Como usar

1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Execute os scripts na ordem numerada:

### Scripts de Criação (Execute na ordem):

1. **01_create_categories_table.sql** - Cria a tabela de categorias
2. **02_create_contacts_table.sql** - Cria a tabela de contatos
3. **03_create_tasks_table.sql** - Cria a tabela de tarefas
4. **04_create_info_tecs_table.sql** - Cria a tabela de cursos InfoTec
5. **05_create_users_table.sql** - Cria a tabela de usuários (perfil)

### Scripts de Modificação:

6. **06_table_modifications.sql** - Exemplos de modificações de tabelas

## Estrutura das Tabelas

### Categories
- Armazena categorias de tarefas
- Cada usuário tem suas próprias categorias

### Contacts
- Armazena informações de contatos
- Suporte para docentes com informações específicas

### Tasks
- Tabela principal de tarefas
- Suporte para múltiplos contatos por tarefa
- Sistema de prioridades e status

### Info Tecs
- Informações sobre cursos técnicos
- Gerenciamento de modalidades e prioridades

### Users
- Extensão da tabela auth.users do Supabase
- Armazena informações adicionais do perfil

## Segurança

Todas as tabelas têm:
- **Row Level Security (RLS)** habilitado
- **Políticas** que garantem que usuários só acessem seus próprios dados
- **Índices** para melhor performance
- **Constraints** para validação de dados

## Notas Importantes

- Execute os scripts na ordem numerada
- Verifique se não há erros antes de prosseguir
- Faça backup antes de executar modificações
- Teste em ambiente de desenvolvimento primeiro
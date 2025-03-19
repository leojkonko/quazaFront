# Sistema de Autenticação com Vue 3 + TypeScript

Este projeto é um sistema de autenticação completo construído com Vue 3, TypeScript e Vite, apresentando uma interface moderna e responsiva com Tailwind CSS.

## 🚀 Tecnologias Utilizadas

- [Vue 3](https://vuejs.org/) com Composition API e TypeScript
- [Vite](https://vitejs.dev/) para build e desenvolvimento
- [Pinia](https://pinia.vuejs.org/) para gerenciamento de estado
- [Vue Router](https://router.vuejs.org/) para navegação
- [Tailwind CSS](https://tailwindcss.com/) para estilização
- [Vue Toast Notification](https://github.com/ankurk91/vue-toast-notification) para notificações
- [Vue The Mask](https://github.com/vuejs-tips/vue-the-mask) para máscaras de input

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Uma API de autenticação rodando em http://localhost:5000 (ou configurar URL diferente)

## 🔧 Instalação

1. Clone o repositório:
\`\`\`bash
git clone <seu-repositorio>
cd vite-project
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
# ou
yarn
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Ajuste o arquivo .env com suas configurações:
\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`

## 🚀 Executando o Projeto

Para rodar em desenvolvimento:
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

Para build de produção:
\`\`\`bash
npm run build
# ou
yarn build
\`\`\`

Para preview do build:
\`\`\`bash
npm run preview
# ou
yarn preview
\`\`\`

## 🏗️ Estrutura do Projeto

\`\`\`
src/
├── assets/         # Arquivos estáticos
├── components/     # Componentes Vue reutilizáveis
├── config/        # Configurações da aplicação
├── constants/     # Constantes e enums
├── services/      # Serviços de API
├── stores/        # Stores Pinia
└── types/         # Definições de tipos TypeScript
\`\`\`

## 🛠️ Funcionalidades

### Autenticação
- Login com email e senha
- Registro de novo usuário com validações
- Logout
- Proteção de rotas
- Persistência de sessão

### Interface
- Design responsivo com Tailwind CSS
- Notificações toast para feedback
- Máscaras de input para campos como CPF
- Validação de formulários
- Indicadores de loading
- Mensagens de erro customizadas

## 📝 Serviços e Stores

### AuthService
Responsável pela comunicação com a API de autenticação:
- `register`: Cadastro de novos usuários
- `login`: Autenticação de usuários
- `logout`: Finalização de sessão

### AuthStore (Pinia)
Gerencia o estado de autenticação:
- Armazenamento de dados do usuário
- Controle de estado de loading
- Gestão de erros
- Persistência de sessão

## 🔒 Rotas Protegidas

- `/login`: Página de login (público)
- `/register`: Página de cadastro (público)
- `/dashboard`: Dashboard do usuário (protegido)

## 🌐 API Endpoints

O projeto espera uma API com os seguintes endpoints:

- `POST /api/usuario/cadastro`: Registro de usuário
- `POST /api/usuario/login`: Autenticação
- `POST /api/usuario/logout`: Logout

## ⚙️ Configuração da API

A API deve retornar as respostas no seguinte formato:

### Sucesso
\`\`\`json
{
    "success": true,
    "data": {
        "id": number,
        "nomeCompleto": string,
        "email": string
    },
    "message": string
}
\`\`\`

### Erro
\`\`\`json
{
    "success": false,
    "message": string,
    "errors?: string[],
    "validationErrors?: Record<string, string[]>
}
\`\`\`

## 🧪 Boas Práticas Implementadas

- Tipagem forte com TypeScript
- Composables para lógica reutilizável
- Gerenciamento de estado centralizado com Pinia
- Tratamento de erros consistente
- Feedback visual para ações do usuário
- Código limpo e bem organizado
- Separação clara de responsabilidades

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

# 📦 Sistema de Cadastro de Produtos

Um sistema completo de cadastro de produtos desenvolvido com arquitetura Full Stack, permitindo criar, visualizar, editar e excluir produtos de forma intuitiva.

## 🚀 Tecnologias Utilizadas

### Frontend
- **TypeScript** - Linguagem de programação com tipagem estática
- Framework/biblioteca para interface -> React
- TailwindCSS

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Para segurança de tipos no servidor
- Express.js
- MONGODB

## 📋 Funcionalidades

- ✅ Cadastro de novos produtos
- ✅ Listagem de produtos cadastrados
- ✅ Edição de produtos existentes
- ✅ Exclusão de produtos
- ✅ Validação de dados
- ✅ Interface responsiva

## 🔧 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Um editor de código (recomendo [VS Code](https://code.visualstudio.com/))

## 💻 Como executar o projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/RondneyLoiola/Cadastro-de-Produtos.git
cd Cadastro-de-Produtos
```

### 2️⃣ Configuração do Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na raiz da pasta backend
# Adicione as configurações necessárias (porta, banco de dados, etc.)

# Execute o servidor
npm run dev
```

O servidor backend estará rodando em `http://localhost:3001`).

### 3️⃣ Configuração do Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

A aplicação frontend estará disponível em `http://localhost:5173`.

## 📁 Estrutura do Projeto

```
Cadastro-de-Produtos/
│
├── backend/              # Servidor Node.js
│   ├── src/             # Código fonte do backend
│   ├── package.json     # Dependências do backend
│   └── ...
│
├── frontend/            # Interface do usuário
│   ├── src/            # Código fonte do frontend
│   ├── public/         # Arquivos públicos
│   ├── package.json    # Dependências do frontend
│   └── ...
│
└── README.md           # Este arquivo
```

## 🎯 Como usar

1. **Adicionar um produto**: Preencha o formulário com as informações do produto (nome, descrição, preço, etc.) e clique em "Cadastrar"
2. **Visualizar produtos**: A lista de produtos aparecerá automaticamente na tela principal
3. **Editar um produto**: Clique no botão "Editar" ao lado do produto desejado
4. **Excluir um produto**: Clique no botão "Excluir" para remover um produto

## 🛠️ Desenvolvimento

### Scripts disponíveis

**Backend:**
```bash
npm run dev      # Inicia o servidor em modo desenvolvimento
npm run build    # Compila o TypeScript para JavaScript
npm start        # Inicia o servidor em modo produção
```

**Frontend:**
```bash
npm start        # Inicia a aplicação em modo desenvolvimento
npm run build    # Cria uma build otimizada para produção
npm test         # Executa os testes
```

## 📝 Aprendizados

Este projeto foi desenvolvido como parte do aprendizado em desenvolvimento Full Stack, abordando:

- Criação de APIs RESTful
- Integração entre frontend e backend
- Uso de TypeScript para maior segurança no código
- Manipulação de banco de dados
- Boas práticas de desenvolvimento web

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

**Rondney Loiola**

- GitHub: [@RondneyLoiola](https://github.com/RondneyLoiola)
- LinkedIn: https://www.linkedin.com/in/rondneyloiola/

---

⭐ Se este projeto te ajudou de alguma forma, considere dar uma estrela no repositório!

## 📞 Contato

Caso tenha alguma dúvida ou sugestão, sinta-se à vontade para abrir uma issue no repositório.

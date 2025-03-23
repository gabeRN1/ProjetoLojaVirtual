# Estrutura do Projeto

## 🗂️ Estrutura de Diretórios

### `pages/`
Contém as páginas principais do projeto:

- **`products.tsx`**: Exibe uma lista de produtos, com funcionalidades para importar, criar e exportar produtos.
- **`register.tsx`**: Formulário de registro de novos usuários.
- **`page.tsx`**: Formulário de login para acessar a página de produtos. Este arquivo foi deixado na pasta raiz do projeto, para ser a primeira coisa que o usuário vê.

### `styles/`
Contém os estilos globais e configuração do TailwindCSS.

- **`globals.css`**: Estilos globais e configuração do TailwindCSS.

### `components/`
Se necessário, você pode adicionar componentes reutilizáveis aqui, mas neste projeto, os componentes estão diretamente nas páginas.

## 🛠️ Decisões Técnicas

- **Next.js**: Utilizamos Next.js pela facilidade na criação de páginas, renderização no lado do servidor (SSR), e suas funcionalidades como rotas dinâmicas e otimização automática.
- **TypeScript**: Usamos TypeScript para garantir um desenvolvimento mais seguro, com tipagem explícita, que ajuda a evitar erros durante a execução.
- **TailwindCSS**: Escolhemos TailwindCSS pela sua abordagem utility-first, que facilita a personalização e acelera o desenvolvimento. Ele também permite criar interfaces rápidas e flexíveis.
- **Autenticação**: Utilizamos um sistema simples de autenticação com token armazenado no `localStorage`. O token é enviado com cada requisição para garantir que o usuário esteja autenticado antes de acessar as páginas de produtos.

## 🔄 Fluxo de Dados e Funcionalidades

### Página de Produtos (`products.tsx`)
- O usuário pode **importar** produtos da API, **exportá-los** para um arquivo CSV e **criar novos produtos**.
- O componente gerencia o estado de produtos, loading e erros.

### Página de Registro (`register.tsx`)
- O usuário pode se **registrar** com validação de senha e confirmação de senha.
- Se o registro for bem-sucedido, um **token** é salvo no `localStorage` e o usuário é redirecionado para a página de produtos.

### Página de Login (`login.tsx`)
- O usuário entra com seu **email** e **senha**, e o sistema retorna um **token de autenticação**, que é armazenado no `localStorage`.

## 🎨 Design e Usabilidade

- **Modo Claro/Escuro**: O projeto permite alternar entre os modos claro e escuro, oferecendo uma melhor experiência de usuário.
- **Responsividade**: A interface foi projetada para ser **responsiva** com o uso do TailwindCSS, garantindo uma boa experiência em dispositivos móveis e desktops.

## ⚠️ Erros e Tratamento de Estado

- Cada página contém **tratamentos de erro** e **estados de loading**.
- Erros de autenticação e problemas de conexão com o servidor são **capturados e exibidos** ao usuário.

---

### 📦 Como Rodar o Projeto

1. Clone o repositório:
    ```bash
    git clone https://github.com/usuario/projeto.git
    cd projeto
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Execute o projeto:
    ```bash
    npm run dev
    ```

4. Acesse o projeto em [http://localhost:3000](http://localhost:3000).

---

### 🚧 Funcionalidades Futuras

- Melhorias no sistema de autenticação.
- Implementação de testes automatizados.
- Suporte a diferentes idiomas.
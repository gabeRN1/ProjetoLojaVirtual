# API de Autenticação e Gerenciamento de Produtos

Esta API permite a autenticação de usuários e o gerenciamento de produtos. As rotas são protegidas por autenticação JWT, e o usuário precisa estar autenticado para acessar as funcionalidades relacionadas a produtos.

## 📍 **Base URL**

A base URL para todas as rotas da API é:

http://localhost:8000/api


---

## 🔐 **Autenticação**

A API utiliza **JSON Web Tokens (JWT)** para autenticação. O token é gerado durante o login ou o registro e deve ser enviado nas requisições subsequentes no cabeçalho `Authorization`.

### Exemplo de cabeçalho de autorização:

```bash
Authorization: Bearer <token>

📋 Rotas de Autenticação
1. Registrar Usuário

    POST /register

    Cria um novo usuário na aplicação.

Parâmetros:

    name (string) - Nome do usuário.

    email (string) - E-mail do usuário (deve ser único).

    password (string) - Senha do usuário.

    password_confirmation (string) - Confirmação da senha.

Resposta de sucesso:

    Código 201 (Criado)

    Exemplo:

    {
      "message": "Usuário registrado com sucesso!",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Resposta de erro:

    Código 422 (Não processável) - Se os dados de entrada forem inválidos.

    Exemplo:

    {
      "errors": {
        "email": ["O campo email é obrigatório."]
      }
    }

2. Login do Usuário

    POST /login

    Realiza o login do usuário e retorna um token JWT.

Parâmetros:

    email (string) - E-mail do usuário.

    password (string) - Senha do usuário.

Resposta de sucesso:

    Código 200 (OK)

    Exemplo:

    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Resposta de erro:

    Código 401 (Não autorizado) - Se as credenciais forem inválidas.

    Exemplo:

    {
      "error": "Credenciais inválidas"
    }

🛒 Rotas de Produtos

As rotas de produtos exigem que o usuário esteja autenticado.
1. Importar Produtos da API Fake

    POST /import-products

    Importa produtos de uma API externa (FakeStoreAPI) e os adiciona ao banco de dados.

Autenticação: Requer token JWT no cabeçalho Authorization.

Resposta de sucesso:

    Código 200 (OK)

    Exemplo:

    {
      "message": "Produtos importados com sucesso!"
    }

Resposta de erro:

    Código 500 (Erro Interno) - Se houver algum erro na importação dos produtos.

    Exemplo:

    {
      "error": "Erro ao importar os produtos"
    }

2. Importar Produtos de um Arquivo CSV

    POST /products/import/csv

    Importa produtos a partir de um arquivo CSV enviado pelo usuário.

Parâmetros:

    file (arquivo) - O arquivo CSV contendo os dados dos produtos.

Resposta de sucesso:

    Código 200 (OK)

    Exemplo:

    {
      "message": "Produtos importados com sucesso"
    }

Resposta de erro:

    Código 422 (Não processável) - Se o arquivo não for válido (não for um CSV).

    Exemplo:

    {
      "error": "Formato de arquivo inválido. Apenas CSVs são aceitos."
    }

3. Exportar Produtos para CSV

    GET /products/export

    Exporte os produtos cadastrados para um arquivo CSV.

Resposta de sucesso:

    Código 200 (OK)

    Retorna um arquivo CSV para download.

⚙️ Middleware

Todas as rotas de produtos (/import-products, /products/export, /products/import/csv, /products) estão protegidas por autenticação JWT. Para acessar essas rotas, o usuário precisa estar autenticado e fornecer um token válido no cabeçalho Authorization.
💻 Exemplo de Uso com Postman ou Curl
Login

curl --request POST \
  --url http://localhost:8000/api/login \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "usuario@example.com",
    "password": "senha123"
  }'

Importar Produtos

curl --request POST \
  --url http://localhost:8000/api/import-products \
  --header 'Authorization: Bearer <seu_token_jwt>'

🚨 Erros Comuns

    400 - Bad Request: A requisição está malformada, geralmente devido a dados faltantes ou inválidos.

    401 - Unauthorized: O token JWT fornecido não é válido ou está ausente.

    422 - Unprocessable Entity: O servidor entende o tipo da requisição, mas os dados fornecidos são inválidos ou não atendem aos critérios de validação.

    500 - Internal Server Error: Algo deu errado no servidor, como um erro na comunicação com uma API externa ou no banco de dados.

📝 Observações Finais

    Segurança: A API está configurada para aceitar apenas requisições com um token JWT válido. Certifique-se de que o token seja incluído no cabeçalho Authorization.

    Taxa de Expiração: O token JWT possui um tempo de vida configurado no backend, após o qual será necessário gerar um novo token.
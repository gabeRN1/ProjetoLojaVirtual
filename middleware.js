const express = require('express');
const cors = require('cors');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*', // Permite todas as origens. Em produção, substitua por 'http://localhost:3000' ou o domínio do seu frontend
  methods: ['*'], // Permite os métodos usados
  allowedHeaders: ['*'], // Permite cabeçalhos usados
  credentials: true, // Permite o envio de cookies/autenticação
}));

// Middleware para lidar com requisições OPTIONS
app.options('*', cors()); // Lida com as requisições OPTIONS de preflight

app.listen(8000, () => {
  console.log('Servidor rodando na porta 8000');
});
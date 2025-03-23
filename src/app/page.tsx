'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false); // Estado para o modo claro/escuro
  const router = useRouter();

  // Função para enviar os dados de login para o backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Salva o token no localStorage
        router.push('/products'); // Redireciona para a página de produtos
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao tentar se conectar com o servidor');
    }
  };

  // Função para alternar entre os modos claro e escuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Função para redirecionar para a página de registro
  const handleRegisterRedirect = () => {
    router.push('/register'); // Redireciona para a página de registro
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-md relative">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 text-sm p-2 rounded-md border"
        >
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Entrar
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        <div className="mt-4 text-center">
          <p>
            Não tem uma conta?{' '}
            <button
              onClick={handleRegisterRedirect}
              className="text-blue-500 hover:underline"
            >
              Registre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
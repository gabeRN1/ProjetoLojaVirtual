interface LoginResponse {
  token: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

// Função para login no backend (API Laravel)
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Importante: inclui cookies de sessão se necessário
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Credenciais inválidas');
    }

    const data: LoginResponse = await response.json();
    return data; // Retorna o token e o usuário (se disponível)
  } catch (error) {
    // Captura erros de rede ou API
    throw new Error(error instanceof Error ? error.message : 'Erro desconhecido');
  }
};
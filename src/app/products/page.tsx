'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';

interface Product {
  id?: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    title: '',
    description: '',
    price: 0,
    image: '',
    category: '',
  });
  const [darkMode, setDarkMode] = useState(false); // Estado para o modo claro/escuro
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Estado de autenticação
  const router = useRouter();

  // Verificar se o token existe no localStorage antes de renderizar a página
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Se o token não estiver presente, redireciona para a página de login
    if (!token) {
      router.push('/');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true); // Usuário está autenticado
    }
  }, [router]);

  // Se a autenticação não foi verificada ainda, não renderiza nada
  if (isAuthenticated === null) {
    return <div>Carregando...</div>; // Ou algum componente de loading
  }

  // Função para importar produtos da API fake
  const importProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Você precisa estar logado.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
        setError(null);
      } else {
        setError(data.message || 'Erro ao importar produtos');
      }
    } catch (err) {
      setError('Erro ao tentar se conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um novo produto
  const createProduct = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Você precisa estar logado.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (response.ok) {
        setProducts((prevProducts) => [...prevProducts, data]);
        setError(null);
      } else {
        setError(data.message || 'Erro ao criar produto');
      }
    } catch (err) {
      setError('Erro ao tentar se conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Função para exportar os produtos para CSV
  const exportProductsToCSV = () => {
    const headers = ['ID', 'Title', 'Price', 'Category'];
    const rows = products.map((product) => [
      product.id,
      product.title,
      product.price,
      product.category,
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';

    rows.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'produtos.csv');
    document.body.appendChild(link);
    link.click();
  };

  // Função para importar produtos de um arquivo CSV
  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Checando se há um arquivo
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = function (event) {
        const text = event.target?.result as string;
        const rows = text.split('\n').slice(1); // Ignora o cabeçalho

        // Modificando para garantir que todos os campos estejam presentes
        const productsFromCSV = rows.map((row) => {
          const [id, title, price, category] = row.split(',');

          // Agora estamos garantindo que todos os campos sejam preenchidos
          return {
            id: Number(id), // Convertendo para número
            title,
            description: '', // O campo description é necessário
            price: Number(price), // Convertendo para número
            image: '', // O campo image é necessário
            category,
          };
        });

        setProducts(productsFromCSV);
      };
      reader.readAsText(file);
    } else {
      alert('Por favor, envie um arquivo CSV válido.');
    }
  };

  // Função para lidar com a alteração dos dados do novo produto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Função para alternar entre os modos claro e escuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-4xl p-8 space-y-12"> {/* Aumentando o padding e o espaçamento */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 text-sm p-2 rounded-md border"
        >
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>

        <h1 className="text-4xl font-semibold text-center">Produtos</h1> {/* Aumentando o tamanho do título */}
        
        <div className="flex justify-center space-x-6"> {/* Aumentando o espaçamento entre os botões */}
          <button
            onClick={exportProductsToCSV}
            disabled={products.length === 0}
            className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Exportar para CSV
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-center space-x-6 mt-8"> {/* Aumentando o espaçamento */}
          <input
            type="file"
            onChange={importCSV}
            className="border-2 border-gray-300 rounded p-3 w-90 cursor-pointer hover:bg-gray-200 hover:text-black transition duration-300"
          />
        </div>

        <div className="mt-12"> {/* Aumentando o espaçamento acima do formulário */}
          <h2 className="text-3xl font-semibold">Criar Novo Produto</h2> {/* Aumentando o tamanho do título */}
          <div className="space-y-6 mt-6"> {/* Aumentando o espaçamento entre os campos do formulário */}
            <input
              type="text"
              name="title"
              placeholder="Título"
              value={newProduct.title}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Descrição"
              value={newProduct.description}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded"
            />
            <input
              type="number"
              name="price"
              placeholder="Preço"
              value={newProduct.price}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded"
            />
            <input
              type="text"
              name="image"
              placeholder="URL da Imagem"
              value={newProduct.image}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded"
            />
            <input
              type="text"
              name="category"
              placeholder="Categoria"
              value={newProduct.category}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded"
            />
            <button
              onClick={createProduct}
              disabled={loading}
              className="w-full bg-indigo-500 text-white py-4 rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Produto'}
            </button>
          </div>
        </div>

        <ul className="mt-12 space-y-6"> {/* Aumentando o espaçamento entre os produtos */}
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id} className="p-6 border border-gray-200 rounded shadow-lg hover:shadow-xl">
                <h3 className="text-2xl font-semibold">{product.title}</h3>
                <p>{product.description}</p>
                <p className="font-medium">{product.price}€</p>
                <p className="text-sm">{product.category}</p>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use League\Csv\Reader;
use League\Csv\Writer;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');  // Protege todas as rotas no controlador
    }
    protected $exchangeRate = 5.5;
    // Importar produtos da API fake
  /**
     * Importa produtos da FakeStoreAPI e os adiciona no banco de dados.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function importProducts()
    {

        $user = JWTAuth::user();
        // 1. Buscar os produtos da FakeStoreAPI
        $response = Http::get('https://fakestoreapi.com/products');

        // Verificar se a requisição foi bem-sucedida
        if ($response->successful()) {
            $products = $response->json();

            // 2. Loop pelos produtos e insira no banco de dados
            foreach ($products as $product) {
                Product::updateOrCreate(
                    ['id' => $product['id']], // Identificador único do produto
                    [
                        'title' => $product['title'],
                        'price' => $product['price'],
                        'description' => $product['description'],
                        'image' => $product['image'],
                        'category' => $product['category'],
                    ]
                );
            }

            return response()->json(['message' => 'Produtos importados com sucesso!']);
        }

        return response()->json(['error' => 'Erro ao importar os produtos'], 500);
    }

    // Importar produtos de um arquivo CSV
    public function importFromCSV(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        $csv = Reader::createFromPath($request->file('file')->getRealPath(), 'r');
        $csv->setHeaderOffset(0);
        $records = $csv->getRecords();

        foreach ($records as $record) {
            Product::create([
                'name' => $record['Name'],
                'description' => $record['Description'],
                'price' => $record['Price'],
                'image_url' => $record['Image URL'],
            ]);
        }

        return response()->json(['message' => 'Produtos importados com sucesso'], 200);
    }
}
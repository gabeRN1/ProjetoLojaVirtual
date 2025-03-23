<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Faz o login do usuário e gera um token JWT.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Validação dos dados da requisição
        $validator = Validator::make($request->all(), [
            'email' => 'required|email', // O email é obrigatório e deve ser um email válido
            'password' => 'required',    // A senha é obrigatória
        ]);

        // Se a validação falhar, retorna os erros de validação
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Tenta autenticar o usuário com o email e senha fornecidos
        if ($token = JWTAuth::attempt($request->only('email', 'password'))) {
            // Se as credenciais forem válidas, retorna o token JWT
            return response()->json(['token' => $token], 200);
        }

        // Se as credenciais forem inválidas, retorna um erro
        return response()->json(['error' => 'Credenciais inválidas'], 401);
    }

    public function register(Request $request)
    {
        // Validação dos dados de entrada
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:3|confirmed',
        ]);

        // Se a validação falhar
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Criação do novo usuário
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Geração do JWT token
        $token = JWTAuth::fromUser($user);

        // Retornar o token junto com a resposta
        return response()->json([
            'message' => 'Usuário registrado com sucesso!',
            'user' => $user,
            'token' => $token
        ], 201);
    }
}

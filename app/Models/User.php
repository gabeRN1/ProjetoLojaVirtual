<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;
    
    protected $fillable = [
        'name',         // Nome do usuário
        'email',        // E-mail do usuário
        'password',     // Senha do usuário
    ];

 

    /**
     * Retorna o identificador único para o JWT
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); 
    }

    /**
     * Retorna os campos personalizados a serem incluídos no payload do JWT
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return []; 
    }
}
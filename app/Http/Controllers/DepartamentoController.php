<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Departamento;
use App\Municipio;
use DB;

class DepartamentoController extends Controller
{
   public function ProcesarMunicipio(){
       $municio = Municipio::all();
       for ($index = 0; $index < count($municio); $index++) {         
            $rest = substr($municio[$index]->muCodigo, 0,-3); 
            DB::update("UPDATE municipio SET muDepartamento = $rest WHERE muCodigo =".$municio[$index]->muCodigo);
       }
       
   }
}

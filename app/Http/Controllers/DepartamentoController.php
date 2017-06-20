<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
   
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()       
    {
         return Departamento::all(); 
    }
    
    
    public function getMunicipios($id){
       
        return Municipio::where('muDepartamento',$id)->get();
    }
    
}

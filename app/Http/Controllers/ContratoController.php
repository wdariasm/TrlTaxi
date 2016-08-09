<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;
use DB;

class ContratoController extends Controller
{
    
    public function tipoContrato (){
        return DB::select("select * from tipocontrato");
    }    
}

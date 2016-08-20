<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;	
use Illuminate\Support\Facades\App;

class PDFContratoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }
    
    public function pruebapdf(){
      $pdf = \App::make('dompdf.wrapper');
      $pdf->loadHTML('<h1>hola mundo</h1>');
      return $pdf->stream(); 
    }


}

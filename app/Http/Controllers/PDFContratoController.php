<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;	
use Illuminate\Support\Facades\App;

class PDFContratoController extends Controller
{
    public function getData() 
    {
        $data =  [
            'quantity'      => '1' ,
            'description'   => 'some ramdom text',
            'price'   => '500',
            'total'     => '500'
        ];
        return $data;
    }
    public function pruebapdf(){
      
//        $pdf = \App::make('dompdf.wrapper');
//        $view =  \View::make('pdfContrato')->render();
//        //$pdf ->loadView('/resources/views/pdfContrato');
//        $pdf->loadView($view);
//        return $pdf->stream();
        
         $data = $this->getData();
        $date = date('Y-m-d');
        $invoice = "2222";
        $view =  \View::make('pdfContrato', compact('date', 'invoice'))->render();
        $pdf = \App::make('dompdf.wrapper');
        $pdf->loadHTML($view);
        return $pdf->download('test.pdf');              
    }
    
    


}

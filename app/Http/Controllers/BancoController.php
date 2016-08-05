<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Banco;
use Illuminate\Http\JsonResponse;

class BancoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Banco::all();
    }
   

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{  
            $data = $request->all(); 
            $banco= new Banco();                        
            $banco->bcNombre = $data["bcNombre"];
            $banco->save();
            
            return JsonResponse::create(array('message' => "banco guardada correctamente", "request" =>json_encode($banco->bcCodigo)), 200);
        } catch (Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $bcCodigo)
    {
         try{
            $data = $request->all();
            $banco =  Banco::find($bcCodigo);
            $banco->bcNombre= $data["bcNombre"];
           
            $banco->save();
            
            return JsonResponse::create(array('message' => "Banco Actualizado Correctamente", "request" =>json_encode($banco->bcCodigo)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->message)), 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

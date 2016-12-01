<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DocumentoVehiculo;
use Illuminate\Http\JsonResponse;

class DocumentoController extends Controller
{
    public function store(Request $request)
    {
        try{              
            $codigo = uniqid();            
            $documento = new DocumentoVehiculo();
            $documento->dvNombre = $request->get("dvNombre");
            $documento->dvSize = $request->get("dvSize");
            $documento->dvTipo = $request->get("dvTipo");            
            $documento->dvTipoDoc = $request->get("dvTipoDoc");
            $documento->dvVehiculo = $request->get("dvVehiculo");
            $idMantenimiento = $request->get("dvMantenimiento");  
            
            $ruta ="";                    
            if($idMantenimiento != null && $idMantenimiento !="null"){
                $ruta = "mantenimiento";
                $documento->dvMantenimiento = $request->get("dvMantenimiento");
                $documento->dvRuta = "http://".$_SERVER['HTTP_HOST'].'/img/mantenimiento/'.$codigo.".".$documento->dvTipo;
            }else {
                $ruta = "vehiculo";
                $documento->dvRuta = "http://".$_SERVER['HTTP_HOST'].'/img/vehiculo/'.$codigo.".".$documento->dvTipo;
            }                         
            
            $documento->save();
            
            if ($request->hasFile('dvImagen')) {
                $request->file('dvImagen')->move("../img/$ruta", $codigo.".".$documento->dvTipo);
            }            
                       
            return JsonResponse::create(array('message' => "Datos guardados correctamente", "request" =>json_encode($documento->dvCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    function getDocumento($id){
        return DocumentoVehiculo::where("dvVehiculo", $id)
                ->where("dvMantenimiento" , '=',  null)->get();
    }
}

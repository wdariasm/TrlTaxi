<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use DB;
use App\Ruta;

class RutaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       $result = DB::select("SELECT r.rtCodigo, r.rtNombre, r.rtDescripcion,r.rtValor,r.rtEstado, c.tvDescripcion, m.muNombre,"
                . " d.dtNombre, r.rtImagen, r.rtTipoVehiculo, r.rtValorCliente, r.rtDepartamento, r.rtCiudad "
               . " from ruta r,clasevehiculo c,municipio m,departamento d where r.rtTipoVehiculo=c.tvCodigo "
                . "  and r.rtCiudad=m.muCodigo and m.muDepartamento=d.dtCodigo and r.rtEstado <>'BORRADO' ");
        return $result; 
    }

    public function getByPlanitlla($idPlantilla){
        $result = DB::select("SELECT r.rtCodigo, r.rtNombre, r.rtDescripcion,r.rtValor,r.rtEstado, c.tvDescripcion, m.muNombre,"
                        . " d.dtNombre, r.rtImagen, r.rtValorCliente, r.rtTipoVehiculo, r.rtDepartamento, r.rtCiudad, r.rtPlantilla"
                        . "   from ruta r,clasevehiculo c,municipio m,departamento d"
                        . " where r.rtTipoVehiculo=c.tvCodigo and r.rtCiudad=m.muCodigo and m.muDepartamento=d.dtCodigo "
                        . " and r.rtEstado <>'BORRADO' and r.rtPlantilla = $idPlantilla ");
                return $result;
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
            $ruta= new Ruta();                        
            $ruta->rtNombre = $data["rtNombre"];
            $ruta->rtDescripcion = $data["rtDescripcion"];
            $ruta->rtTipoVehiculo = $data["rtTipoVehiculo"];
            $ruta->rtValor = $data["rtValor"];
            $ruta->rtValorCliente = $data["rtValorCliente"];
            $ruta->rtDepartamento = $data["rtDepartamento"];
            $ruta->rtCiudad = $data["rtCiudad"];
            $ruta->rtEstado = 'ACTIVO';
            $ruta->rtImagen = "";
            $ruta->rtPlantilla = $data["rtPlantilla"];
            $ruta->save();
            
            $ruta->rtImagen = "http://".$_SERVER['HTTP_HOST'].'/img/ruta/'.$ruta->rtCodigo.".jpg";
            $ruta->save();
            
            if ($request->hasFile('rtImagen')) {
                $request->file('rtImagen')->move("../img/ruta", $ruta->rtCodigo.".jpg");
            }
                        
            return JsonResponse::create(array('message' => "Ruta guardada correctamente", "request" =>json_encode($ruta->rtCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }

    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $rtCodigo)
    {
          try{
            $data = $request->all();
            $ruta= Ruta::find($rtCodigo);
            $ruta->rtNombre = $data["rtNombre"];
            $ruta->rtDescripcion = $data["rtDescripcion"];
            $ruta->rtTipoVehiculo = $data["rtTipoVehiculo"];
            $ruta->rtValor = $data["rtValor"];
            $ruta->rtValorCliente = $data["rtValorCliente"];
            $ruta->rtDepartamento = $data["rtDepartamento"];
            $ruta->rtCiudad = $data["rtCiudad"];
            $ruta->rtEstado = $data["rtEstado"];
            $ruta->rtPlantilla = $data["rtPlantilla"];
            $ruta->save();

            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($ruta->rtCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    public function updateImage(Request $request){        
        try {
            $data = $request->all();
            $ruta = Ruta::find($data["id"]);
            $id = $ruta->rtCodigo;
            $ruta->rtImagen = "http://".$_SERVER['HTTP_HOST'].'/image/'.$id.".jpg";            
            $ruta->save();
                        
            if ($request->hasFile('imagen')) {
                $request->file('imagen')->move("../image/", $id.".jpg");
                return JsonResponse::create(array('message' => "Imagen Guardada Correctamente","request"=>  json_encode($id)), 200);
            }            
            
            return JsonResponse::create(array('message' => "Error al Guardar imagen","request"=>  json_encode($id)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
    
    //Actualiza el estado (Funcion eliminar)
    public function updateEstado(Request $request, $rtCodigo){
        try {
            $data = $request->all();
            $ruta = Ruta::find($rtCodigo);
            $ruta->rtEstado = $data['rtEstado'];
            $ruta->save();
            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($rtCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}

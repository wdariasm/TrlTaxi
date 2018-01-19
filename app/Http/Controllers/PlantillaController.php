<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Plantilla;
use App\HistorialPlantilla;
use App\Ruta;
use App\Traslado;
use App\Transfert;
use App\Archivo;
use Illuminate\Http\JsonResponse;
use DB;

class PlantillaController extends Controller
{
   
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
            $plantilla= new Plantilla();                        
            $plantilla->plDescripcion = $data["plDescripcion"];
            $plantilla->plEstado = 'ACTIVO';
            $plantilla->plValorProveedor = $data["plValorProveedor"]; 
            $plantilla->plValorCliente = $data["plValorCliente"]; 
            $plantilla->plTipoServicio = $data["plTipoServicio"]; 
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Plantilla guardada correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }
    
    
    /*
     * Obtener todas las plantillas por tipo de servicio
     */
    public function getPlantillaporTipo($id){
        
        return Plantilla::join('tiposervicio', 'plantilla.plTipoServicio', '=', 'tiposervicio.svCodigo')                
                ->where('plTipoServicio', $id)
                ->select('plantilla.*','tiposervicio.svDescripcion')                
                ->get();                
    }
        
    /*
     * Obtener Tipos de Vehiculos por plantilla y tipo de servicio
     */
    public function getTiposVehiculo($id, $tipoServicio) {
        
        $sql = "";
        switch ($tipoServicio) {
            case 1:
                $sql = "SELECT DISTINCT t.tfTipoVehiculo,cv.tvCodigo, cv.tvDescripcion , cv.tvNumPasajero, cv.tvRuta FROM "
                    . " transfert t INNER JOIN clasevehiculo cv ON  t.tfTipoVehiculo=cv.tvCodigo WHERE tfPlantilla = $id ";
                break;            
            case 2:
                $sql = "SELECT DISTINCT d.dpTipoVehiculo,cv.tvCodigo, cv.tvDescripcion , cv.tvNumPasajero, cv.tvRuta FROM "
                . " disponibilidad d INNER JOIN clasevehiculo cv ON  d.dpTipoVehiculo =cv.tvCodigo WHERE d.dpPlantilla = $id";                
                break; 
            default:
                return null;                
           
        }
        
        $result = DB::select($sql);        
        return $result;        
    }

    public function getValoresParada($id){
        return Plantilla::select("plValorCliente", "plValorProveedor")->find($id);
    }


    /**
     * Muestra todas las plantillas activas  por tipo de servicio 
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Plantilla::where('plTipoServicio',$id)->where('plEstado','=','ACTIVO')
                ->select('plCodigo', 'plDescripcion', 'plTipoServicio', 'plValorProveedor', 'plValorCliente')->get();
    }

    

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{  
            $data = $request->all(); 
            $plantilla= Plantilla::find($id);                        
            $plantilla->plDescripcion = $data["plDescripcion"];
            $plantilla->plEstado = $data["plEstado"];
            $plantilla->plTipoServicio = $data["plTipoServicio"];
            $plantilla->plValorProveedor = $data["plValorProveedor"];
            $plantilla->plValorCliente = $data["plValorCliente"];                        
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
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
        try{            
            $plantilla= Plantilla::find($id);                                    
            $plantilla->plEstado = 'INACTIVO';                    
            $plantilla->save();           
            return JsonResponse::create(array('message' => "Plantilla inactivada correctamente", "request" =>json_encode($plantilla->plCodigo)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }
    
    public function borrarDatos(Request $request)
    {
        try{  
            $data = $request->all(); 
            $idPlantilla =  $data["PlantillaId"];
            $usuario = $data["Usuario"];
            $tipo = $data["Tipo"];
            $datos = null;
            $descripcion = "";
            switch ($tipo) {
                case "1":                    
                    $descripcion  ="TRANSFER";
                    $datos = Transfert::where("tfPlantilla", $idPlantilla)->get();
                    $filas = Transfert::where('tfPlantilla', $idPlantilla)->delete();
                    break;                
                case "3":
                    $descripcion  ="RUTA";
                    $datos = Ruta::where("rtPlantilla", $idPlantilla)->get();
                    $filas = Ruta::where('rtPlantilla', $idPlantilla)->delete();
                    break;
                
                case "4":
                    $descripcion  ="TRASLADO";
                    $datos = Traslado::where("tlPlantilla", $idPlantilla)->get();
                    $filas = Traslado::where('tlPlantilla', $idPlantilla)->delete();
                    break;                
            }
                                    
            $historial = new HistorialPlantilla();                        
            $historial->htDescripcion = "ELINACIÓN MASIVA DE DATOS PLANTILLA ".$descripcion;
            $historial->htUsuario = $usuario;
            $historial->htDatos = $datos;
            $historial->htPlantillaId = $idPlantilla;
            $historial->htNombrePl = $data["Descripcion"];
            $historial->save();           
            return JsonResponse::create(array('message' => "Datos borrados correctamente", "request" =>json_encode($filas)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }  
    }
    
    public function cargueArchivo(Request $request)
    {
        try{
            
            $data = $request->all();  
            $nRegistros = 0;
            $fechaActual = new \DateTime();
            $archivo = new Archivo();
            $archivo->IdTipo = $data["IdTipo"];
            $archivo->IdPlantilla = $data["IdPlantilla"];
            $archivo->Usuario = $data["Usuario"];
            $archivo->FechaRegistro = $fechaActual->format('Y-m-d H:i:s');   
            $archivo->save();
            
            if ($request->hasFile('Archivo')) {
               $file =  $request->file('Archivo');
               $nombre = $archivo->IdArchivo . "_" . $file->getClientOriginalName();
               $file->move("../archivos/plantilla", $nombre);
               
               $archivo->Ruta = "http://".$_SERVER['HTTP_HOST'].'/archivos/plantilla/'.$nombre;
              // $archivo->Ruta = "http://".$_SERVER['HTTP_HOST'].'/trltaxi/archivos/plantilla/'.$nombre;
               $archivo->save();
                             
               $result = $this->importarDatos($archivo->Ruta, $archivo->IdPlantilla,$nRegistros);
            }
            
            $mensaje = $nRegistros == 0 ? "No fue posible realizar el cargue del archivo. " 
                     :"Archivo cargado correctamente.  Num. Registros leidos: ". $result;
                        
            return JsonResponse::create(array('message' => $mensaje, "request" =>json_encode($archivo->IdArchivo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    private function importarDatos($path, $idPlantilla, &$nRegistros){
        
        DB::table('temptransfert')->truncate();
        
//        $query = sprintf("LOAD DATA LOCAL INFILE '%s' INTO TABLE temptransfert FIELDS TERMINATED BY ';' "
//                . " OPTIONALLY ENCLOSED BY '\"' ESCAPED BY '\"' LINES TERMINATED BY '\\n' IGNORE 1 "
//                . " LINES (Descripcion,ZonaOrigen, ZonaDestino,TipoVehiculo,ValorCliente,ValorProveedor)", addslashes($path));      
        //$result = DB::connection()->getpdo()->exec($query);
        $fila = 0;
        if (($gestor = fopen($path, "r")) !== FALSE) {
            while (($datos = fgetcsv($gestor, 1000, ";")) !== FALSE) {                                
                $data = array(
                    'Descripcion' => $datos[0],
                    'ZonaOrigen' => $datos[1],                    
                    'ZonaDestino' => $datos[2],
                    'TipoVehiculo' => $datos[3],
                    'ValorCliente' => $datos[4],
                    'ValorProveedor' => $datos[5]
                );
                
                if ($fila <> 0){
                    DB::table('temptransfert')->insert($data);
                }                   
                $fila++;
            }
            fclose($gestor);
        }                        
        
        if($fila > 0){
            DB::update("UPDATE temptransfert t1  INNER JOIN zona z1 ON  TRIM(t1.ZonaOrigen)=z1.znNombre   SET t1.IdOrigen = z1.znCodigo");
            DB::update("UPDATE temptransfert t1  INNER JOIN zona z1 ON  TRIM(t1.ZonaDestino)=z1.znNombre  SET t1.IdDestino = z1.znCodigo");
            DB::update("UPDATE temptransfert t2  INNER JOIN clasevehiculo cv ON  cv.tvDescripcion=TRIM(t2.TipoVehiculo)  SET t2.IdVehiculo = cv.tvCodigo");
            
            $nRegistros = DB::insert("INSERT INTO transfert SELECT NULL , Descripcion, IdOrigen, IdDestino, IdVehiculo,"
                    . "  ValorProveedor, ValorCliente, NOW(), NOW(), 'admin', 'admin', 'ACTIVO', $idPlantilla as plantilla"
                    . " FROM temptransfert WHERE  IdDestino IS NOT NULL  AND IdVehiculo IS NOT NULL");
        }
        
        return $fila;
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use Illuminate\Http\JsonResponse;
use App\Zona;
use App\Puntos;

class ZonaController extends Controller
{
     public function index()
    {
        return Zona::select('znCodigo', 'znNombre', 'znEstado')->where('znEstado', '<>','BORRADO')
                ->orderBy('znCodigo', 'asc')->get();          
    }

    public function getPuntos($zona)
    {
        return Puntos::where('ptZona',$zona)->orderBy('ptCodigo', 'asc')->get();
    }

    public function getNumTaxi($zona)
    {
        $result = DB::select("SELECT SQL_SMALL_RESULT COUNT(*) AS total   FROM smarphone s, zona z  WHERE st_contains(z.znArea, POINT(s.latitud, s.longitud))
	                        AND CURRENT_DATE() = DATE(s.fecha) AND  s.Estado='Activo' AND
                            TIME_FORMAT(DATE_SUB(NOW(), INTERVAL s.Hora DAY_SECOND), '%H:%i:%s') < '00:06:00'
                            AND z.znCodigo=$zona GROUP BY z.znCodigo");
        if ($result){
            return $result[0]->total;
        }
        return "0";
    }

    public function getTaxistasByZona($zona){

        $result = DB::select("SELECT p.idPersona, CONCAT(p.Nombre,' ', p.Apellidos) AS taxista,  s.latitud, "
            . " s.longitud, v.placa, p.Estado, p.Disposicion, v.movil FROM zona z,  (persona p INNER JOIN vehiculo v ON p.placa = v.placa)"
            . " INNER JOIN smarphone s ON v.placa = s.placa WHERE  s.Estado='Activo' AND CURRENT_DATE() = DATE(s.fecha)"
            . " AND p.Estado = 'Activo' AND z.znCodigo=$zona  AND st_contains(z.znArea, POINT(s.latitud, s.longitud)) AND "
            . " TIME_FORMAT(DATE_SUB(NOW(), INTERVAL s.Hora DAY_SECOND), '%H:%i:%s') < '00:06:00'");

        return $result;
    }
    
    public function getPuntosAll() {               
        try{
            $lstZona =  array();        
            $result = DB::select("SELECT z.znCodigo, z.znNombre,  GROUP_CONCAT(p.ptLatitud ,',', p.ptLongitud ORDER BY p.ptCodigo ASC SEPARATOR ';')"
                    . " AS ptArea FROM zona z INNER JOIN puntos p ON z.znCodigo = p.ptZona  WHERE z.znEstado='ACTIVO'  GROUP BY z.znCodigo");
            for ($index = 0; $index < count($result); $index++) {
                $puntos = array();
                $cantidad =  strlen($result[$index]->ptArea);
                if($cantidad < 1000){                                        
                    $ptZona = explode(";", $result[$index]->ptArea);                                              
                    for ($j = 0; $j < count($ptZona); $j++) {
                        $p = explode("," ,$ptZona[$j]);                
                        $pos = ["latitud" => $p[0], "longitud"=> $p[1]];
                        array_push($puntos, $pos);
                    }                 
                }else{                    
                    $consulta = DB::select("SELECT ptLatitud, ptLongitud FROM puntos WHERE ptZona= ".$result[$index]->znCodigo);                    
                    foreach ($consulta as $pt) {                        
                        $pos = ["latitud" => $pt->ptLatitud, "longitud"=> $pt->ptLongitud];
                        array_push($puntos, $pos);
                    }
                            
                }                                         
                $zona = array(
                    "Zona" => $result[$index]->znCodigo,
                    "Nombre" => $result[$index]->znNombre,
                    "Puntos" => $puntos
                );                    
                array_push($lstZona,$zona);            
            }         
            return $lstZona;
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
        
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $nombre = $data['znNombre'];
            $area = $data['znArea'];
            
            $result = DB::insert("INSERT INTO zona (znNombre,  znEstado, znArea) VALUES "
                    . " ('$nombre','Activo', GeomFromText('POLYGON(($area))'))");
            
            $id=DB::select("SELECT @@IDENTITY AS znCodigo");                                    
            if($result){                
                $puntos = $data["puntos"];            
                foreach ($puntos as $p) {
                    $insert = new Puntos();
                    $insert->ptLatitud =$p['lt'];
                    $insert->ptLongitud = $p['lg'];
                    $insert->ptZona = $id[0]->znCodigo;
                    $insert->save();
                }
            }        
            return JsonResponse::create(array('message' => "Guardado correctamente", "request" =>json_encode($id[0]->znCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        try {
            $data = $request->all();            
            $nombre = $data['znNombre'];            
            $area = $data['znArea'];            
            $estado = $data['znEstado'];
            
            $result = DB::update("UPDATE zona SET znNombre='$nombre', "
                    . " znEstado='$estado', znFUpdate=now(), znArea = GeomFromText('POLYGON(($area))')"
                    . "  WHERE znCodigo=$id ");
                                                          
            if($result){       
                DB::delete("DELETE FROM puntos WHERE ptZona=$id");
                $puntos = $data["puntos"];            
                foreach ($puntos as $p) {
                    $insert = new Puntos();
                    $insert->ptLatitud =$p['lt'];
                    $insert->ptLongitud = $p['lg'];
                    $insert->ptZona = $id;
                    $insert->save();
                }
            }        
            return JsonResponse::create(array('message' => "Datos Actualizados correctamente", "request" =>json_encode($id)), 200);
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
        try {
            DB::update("update zona set znEstado = 'BORRADO'  WHERE znCodigo = $id");
             return JsonResponse::create(array('message' => 'Zona Eliminada Correctamente'), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }         
    }
        
}



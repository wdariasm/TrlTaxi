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
        return Zona::select('znCodigo', 'znNombre', 'znEstado')->where('znEstado', '<>','BORRADO')->get();                 
    }

    public function getPuntos($zona)
    {
        return Puntos::where('ptZona',$zona)->get();
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
    
    public function getZonaByPunto($latitud, $longitud) {        
       //$result= DB::select("SELECT znCodigo,znNombre FROM zona WHERE st_contains(znArea, POINT($latitud, $longitud)) LIMIT 1");               
        $punto = array($latitud, $longitud);
            var_dump($punto);
           // $pointLocation = new pointLocation();
        $zona = DB::select("SELECT z.znCodigo, z.znNombre,  GROUP_CONCAT(ptLatitud ,',', ptLongitud SEPARATOR ';')"
                . " AS ptArea FROM zona z INNER JOIN puntos p ON z.znCodigo = p.ptZona  WHERE z.znEstado='ACTIVO' GROUP BY z.znCodigo");
        for ($index = 0; $index < count($zona); $index++) {
            $ptZona = explode(";", $zona[$index]->ptArea);
            $poligono = array();
            for ($j = 0; $j < count($ptZona); $j++) {               
                array_push($poligono, explode("," ,$ptZona[$j]));
            }                      
            array_push($poligono, explode("," ,$ptZona[0]));            
            echo contains($punto,$poligono)?'IN':'OUT';
            
        }
        
       $polygon = array(
    array(10.442487502405,-75.527321174741),
    array(10.44139018212,-75.514231994748),
    array(10.453629304362,-75.513073280454),
    array(10.442487502405,-75.527321174741)
);

$point1 = array(10.4264108,-78.5127286);
 
echo contains($point1,$polygon)?'IN':'OUT';
echo "<br />";
 
// The last point's coordinates must be the same as the first one's, to "close the loop"
//foreach($points as $key => $point) {
//    echo "point " . ($key+1) . " ($point): " . $pointLocation->pointInPolygon($point, $polygon) . "<br>";
//}

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
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar",  "request" =>json_encode($exc->getMessage())), 401);
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
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar",  "request" =>json_encode($exc->getMessage())), 401);
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
            return JsonResponse::create(array('message' => "No se pudo Eliminar", 'request'=>$exc), 401);
        }
        
    }
    
    private function contains($point, $polygon)
    {
        if($polygon[0] != $polygon[count($polygon)-1])
            $polygon[count($polygon)] = $polygon[0];
        $j = 0;
        $oddNodes = false;
        $x = $point[1];
        $y = $point[0];
        $n = count($polygon);
        for ($i = 0; $i < $n; $i++)
        {
            $j++;
            if ($j == $n)
            {
                $j = 0;
            }
            if ((($polygon[$i][0] < $y) && ($polygon[$j][0] >= $y)) || (($polygon[$j][0] < $y) && ($polygon[$i][0] >=
                $y)))
            {
                if ($polygon[$i][1] + ($y - $polygon[$i][0]) / ($polygon[$j][0] - $polygon[$i][0]) * ($polygon[$j][1] -
                    $polygon[$i][1]) < $x)
                {
                    $oddNodes = !$oddNodes;
                }
            }
        }
        return $oddNodes;
    }
}

class pointLocation {
    var $pointOnVertex = true; // Check if the point sits exactly on one of the vertices?
 
    function pointLocation() {
    }
 
    function pointInPolygon($point, $polygon, $pointOnVertex = true) {
        $this->pointOnVertex = $pointOnVertex;
 
        // Transform string coordinates into arrays with x and y values
        $point = $this->pointStringToCoordinates($point);
        $vertices = array(); 
        foreach ($polygon as $vertex) {
            $vertices[] = $this->pointStringToCoordinates($vertex); 
        }
 
        // Check if the point sits exactly on a vertex
        if ($this->pointOnVertex == true and $this->pointOnVertex($point, $vertices) == true) {
            return "vertex";
        }
 
        // Check if the point is inside the polygon or on the boundary
        $intersections = 0; 
        $vertices_count = count($vertices);
 
        for ($i=1; $i < $vertices_count; $i++) {
            $vertex1 = $vertices[$i-1]; 
            $vertex2 = $vertices[$i];
            if ($vertex1['y'] == $vertex2['y'] and $vertex1['y'] == $point['y'] and $point['x'] > min($vertex1['x'], $vertex2['x']) and $point['x'] < max($vertex1['x'], $vertex2['x'])) { // Check if point is on an horizontal polygon boundary
                return "boundary";
            }
            if ($point['y'] > min($vertex1['y'], $vertex2['y']) and $point['y'] <= max($vertex1['y'], $vertex2['y']) and $point['x'] <= max($vertex1['x'], $vertex2['x']) and $vertex1['y'] != $vertex2['y']) { 
                $xinters = ($point['y'] - $vertex1['y']) * ($vertex2['x'] - $vertex1['x']) / ($vertex2['y'] - $vertex1['y']) + $vertex1['x']; 
                if ($xinters == $point['x']) { // Check if point is on the polygon boundary (other than horizontal)
                    return "boundary";
                }
                if ($vertex1['x'] == $vertex2['x'] || $point['x'] <= $xinters) {
                    $intersections++; 
                }
            } 
        } 
        // If the number of edges we passed through is odd, then it's in the polygon. 
        if ($intersections % 2 != 0) {
            return "inside";
        } else {
            return "outside";
        }
    }
 
    function pointOnVertex($point, $vertices) {
        foreach($vertices as $vertex) {
            if ($point == $vertex) {
                return true;
            }
        }
 
    }
 
    function pointStringToCoordinates($pointString) {        
        $coordinates = explode(" ", $pointString);
        return array("x" => $coordinates[0], "y" => $coordinates[1]);
    }
 
}

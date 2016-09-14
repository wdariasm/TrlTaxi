<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Servicio;
use App\Parada;
use Illuminate\Http\JsonResponse;
use DB;
use App\Cliente;

class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $servicio = DB::select("SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable,"
                . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.Estado, "
                . " s.DescVehiculo, s.TipoVehiculoId, s.ValorTotal, s.ConductorId FROM servicio s INNER JOIN  tiposervicio "
                . " ts ON s.TipoServicidoId=ts.svCodigo WHERE s.Estado <> 'FINALIZADO' AND s.Estado <> 'CANCELADO' order by s.IdServicio desc");
        return $servicio;            
    }
    
    public function getServicioCliente($id, $rol, $usuario)
    {
        $condicion = " WHERE  s.ClienteId = ".$id;
        if($rol==="5"){
            $condicion = " WHERE  s.UserReg = '".$usuario ."'";
        }        
        $servicio = DB::select("SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable,"
                . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.Estado, "
                . " s.DescVehiculo, s.ValorTotal,s.ConductorId FROM servicio s INNER JOIN  tiposervicio ts ON "
                . " s.TipoServicidoId=ts.svCodigo ". $condicion ." order by s.IdServicio desc");
        return $servicio;     
    }    
    
    public function getServicioConductor($id, $opcion)
    {
        $condicion = "";
        if($opcion==="ACTIVO"){
            $condicion = " AND s.Estado <> 'FINALIZADO' AND s.Estado <> 'CANCELADO'";
        }        
        $servicio = DB::select("SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable,"
                . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.Estado, "
                . " s.DescVehiculo, s.ValorTotal, s.ConductorId FROM servicio s INNER JOIN  tiposervicio ts ON "
                . "  s.TipoServicidoId=ts.svCodigo WHERE  s.ConductorId = $id ".$condicion . " order by s.IdServicio desc");
        return $servicio;     
    }    
    
    /* 
     * Obtener conductores libres para asignarle un servicio
     */
    public function getConductores($tipo){
        $result  =  DB::select("SELECT c.IdConductor, c.Cedula, c.Nombre, c.TelefonoPpal, c.Email, v.Placa,"
                . "  v.IdVehiculo, c.Disposicion FROM conductor c INNER JOIN vehiculo v "
                . " ON c.VehiculoId =  v.IdVehiculo WHERE v.ClaseVehiculo = $tipo");
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
            $servicio= new Servicio();                        
            $servicio->ContratoId = $data["ContratoId"]; 
            $servicio->NumeroContrato = $data["NumeroContrato"]; 
            $servicio->ClienteId = $data["ClienteId"]; 
            $servicio->Nit = $data["Nit"];
            $servicio->Responsable = $data["Responsable"]; 
            $servicio->Telefono = $data["Telefono"]; 
            $servicio->TipoServicidoId = $data["TipoServicidoId"]; 
            $date = new \DateTime(str_replace("/", "-", $data["FechaServicio"]." 00:00:00"));
            $servicio->FechaServicio = $date->format('Y-m-d');
            $hora = \DateTime::createFromFormat( 'H:i A', $data["Hora"]);
            $servicio->Hora= $hora->format('H:i:s'); 
            $servicio->Valor= $data["Valor"]; 
            $servicio->NumPasajeros= $data["NumPasajeros"];
            $servicio->NumHoras= $data["NumHoras"];
            $servicio->Estado= "SOLICITADO";
            $servicio->FormaPago= $data["FormaPago"];
            $servicio->DireccionOrigen= $data["DireccionOrigen"];
            $servicio->DireccionDestino= $data["DireccionDestino"];
            $servicio->ZonaOrigen= $data["ZonaOrigen"];
            $servicio->ZonaDestino= $data["ZonaDestino"];
            $servicio->LatOrigen= $data["LatOrigen"];
            $servicio->LngOrigen= $data["LngOrigen"];
            $servicio->LatDestino= $data["LatDestino"];
            $servicio->LngDestino= $data["LngDestino"];
            $servicio->PlantillaId= $data["PlantillaId"];
            $servicio->TipoVehiculoId= $data["TipoVehiculoId"];
            $servicio->DescVehiculo= $data["DescVehiculo"];
            $servicio->Parada= $data["Parada"];
            $servicio->ValorTotal= $data["ValorTotal"];
            $servicio->Nota= $data["Nota"];            
            $servicio->Calificacion= 0;
            $servicio->UserReg= $data["UserReg"];
            $servicio->FechaMod = new \DateTime();
            $servicio->save();
            
            $paradas= $data["Paradas"];
            if(count($paradas)> 0){
                $this->guardarParada($servicio->IdServicio, $paradas);
            }
                                    
            if($data["EnviarEmail"]==="SI"){
                $this->EnviarEmail($servicio->IdServicio, $data["NumeroContrato"], $data["Responsable"], $data["ParEmail"] );
            }
                                    
            return JsonResponse::create(array('message' => "Servicio guardado correctamente", "request" =>json_encode($servicio->IdServicio)), 200);
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    private function guardarParada($idservicio, $paradas){
        foreach ($paradas as $p) {
            $insert = new Parada();
            $insert->prServicio = $idservicio;
            $insert->prDireccion = $p['prDireccion'];
            $insert->prLatiud = $p['prLatiud'];
            $insert->prLongitud = $p['prLongitud'];
            $insert->prValor = $p['prValor'];
            $insert->prFecha = $p['prFecha'];            
            $insert->prEstado = 'ACTIVO';
            $insert->save();
        }
    }
    
    public function asignar(Request $request){
        try{  
            $data = $request->all();             
            $result = Servicio::where('IdServicio', $data["IdServicio"] )          
                ->update(['ConductorId' => $data ['ConductorId'], 'Estado' => 'ASIGNADO' ]);                        
        
            return JsonResponse::create(array('message' => "Servicio asignado correctamente", "request" =>json_encode($result)), 200);
        } catch (\Exception $exc) {    
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function show($codigo)
    {
        return Servicio::find($codigo);
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
            $result = Servicio::where('IdServicio', $id )          
                ->update(['Estado' => $data['Estado'] ]); 
            
            if($data['Email'] =="SI"){
                $cliente  = Cliente::where('IdCliente', $data["ClienteId"])->select('Correo')->first();
                if (!empty($cliente)){
                    $this->EmailConfirmacion($id, $data['Responsable'], $cliente->Correo);
                }                
            }
                                              
            return JsonResponse::create(array('message' => "Servicio actualizado correctamente", "request" =>json_encode($result)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
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
            $servicio = DB::update("UPDATE servicio SET Estado= 'CANCELADO' WHERE IdServicio=$id ");                        
            return JsonResponse::create(array('message' => "Servicio cancelado correctamente", "request" =>json_encode($servicio)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo  actualizar servicio", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    
    
    //Actualiza el estado del servicio por el conductor
    public function updateServConductor(Request $request, $id){
        try {
            $data = $request->all();
            $servicio = DB::update("UPDATE servicio SET Estado= '".$data['Estado']."' WHERE IdServicio=$id ");                        
            return JsonResponse::create(array('message' => "Servicio actualizado correctamente", "request" =>json_encode($servicio)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo  actualizar servicio", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    private function EnviarEmail($idServicio, $contrato,  $responsable, $email){
        // título
        $título = 'Solicitud de servicio [TRL]';
        // mensaje
        
        $mensaje = "
        <html>
        <head>
          <title>Solicitud de servicio</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡Solicitud de servicio!</h1>
         
          <p> Datos del servicio:</p>          
          <br/>    
          <p>N° Servicio: $idServicio</p>
          <p>N° Contrato : $contrato</p>
          <p>Responsable : $responsable</p>
           <br/>
          <p>Atentamente</p>
          <p>Tu equipo de Transporte Ruta Libre</p>
        </body>
        </html>
        ";
       
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";       
        $cabeceras .= 'To: '.$responsable.' <'.$email.'>' . "\r\n";
        $cabeceras .= 'From: Transporte Ruta Libre <info@trl.co>' . "\r\n";        
               
        mail($email, $título, $mensaje, $cabeceras);
    }
    
    private function EnviarEmailAsignar($idServicio,  $responsable, $email){
        // título
        $título = 'Asignación de servicio [TRL]';
        // mensaje
        
        $mensaje = "
        <html>
        <head>
          <title>Asignación de servicio</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡Asignacón de servicio!</h1>
          
          <p>Estimado conductor, se le  ha asignado un servicio, por favor confirma la aceptación del servicio.</p>

          <p> Datos del servicio:</p>          
          <br/>    
          <p>N° Servicio: $idServicio</p>          
          <p>Responsable : $responsable</p>
           <br/>
          <p>Atentamente</p>
          <p>Tu equipo de Transporte Ruta Libre</p>
        </body>
        </html>
        ";
       
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";       
        $cabeceras .= 'To: '.$responsable.' <'.$email.'>' . "\r\n";
        $cabeceras .= 'From: Transporte Ruta Libre <info@trl.co>' . "\r\n";        
               
        mail($email, $título, $mensaje, $cabeceras);
    }
    
    private function EmailConfirmacion($idServicio,  $responsable, $email){
        // título
        $título = 'Asignación de servicio [TRL]';
        // mensaje
        
        $mensaje = "
        <html>
        <head>
          <title>Asignación de servicio</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡Asignacón de servicio!</h1>
          
          <p>Estimado usuariio(a), su solicitud de servicio ha sido confirmada. Por favor ingrese a la plataforma
            para verificar los datos del conductor asignado.
            </p>

          <p> Datos del servicio:</p>          
          <br/>    
          <p>N° Servicio: $idServicio</p>          
          <p>Responsable : $responsable</p>
           <br/>
           
          <p>Atentamente</p>
          <p>Tu equipo de Transporte Ruta Libre</p>
        </body>
        </html>
        ";
       
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";       
        $cabeceras .= 'To: '.$responsable.' <'.$email.'>' . "\r\n";
        $cabeceras .= 'From: Transporte Ruta Libre <info@trl.co>' . "\r\n";        
               
        mail($email, $título, $mensaje, $cabeceras);
    }
}

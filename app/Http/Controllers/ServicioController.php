<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Servicio;
use App\Parada;
use Illuminate\Http\JsonResponse;
use DB;
use App\Cliente;
use App\ServicioContactos;
use App\Utilidades\EnviarEmail;


class ServicioController extends Controller
{  
    public function index()
    {
        $servicio = DB::select("SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable,"
                . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.ValorCliente, s.Estado, "
                . " s.DescVehiculo, s.TipoVehiculoId, s.ValorTotal, s.ConductorId FROM servicio s INNER JOIN  tiposervicio "
                . " ts ON s.TipoServicidoId=ts.svCodigo WHERE s.Estado <> 'FINALIZADO' AND s.Estado <> 'CANCELADO' order by s.IdServicio desc");
        return $servicio;            
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
        
    public function getServicioCliente($id, $rol, $usuario)
    {
        $condicion = " WHERE  s.ClienteId = ".$id;
        if($rol==="5"){
            $condicion = " WHERE  s.UserReg = '".$usuario ."'";
        }        
        $servicio = DB::select("SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable,"
                . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.ValorCliente, s.Estado, "
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
                . " s.DescVehiculo, s.ValorTotal, s.ConductorId, s.NumPasajeros, s.FormaPago, s.DireccionOrigen, "
                . " s.DireccionDestino, s.LatOrigen, s.LngOrigen, s.LatDestino, s.LngDestino, s.ValorCliente "
                . " FROM servicio s INNER JOIN  tiposervicio ts ON s.TipoServicidoId=ts.svCodigo "
                . " WHERE  s.ConductorId = $id ".$condicion . " order by s.IdServicio desc");
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
    
    public function getPorFecha(Request $request){
        try{
            $condicion = "";
            $condFecha = "";
            $condTipo = "";
            $estado = $request->get('Estado');
            $buscarPorFecha = $request->get('FechaChk');
            $fechaInicial = $request->get('FechaInicial');
            $fechaFinal = $request->get('FechaFin');
            $TipoServicio = $request->get('TipoServicio');
            
            if($estado !=="TODOS"){
                $condicion =  " AND Estado = '". $estado ."'";
            }
            
            if($buscarPorFecha){
                $condFecha = " AND FechaServicio BETWEEN '$fechaInicial' AND '$fechaFinal'";
            }
            
            if($TipoServicio != "0"){
                $condTipo = " AND TipoServicidoId = ".$TipoServicio;
            }
            
            $sql = "SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable, s.ValorCliente, "
                    . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.Estado, "
                    . " s.DescVehiculo, s.TipoVehiculoId, s.ValorTotal, s.ConductorId FROM servicio s INNER JOIN  tiposervicio "
                    . " ts ON s.TipoServicidoId=ts.svCodigo WHERE ContratoId > 0  " . $condicion . $condFecha . $condTipo
                    . "  order by s.IdServicio desc";

            $servicio = DB::select($sql);            
            return $servicio;     
        
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }   
    }
    
    public function getSolicitados(){
        try{   
           
            $sql = "SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable, s.ValorCliente, "
                    . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.Estado, "
                    . " s.DescVehiculo, s.TipoVehiculoId, s.ValorTotal, s.ConductorId FROM servicio s INNER JOIN  tiposervicio "
                    . " ts ON s.TipoServicidoId=ts.svCodigo WHERE s.Estado = 'SOLICITADO' OR s.Estado = 'RECHAZADO' "
                    . "  order by s.IdServicio desc";
            
            $servicio = DB::select($sql);
            return $servicio;   
        
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 401);
        }   
    }
    
    public function getCalificacion($codigo)
    {
        return Servicio::join('conductor', 'servicio.ConductorId', '=', 'conductor.IdConductor')
                ->select("servicio.IdServicio", "servicio.NumeroContrato", "servicio.Calificacion", "servicio.Responsable",
                        "conductor.Nombre", "servicio.ValorTotal", "servicio.Estado", "servicio.UserReg")
                ->where("IdServicio", "=", $codigo)->first();
    }
    
    
    /*
     * OBTENER SERVICIOS DEL CONDUCTOR POR RANGO DE FECHAS
     */    
    public function getServicioConductorFecha(Request $request){
        $id = $request->get('id');
        
        $date = new \DateTime(str_replace("/", "-", $request->get('fecha')." 00:00:00"));
        $fecha = $date->format('Y-m-d');
        
        $date2 = new \DateTime(str_replace("/", "-", $request->get('fechafin')." 00:00:00"));
        $fechaFin = $date2->format('Y-m-d');
        
        $sql = "SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable, s.ValorCliente, "
                . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.Estado, "
                . " s.DescVehiculo, s.TipoVehiculoId, s.ValorTotal, s.ConductorId FROM servicio s INNER JOIN  tiposervicio "
                . " ts ON s.TipoServicidoId=ts.svCodigo WHERE s.Estado = 'FINALIZADO'  "
                . " and s.ConductorId = $id and s.FechaServicio BETWEEN '$fecha' AND '$fechaFin' order by s.IdServicio desc";
       
        $servicio = DB::select($sql);
        return $servicio;        
    }
    
    public function getCarteraConductorFecha(Request $request){
        $id = $request->get('id');
        
        $date = new \DateTime(str_replace("/", "-", $request->get('fecha')." 00:00:00"));
        $fecha = $date->format('Y-m-d');
        
        $date2 = new \DateTime(str_replace("/", "-", $request->get('fechafin')." 00:00:00"));
        $fechaFin = $date2->format('Y-m-d');
        
        $sql = "SELECT COUNT(s.IdServicio) 'Cantidad', SUM(IF(s.FormaPago = 'EFECTIVO', s.ValorTotal, 0)) 'Efectivo',"
                . " SUM(IF(s.FormaPago = 'CREDITO', s.ValorTotal, 0)) 'Credito', SUM(IF(s.FormaPago = 'DEBITO',"
                . " s.ValorTotal, 0)) 'Debito', SUM(IF(s.FormaPago = 'CHEQUE', s.ValorTotal, 0)) 'Cheque', "
                . " SUM(s.ValorTotal) 'Total' FROM servicio s  WHERE s.Estado = 'FINALIZADO' AND s.ConductorId = $id"
                . " AND  DATE(s.FechaServicio) BETWEEN '$fecha' AND '$fechaFin' GROUP BY s.ConductorId ";
               
        $servicio = DB::select($sql);       
        return $servicio;        
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
            $servicio->ValorCliente = $data["ValorCliente"];
            $servicio->ValorParadas = $data["ValorParadas"];
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
            $servicio->ModoServicio= $data["ModoServicio"];
            $servicio->Parada= $data["Parada"];
            $servicio->ValorTotal= $data["ValorTotal"];
            $servicio->Nota= $data["Nota"];            
            $servicio->Calificacion= 0;
            $servicio->Placa= "";            
            $servicio->UserReg= $data["UserReg"];
            $servicio->FechaMod = new \DateTime();
            $servicio->save();
            
            $paradas= $data["Paradas"];
            if(count($paradas)> 0){
                $this->guardarParada($servicio->IdServicio, $paradas);
            }
            
            $contactos= $data["Contactos"];
            if(count($contactos)> 0){
                $this->guardarContacto($servicio->IdServicio, $contactos);
            }
                                    
            if($data["EnviarEmail"]==="SI"){                
                $email = new EnviarEmail();
                $email->EmailSolicitud($servicio->IdServicio, $data["NumeroContrato"], $data["Responsable"], $data["ParEmail"]);
                unset($email);                
            }
                                    
            return JsonResponse::create(array('message' => "Servicio guardado correctamente", "request" =>json_encode($servicio->IdServicio)), 200);
        }  catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
            $insert->prValorCliente = $p['prValorCliente'];
            $insert->prFecha = $p['prFecha'];            
            $insert->prEstado = 'ACTIVA';
            $insert->save();
        }
    }
    
    private function guardarContacto($idservicio, $contactos){
        foreach ($contactos as $p) {
            $insert = new ServicioContactos();
            $insert->scIdServicio = $idservicio;
            $insert->scNombre = $p['scNombre'];
            $insert->scTelefono = $p['scTelefono'];
            if(isset($p['scNota'])){
                $insert->scNota = $p['scNota'];
            }                                                
            $insert->save();
        }
    }            
  
    public function asignar(Request $request){
        try{  
            $data = $request->all();                                   
            
            $result = Servicio::where('IdServicio', $data["IdServicio"])          
                ->update(['ConductorId' => $data['ConductorId'], 'Placa' => $data['Placa'], 'Estado' => 'ASIGNADO' ]);             
            $this->EnviarEmailAsignar($data["IdServicio"], $data["Responsable"], $data["Email"], $data["Nombre"]);
            $this->NotificacionConductor($data ['ConductorId'], $data["IdServicio"] );
            $this->NotificacionCliente($data ['ClienteId'], $data["IdServicio"] );            
            return JsonResponse::create(array('message' => "Servicio asignado correctamente", "request" =>json_encode($result)), 200);
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
    public function update(Request $request, $id)
    {
        try{
                                    
            $data = $request->all();                   
            $servicio = Ruta::find($id);                                    
            $servicio->Responsable = $data["Responsable"]; 
            $servicio->Telefono = $data["Telefono"];                                    
            $servicio->Valor= $data["Valor"];
            $servicio->ValorCliente = $data["ValorCliente"];
            $servicio->ValorParadas = $data["ValorParadas"];
            $servicio->NumPasajeros= $data["NumPasajeros"];
            $servicio->NumHoras= $data["NumHoras"];            
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
            $servicio->Parada= $data["Parada"];
            $servicio->ValorTotal= $data["ValorTotal"];
            $servicio->Nota= $data["Nota"];                                      
            $servicio->FechaMod = new \DateTime();
            $servicio->save();
            
            return JsonResponse::create(array('message' => "Servicio Actualizado correctamente", "request" =>json_encode($ruta->rtCodigo)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    public function updateEstado(Request $request, $id)
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
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
            
    //Actualiza el estado del servicio por el conductor
    public function updateServConductor(Request $request, $id){
        try {            
            $data = $request->all();
            $estado = $data['Estado'];
            $servicio = DB::update("UPDATE servicio SET Estado= '".$estado."' WHERE IdServicio=$id ");    
            if($estado === "FINALIZADO"){
                $this->EmailCalificacion($id);
            }
            return JsonResponse::create(array('message' => "Servicio actualizado correctamente", "request" =>json_encode($servicio)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    /* CALIFICAR SERVCIO POR EL CLIENTE */
    public function calificar(Request $request, $id)
    {
       try{
            $data = $request->all();            
            $result = Servicio::where('IdServicio', $id )          
                ->update(['Calificacion' => $data['Calificacion'] ]); 
                                                                     
            return JsonResponse::create(array('message' => "Servicio calificado correctamente", "request" =>json_encode($result)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }

    /**
     * 
     *RECHAZAR SERVICIO POR PARTE DEL CONDUCTOR
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $servicio = DB::update("UPDATE servicio SET Estado= 'RECHAZADO', ConductorId=NULL WHERE IdServicio=$id ");
            return JsonResponse::create(array('message' => "Servicio rechazado", "request" =>json_encode($servicio)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    public function cancelarServico(Request $request, $id){
        try{
            $data = $request->all();
            $scConductorId = $data['Conductor'];
            $estado = $data["Estado"];
            $motivo = $data ["Motivo"];
            $idCliente = $data ["Cliente"];
            if($scConductorId === null || $scConductorId ===""){
                $scConductorId = "NULL";
            }
            $update = DB::update("UPDATE servicio SET  Estado='$estado', ConductorId=NULL, Placa ='' WHERE IdServicio= $id");                     
            if ($update){                  
                
                DB::insert("INSERT INTO serviciocancelado (scCancelacionId, scServicioId, scConductorId, scClienteId) "
                        . " VALUES ($motivo,$id,".$scConductorId.", ".$idCliente.") ");
                
                if ($scConductorId !== "NULL"){                   
                    DB::update("UPDATE conductor SET Disposicion='LIBRE' WHERE IdConductor=".$scConductorId."");                            
                }
                               
            }	                        	    
            return JsonResponse::create(array('bandera' => "Correcto", 'message' => "Servicio cancelado correctamente",), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('bandera' => "Error", 'file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }        
       
    
    private function EnviarEmail($idServicio, $contrato,  $responsable, $email){
        // título
        $titulo = 'Solicitud de servicio [TRL]';
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
               
        $this->SenEmail($email, $titulo, $mensaje);
      //  mail($email, $título, $mensaje, $cabeceras);
    }
    
    private function EnviarEmailAsignar($idServicio,  $responsable, $email, $conductor){
        // título
        $titulo = 'Asignación de servicio [TRL]';
        // mensaje
        
        $mensaje = "
        <html>
        <head>
          <title>Asignación de servicio</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡Asignacón de servicio!</h1>
          
          <p>Estimado $conductor se le  ha asignado un servicio, por favor confirmar la aceptación del servicio.</p>

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
        $cabeceras .= 'To: '.$conductor.' <'.$email.'>' . "\r\n";
        $cabeceras .= 'From: Transporte Ruta Libre <info@trl.com.co>' . "\r\n";        
          
        $this->SenEmail($email, $titulo, $mensaje);
        //mail($email, $título, $mensaje, $cabeceras);
    }
    
    private function EmailConfirmacion($idServicio,  $responsable, $email){
        // título
        $titulo = 'Asignación de servicio [TRL]';
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
        
        $this->SenEmail($email, $titulo, $mensaje);     
        //($email, $título, $mensaje, $cabeceras);
    }
    
    private function EmailCalificacion($idServicio){
        // título
        $titulo = utf8_encode('Calificación de servicio [TRL]');
        // mensaje
        $servicio  =  $this->getCalificacion($idServicio);
        $user = \App\Usuario::select("Email", "IdUsuario")->where("Login", "=", $servicio->UserReg)->first();
        $email = $user->Email;
        $mensaje = "
        <html>
        <head>
          <title>".utf8_encode('Calificación de servicio') ."</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡".utf8_encode('Calificación de servicio') ."!</h1>
              
            <h1>Hola, ". $servicio->Responsable ."</h1><br/>
            <p>Su  servicio ha finalizado correctamente, por favor le invitamos a calificar el servicio prestado
                por parte de nuestra empresa.</p>
            <p> Si ha tenido alguna inconformidad por favor comuníquese con nosotros.</p>            
            <br/>
          
            <p> Datos del servicio:</p>          
            <br/>    
            <p>N° Servicio: $idServicio</p>
            <p>N° Contrato : $servicio->NumeroContrato</p>
            <p>Valor Servicio : $servicio->ValorTotal</p>
            <p>Responsable : $servicio->Responsable</p><br/>              
            <p>Conductor : $servicio->Nombre</p>
           <br/>
           <p><a href='http://".$_SERVER['HTTP_HOST']."/inicio/index.html#/calificacion/$idServicio' target='_blank'>Click Aqui, para calificar el servicio</a></p>
            <br/>
          <p>Atentamente</p>
          <p>Tu equipo de Transporte Ruta Libre</p>
        </body>
        </html> ";
       
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";       
        $cabeceras .= 'To: '.$servicio->Responsable.' <'.$email.'>' . "\r\n";
        $cabeceras .= 'From: Transporte Ruta Libre <info@trl.co>' . "\r\n";                
        //mail($email, $título, $mensaje, $cabeceras);
        $this->SenEmail($email, $titulo, $mensaje);
    }
    
    public function probando($key, $mensaje, $url){
        $this->notificacion(array($key), $mensaje, $url);
    }
    
    private function notificacion($array, $message, $url){

        $apiKey = 'AIzaSyAsI2XXAs9KXwBOWKD5epORXE4KHDXKBWA'; //Clave de la api
            // Cabecera
        $headers = array('Content-Type:application/json',
                "Authorization:key=$apiKey");

        $fields = array(
            'registration_ids'  => $array,
            'data'              => array( "message" => $message,
                                           "url" => $url),
        );
						
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send" );
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

	$result = curl_exec($ch);
	if ($result === FALSE) {
		die('Problem occurred: ' . curl_error($ch));
	}
	curl_close($ch);
    }
    
    public function NotificacionConductor ($idConductor, $idServicio){
        $payload = array(
            'title'         => "TRL (Asignación de Servicio)",
            'msg'           => "Estimado usuario se le  ha asignado un servicio, por favor confirmar la aceptación del servicio N° ".$idServicio,
            'std'           => 1,
        );
                                        
        $idPushvec = array();
        $idPushvec[0] = $key = $this->obtenerRegid($idConductor);
        $this->enviarNotificacion($idPushvec,$payload);    
    }
    
    public function NotificacionCliente($idCliente, $idServicio){
        $payload = array(
            'title'         => "TRL (Asignación de Servicio)",
            'msg'           => "Estimado Cliente. Se ha asigando un conductor a su servicio N° ".$idServicio,
            'std'           => 200,
        );
                                        
        $idPushvec = array();        
        $key = $this->obtenerKeyCliente($idCliente);
        
        if(!empty($key)){
            $idPushvec[0] = $key;
            $this->enviarNotificacion($idPushvec,$payload);    
        }       
    }
    
    private  function obtenerRegid($idConductor){
        try {
            $regid = DB::select("SELECT sm.gpKey FROM (conductor c INNER JOIN vehiculo v ON c.VehiculoId = v.IdVehiculo) INNER JOIN "
                . "gps sm ON v.IdVehiculo = sm.gpVehiculoId WHERE sm.gpEstado='ACTIVO' AND  c.IdConductor=$idConductor LIMIT 1");
            if(!empty($regid)){
                return $regid[0]->gpKey;
            }
            return null;
        }  catch (Exception $e) {
            return JsonResponse::create(array('message' => "ErrorKey", "request" =>$e->getMessage()), 401);
        }
    } 
    
    private  function obtenerKeyCliente($idCliente){
        try {
            $regid = Cliente::where("IdCliente", $idCliente)->select("KeyNotificacion")->first();
            if(!empty($regid)){                
                return $regid->KeyNotificacion;
            }            
            return null;
        }  catch (Exception $e) {
            return JsonResponse::create(array('message' => "ErrorKey", "request" =>$e->getMessage()), 401);
        }
    } 

    private function enviarNotificacion($array,$payload) {
        $apiKey = 'AAAAi3Qf2F8:APA91bG7JP2FtXjzsSTNTqJlYVrSeLRKLL0QxjZ-VnpJWlWiUEjvc5jw241Y0SJI-DrHCJeTgFyPnFhCAXOMC0dZdE71EnnA6H_5HPEQjuVBJBJDirxUhLdzdmG7fd39wZXutJTTeBTSs85nB9WE3bSWHmjyR8WLcw';
        $headers = array('Content-Type:application/json',"Authorization:key=$apiKey");

        $data = array(
            'data' => $payload,
            'registration_ids' => $array
        );

        $ch = curl_init();
        curl_setopt ($ch, CURLOPT_ENCODING, 'gzip');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        $res = curl_exec($ch);
        curl_close($ch); 
        return "Correcto";
    }
    
    private function SenEmail($para, $titulo, $mensaje){
        $correo = new \PHPMailer(true); // notice the \  you have to use root namespace here
        try {
            $correo->isSMTP(); 
            $correo->CharSet = "utf-8"; 
            $correo->SMTPAuth = true;  
            $correo->SMTPSecure = "tls"; 
            $correo->Host = "smtp.gmail.com";
            $correo->Port = 587; 
            $correo->Username = "soportetrlapp@gmail.com";
            $correo->Password =env('MAIL_PASSWORD');
            $correo->setFrom("soportetrlapp@gmail.com", "Soporte TRL");
            $correo->Subject = $titulo;
            $correo->MsgHTML($mensaje);
            $correo->addAddress($para, "Usuario TRL");
            $correo->send();
        } catch (phpmailerException $e) {
            return $e;
        } catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
        return "Correcto";
    }     
}

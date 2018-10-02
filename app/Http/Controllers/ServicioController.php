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
use App\TipoServicio;
use App\Ruta;

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
        $servicio =  Servicio::find($codigo);
        if(isset($servicio)){
            $servicio->Paradas = [];
            if($servicio->Parada == "SI"){
                $servicio->Paradas = Parada::where('prServicio', $codigo)->where('prEstado', 'ACTIVA')->get();
            }            
            $servicio->Contactos = ServicioContactos::where('scIdServicio', $codigo)
                    ->where('scEstado', 'ACTIVO')->get();
            
            $servicio->svDescripcion = TipoServicio::where( 'svCodigo', $servicio->TipoServicidoId)
                    ->first(['svDescripcion'])['svDescripcion'];
            
            if (!is_null($servicio->ConductorId)){
                $conductor =  DB::select ("SELECT c.Nombre, c.TelefonoPpal, c.TelefonoTres, c.Email, v.Placa, v.Movil, c.RutaImg 
                        FROM conductor AS c INNER JOIN vehiculo  AS v ON c.VehiculoId =  v.IdVehiculo
                        WHERE c.IdConductor =$servicio->ConductorId LIMIT 1");
  
                if(!empty($conductor)){
                    $servicio->Conductor = $conductor[0];
                }
            }
            
            if($servicio->TipoServicidoId == 3){
                $servicio->Ruta = Ruta::select("rtNombre", "rtDescripcion", "rtValorCliente")
                        ->where("rtCodigo", $servicio->DetallePlantillaId)->first();
            } else if ($servicio->TipoServicidoId == 4){
                $traslado =  $result = DB::select("SELECT  t.tlNombre,  t.tlCiudadDestino, "
                    . "  m.muNombre, t.tlDeptoDestino, t.tlDeptoOrigen,  t.tlCiudadOrigen "
                    . "  FROM traslados t INNER JOIN municipio m ON t.tlCiudadOrigen=m.muCodigo "
                    . "  WHERE t.tlCodigo=  $servicio->DetallePlantillaId ");
                
                if(!empty($traslado)){
                    $servicio->Traslado =  $traslado[0];
                }
            }
        }        
        return $servicio;
    }
        
    public function getServicioCliente($id, $rol, $usuario, $limite=0)
    {
        $condicion = " WHERE s.ClienteId = ".$id;
        if($rol==="5"){
            $condicion = " WHERE  s.UserReg = '".$usuario ."'";
        }

        $condicionLimite = "";
        if ($limite > 0){
            $condicionLimite = " LIMIT 20";
        }
            
        $servicio = DB::select("SELECT s.IdServicio, s.ContratoId, s.ClienteId, s.NumeroContrato, s.Responsable,"
                . " s.Telefono, s.TipoServicidoId, ts.svDescripcion, s.FechaServicio, s.Hora, s.Valor, s.ValorCliente, s.Estado, "
                . " s.DescVehiculo, s.ValorTotal, s.ConductorId FROM servicio s INNER JOIN  tiposervicio ts ON "
                . " s.TipoServicidoId=ts.svCodigo ". $condicion ."  order by s.IdServicio desc $condicionLimite");
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
                . " ON c.VehiculoId =  v.IdVehiculo WHERE c.Estado='ACTIVO' AND v.ClaseVehiculo = $tipo");
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
            $servicio->DetallePlantillaId = $data["DetallePlantillaId"];            
            $servicio->Nota= $data["Nota"];            
            $servicio->Calificacion= 0;
            $servicio->Placa= "";            
            $servicio->UserReg= $data["UserReg"];
            $servicio->FechaMod = new \DateTime();
            $servicio->IdUsuario= $data["IdUsuario"];
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
            
            $mensaje = "Servicio guardado correctamente";
            //asignar conductor, cuando es tipo de servicio transfer o disponibilidad
            if($servicio->ModoServicio == "INMEDIATO" && ($servicio->TipoServicidoId == 1 || $servicio->TipoServicidoId==2)){
                
                $resultado = $this->BuscarConductorDisponible($servicio->LatOrigen, $servicio->LngOrigen, $servicio->TipoVehiculoId);
                
                $mensaje = "Estimado(a) cliente, no fue posible asignar un conductor al servicio. El Servicio ha sido guardado, a espera de ser asignado. ";
                if(!empty($resultado)){
                    $conductor = $resultado[0]; 
                    $numReg = $this->asignarServicio($servicio->IdServicio, $conductor->IdConductor, $conductor->CdPlaca,  
                          $servicio->Responsable, $conductor->Email, $conductor->Nombre);                    
                    if ($numReg != 0){
                        $mensaje = "Servicio guardado correctamente. Asignado al Vehículo : $conductor->CdPlaca";
                    }
                }
            }
                                    
            return JsonResponse::create(array('message' => $mensaje, "request" =>json_encode($servicio->IdServicio)), 200);
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
                        
            $result = $this->asignarServicio($data["IdServicio"], $data['ConductorId'], $data['Placa'],
                    $data["Responsable"], $data["Email"], $data["Nombre"]);                                    
            
            if ($result !=0){
                return JsonResponse::create(array('message' => "Servicio asignado correctamente", "request" =>json_encode($result)), 200);
            } 
            return JsonResponse::create(array('message' => "Error al asignar servicio", "request" =>json_encode($result)), 200);
            
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
    
    public function updateServicio(Request $request, $id)
    {
        try{
                                    
            $data = $request->all();                   
            $servicio = Servicio::find($id);                                    
            $servicio->Responsable = $data["Responsable"]; 
            $servicio->Telefono = $data["Telefono"];                                    
            $servicio->Valor= $data["Valor"];
            $servicio->ValorCliente = $data["ValorCliente"];
            $servicio->ValorParadas = $data["ValorParadas"];
            $servicio->NumPasajeros= $data["NumPasajeros"];                 
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
            
            return JsonResponse::create(array('message' => "Servicio Actualizado correctamente", "request" =>json_encode($id)), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
            
    //Actualiza el estado del servicio por el conductor
    public function updateServConductor(Request $request, $id){
        try {            
            $data = $request->all();
            $estado = strtoupper($data['Estado']);            
            $servicio = Servicio::where('IdServicio', $id)->select('ClienteId', 'Estado', 'ConductorId')->first();
            if (!empty($servicio)) {
                if($servicio->Estado != 'CANCELADO' && $servicio->Estado != 'FINALIZADO'){
                    $result = DB::update("UPDATE servicio SET Estado= '".$estado."', FechaMod=NOW() WHERE IdServicio=$id ");
                    
                    if($estado === "FINALIZADO"){
                        DB::update("UPDATE conductor SET Disposicion= 'LIBRE' WHERE IdConductor=$servicio->ConductorId ");
                        $this->EmailCalificacion($id);
                        $msjCliente = "☺️ Estimado Cliente. Su servicio N° ". $id . " ha finalizado, le invitamos "
                        . " a calificar el servicio prestado.  ✔️✔️";  
                        $this->NotificacionCliente($servicio->ClienteId, $msjCliente, 2, $id);  
                    } else if($estado === "EN SITIO"){
                        DB::update("UPDATE conductor SET Disposicion= 'EN SERVICIO' WHERE IdConductor=$servicio->ConductorId ");
                         $msjCliente = "☺️ Estimado Cliente. El estado de su servicio N° ". $id . " es : ".$estado;           
                        $this->NotificacionCliente($servicio->ClienteId, $msjCliente, 1, $id); 
                    } else if ($estado === "CONFIRMADO"){
                        $msjCliente = "☺️ Estimado Cliente . Se ha asigando un conductor a su servicio N° ". $id . " 🚘";           
                        $this->NotificacionCliente($servicio->ClienteId, $msjCliente, 1, $id); 
                    }
                    else if($estado != 'RECHAZADO'){
                        $msjCliente = "☺️ Estimado Cliente. El estado de su servicio N° ". $id . " es : ".$estado;           
                        $this->NotificacionCliente($servicio->ClienteId, $msjCliente, 1, $id);         
                    }
                    
                    DB::insert("INSERT INTO servicio_estados (stServicioId, stEstado, stFecha ) VALUES ($id, '".$estado."', sysdate())");            
                    return JsonResponse::create(array('message' => "Servicio actualizado correctamente", "request" =>json_encode($result)), 200);
                }
            }
            
            return JsonResponse::create(array('message' => "Servicio NO permite cambio de estado", "request" =>json_encode(0)), 200);
            
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
            $servicio = DB::update("UPDATE servicio SET Estado= 'RECHAZADO', ConductorId=NULL, Placa ='' WHERE IdServicio=$id ");
            return JsonResponse::create(array('message' => "Servicio rechazado", "request" =>json_encode($servicio)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    public function cancelarServicio(Request $request, $id){
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
                    $msjConductor = "Estimado usuario el servicio N° ". $id . " ha sido cancelado. 😟😟";          
                    $this->NotificacionConductor($scConductorId, $msjConductor);
                }                               
            }	                        	    
            return JsonResponse::create(array('bandera' => "Correcto ", 'message' => "Servicio cancelado correctamente",), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('bandera' => "Error", 'file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }       
    
    private function BuscarConductorDisponible($latitud, $longitud, $tipoVehiculo){
        try{                        
            
            $resultado = DB::select("SELECT c.IdConductor,  c.Disposicion, MINUTE(TIMEDIFF(gpFecha,  NOW())) tiempo, "
                    . "  c.CdPlaca, c.Nombre, c.Email, "
                    . " (6371 * ACOS( SIN(RADIANS(g.gpLatitud)) * SIN(RADIANS('$latitud')) + COS(RADIANS(g.gpLongitud - '$longitud')) * COS(RADIANS(g.gpLatitud)) * COS(RADIANS('$latitud')) ) ) AS distancia "
                    . " FROM (conductor c INNER JOIN vehiculo v ON c.VehiculoId = v.IdVehiculo) INNER JOIN gps g ON v.IdVehiculo = g.gpVehiculoId "
                    . " WHERE  g.gpEstado='ACTIVO' AND CURRENT_DATE() = DATE(g.gpFecha)  AND  c.Disposicion='LIBRE' "
                    . " AND c.Estado = 'ACTIVO'  AND v.ClaseVehiculo = $tipoVehiculo "
                    . " HAVING tiempo < 6 AND distancia <= 1 ORDER BY distancia ASC LIMIT 1 ");
                                    
            return $resultado;
        
        } catch (\Exception $exc) {
            return JsonResponse::create(array('bandera' => "Error", 'file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    /*Asignar servicio al conductor ya sea manual o automatico */
    private function asignarServicio($idServicio, $conductorId, $placa, $responsable, $emailConductor, $nombreConductor){
        
        $result = DB::update("UPDATE servicio SET  Estado='ASIGNADO', ConductorId=$conductorId, Placa ='$placa',"
                . " FechaAsignacion = NOW() WHERE IdServicio= $idServicio");
        
        if ($result != 0){
            $this->EnviarEmailAsignar($idServicio, $responsable, $emailConductor, $nombreConductor);

            $msjConductor = "Estimado usuario se le  ha asignado un servicio, por favor confirmar "
                    . " la aceptación del servicio N° ". $idServicio . " ✔️✔️";            
            $this->NotificacionConductor($conductorId, $msjConductor);

        }
        
        return $result;
    }

    
    private function EnviarEmailAsignar($idServicio,  $responsable, $email, $conductor){
        // título
        $titulo = 'Asignación de servicio [TRL] ✔️✔️';
        // mensaje
        
        $mensaje = "
        <html>
        <head>
          <title>Asignación de servicio</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡Asignación de servicio!</h1>
          
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
        $titulo = 'Asignación de servicio [TRL] ✔️✔️';
        // mensaje
        
        $mensaje = "
        <html>
        <head>
          <title>Asignación de servicio</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡Asignación de servicio!</h1>
          
          <p>Estimado usuario(a), su solicitud de servicio ha sido confirmada. Por favor ingrese a la plataforma
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
        $titulo = 'Calificación de servicio [TRL] ☺️ ☺️';
        // mensaje
        $servicio  =  $this->getCalificacion($idServicio);
        $user = \App\Usuario::select("Email", "IdUsuario")->where("Login", "=", $servicio->UserReg)->first();
        $email = $user->Email;
        $mensaje = "
        <html>
        <head>
          <meta http-equiv='Content-Type' content='text/html; charset=utf-8' /> 
          <title> Calificación de servicio</title>
        </head>
        <body>
         <img style='height:60px; width:200px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡ Calificación de servicio !</h1>
              
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
    
    public function NotificacionConductor ($idConductor, $mensaje){
        $payload = array(
            'title'         => "TRL Servicio",
            'body'           => $mensaje,
            'std'           => 1,
        );
                                        
        $idPushvec = array();
        $idPushvec[0] = $key = $this->obtenerRegid($idConductor);
        $this->enviarNotificacion($idPushvec,$payload);    
    }
    
    public function NotificacionCliente($idCliente, $mensaje, $idPagina, $idServicio){
        $payload = array(
            'title'         => "TRL Servicio",
            'msg'           => $mensaje,
            'body'           => $mensaje,
            'pagina'           => $idPagina,
            'codigo'        => $idServicio
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
        $apiKey = 'AAAAU12l6Gg:APA91bEGOfGpCMVZ5pdthZGiAKC7A6IfjYkpr1EJTxDjOnO7m9WZ4L68Ju3yDu5EJy6KyfYtvKT1Ccs_uQ8A_Eh4-MpJvJ86XY0vBKisfuZhBxtFA4I5uM4IX8i3eTjMHk0fJP_hcwo1';
        $headers = array('Content-Type:application/json',"Authorization:key=$apiKey");

        $data = array(
            'data' => $payload,
            'registration_ids' => $array,
            'notification' => $payload
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
            $correo->CharSet = "UTF-8"; 
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

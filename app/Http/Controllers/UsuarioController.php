<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Usuario;
use App\UsuarioPermiso;
use App\Conductor;
use App\Gps;
use Illuminate\Http\JsonResponse;
use DB;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;
 
class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Usuario::join('rol', 'usuario.TipoAcceso', '=', 'rol.IdRol')
                ->select('IdUsuario', 'Login', 'Nombre', 'Estado', 'Modulo', 'Sesion', 'FechaCnx','ValidarClave',
                'ClienteId', 'PersonaId', 'ConductorId', 'TipoAcceso', 'Contrato', 'Email', 'rol.Descripcion' )
                ->where("Estado", "<>" , "BORRADO")->get();
    }
    
    public  function GetPermisos ($user){
        
        $permiso = UsuarioPermiso::join('permiso', 'usuariopermiso.IdPermiso', '=' , 'permiso.IdPermiso')
                ->where('usuariopermiso.IdUsuario', $user)
                ->select( 'permiso.IdPermiso', 'pmNombre', 'pmModulo')->get();         
        return $permiso;
    }
    
    public function getUserByCliente($id){
        return Usuario::where('ClienteId', $id)
                ->select('IdUsuario', 'Login', 'Nombre',  'Estado', 'Modulo', 'Sesion', 'FechaCnx','ValidarClave',
                'ClienteId', 'PersonaId', 'ConductorId', 'TipoAcceso', 'Contrato', 'Email')->get();
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
            $clave = $this->generarClave();
            
            if(!isset($data["Login"])){
                return JsonResponse::create(array('message' => "Error al crear usuario", "request" =>json_encode('Error')), 200);
            }
            
            $usuario= new Usuario();              
            $usuario->Login = $data["Login"];
            $usuario->Clave = password_hash($clave, PASSWORD_DEFAULT) ;
            $usuario->Nombre = $data["Nombre"];
            $usuario->Estado = 'POR CONFIRMAR';
            $usuario->Modulo = $data["Modulo"];
            $usuario->Sesion = 'CERRADA';                        
            $usuario->ClienteId = $data["ClienteId"];
            $usuario->PersonaId = $data["PersonaId"];
            $usuario->ConductorId = $data["ConductorId"];
            $usuario->TipoAcceso =  $data["TipoAcceso"];
            $usuario->KeyConf = uniqid('TrL',true);
            $usuario->Contrato =  $data["Contrato"];
            $usuario->Email = $data["Email"];
            $usuario->save();
            
            $permisos = $data["Permisos"];            
            foreach ($permisos as $p) {
                $insert = new UsuarioPermiso();
                $insert->IdUsuario =$usuario->IdUsuario;
                $insert->IdPermiso = $p['IdPermiso'];
                $insert->save();
            }
            
            $this->EnviarEmail($data, $usuario->IdUsuario, $clave, $usuario->KeyConf);

            return JsonResponse::create(array('message' => "Usuario guardado correctamente", "request" =>json_encode($usuario->IdUsuario)), 200);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), $exc->getCode());
        }
    }
    
     private function generarClave (){
    	$bytes = openssl_random_pseudo_bytes(3,$cstrong);
        $clave = strtoupper(bin2hex($bytes)); 
        if (is_numeric($clave)){
			$clave = $clave . "" . $this->generarLetra();
		}
		return $clave;
    }

    private function generarLetra()
    {
    	$int = rand(0,24);	
    	$a_z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    	return  $a_z[$int];    
    }
    
    public function EnviarEmail($data, $idUsuario,  $clave, $key ){                  
        $user = $data['Login'];                
        $para  = $data['Email'];
        $nombre = $data['Nombre'];
        // título
        $titulo = 'Confirmacion Email [Transporte Ruta Libre]';
        // mensaje
        
        $mensaje = "
        <html>
        <head>
          <title>Confirmar Email y Datos de Usuario</title>
        </head>
        <body>
         <img style='height:60px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
          <h1> ¡Bienvenido a Transporte Ruta Libre!</h1>
          <p>Hola, $nombre </p><br/>
          <p> Por favor sigue este enlace para confirmar sus Datos de Usuario</p>
          <p><a href='http://".$_SERVER['HTTP_HOST']."/inicio/index.html#/confirmar/$idUsuario/$key' target='_blank'>Click Aqui, Para Confirmar tus Datos </a></p> 
          <br/>    
          <p>Usuario TRL: $user</p>
          <p>Contraseña TRL: $clave</p>
           <br/>
          <p>Atentamente</p>
          <p>Tu equipo de Transporte Ruta Libre</p>
        </body>
        </html>
        ";
       
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
       
        $cabeceras .= 'To: '.$nombre.' <'.$para.'>' . "\r\n";
        $cabeceras .= 'From: Transporte Ruta Libre <info@trl.co>' . "\r\n";        
          
        $this->SenEmail($para, $titulo, $mensaje);
        //mail($para, $título, $mensaje, $cabeceras);       
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = Usuario::select('IdUsuario', 'ConductorId', 'ClienteId', 'PersonaId', 'Nombre', 'Login', 'Estado',
                'TipoAcceso','Modulo', 'ValidarClave', 'Email','Contrato')->where("IdUsuario",$id)->first();
        
        if(!empty($user)){
            $user->permisos = DB::select("SELECT GROUP_CONCAT(IdPermiso SEPARATOR ',') permisos FROM "
                    . " usuariopermiso WHERE IdUsuario=$id GROUP BY IdUsuario")[0]->permisos;
        }
        
        return $user;
    }         
    
    public function validar($user){
        return Usuario::where("Login",$user)->select("Login", "IdUsuario")->first();
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
            $usuario = Usuario::find($id);
            $usuario->Nombre = $data["Nombre"];
            $usuario->Estado = $data["Estado"];
            $usuario->Modulo = $data["Modulo"];
            $usuario->Sesion = 'CERRADA';
            $usuario->TipoAcceso = $data["TipoAcceso"];
            $usuario->Email = $data["Email"];
            $usuario->Contrato = $data["Contrato"];
            $usuario->Login = $data["Login"];
            $usuario->save();
            
            UsuarioPermiso::where('IdUsuario',$id)->delete();
            $permisos = $data["Permisos"];
            foreach ($permisos as $p) {
                $insert = new UsuarioPermiso();
                $insert->IdUsuario =$id;
                $insert->IdPermiso = $p['IdPermiso'];
                $insert->save();
            }

            return JsonResponse::create(array('message' => "Datos actualizados correctamente", "request" =>json_encode($usuario->IdUsuario)), 200);
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
    
    public function cerrarSesion($usuario)
    {
        try{
            DB::update("UPDATE usuario SET  Sesion='CERRADA' WHERE IdUsuario = $usuario");
            return JsonResponse::create(array('message' => 'Correcto', "request" =>'Session Cerrada Correctamente'), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    
    public function cerrarConductor($idConductor)
    {
        try{
            DB::update("UPDATE usuario SET  Sesion='CERRADA' WHERE ConductorId = $idConductor");
            
            $conductor = Conductor::select("CdPlaca", "VehiculoId")->where("IdConductor", $idConductor)->first(); 
            
            DB::update("UPDATE gps SET  gpEstado='INACTIVO' WHERE gpVehiculoId = $conductor->VehiculoId");
                                          
            return JsonResponse::create(array('message' => 'Correcto', "request" =>'Session Cerrada Correctamente'), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
            
    public function autenticar(Request $request){
        try {
            $dirIp= ip2long($request->ip());                    
            if (!$dirIp){
                $dirIp = 0;
            }
                        
            $usuario = $request->get('email');
            $password = $request->get('password');                                    
            $tipo = $request->get('tipo');
            if (!isset($tipo)){
                $tipo = "MOVIL";
            }                       
            
            $user = Usuario::select('Estado','Sesion','Clave', 'Nombre', 'IdUsuario', 'TipoAcceso', 'Modulo')->where("Login",$usuario)->first();
            if (empty($user)){
                return JsonResponse::create(array('error' => "Usuario no existe en el Sistema"), 200);                
            }
            
            if($user->Estado != 'ACTIVO'){
                return JsonResponse::create(array('error' => "Usuario bloqueado"), 200);                
            }
        
            if (!password_verify($password, $user->Clave)) {
                return JsonResponse::create(array('error' => "Credenciales no validas"), 200);                
            }
            
            if ($tipo === 'MOVIL' && ($user->TipoAcceso != 4 && $user->TipoAcceso !=5)){
                return JsonResponse::create(array('error' => "Tipo de acceso No permitido"), 200);
            }
                                           
            if($user->Sesion == 'INICIADA' && $user->TipoAcceso != 1){
                $result = DB::Select("SELECT DirIp, IF(DATE(FechaCnx) = CURRENT_DATE(), 'SI', 'NO') entrar"
                        . " FROM usuario WHERE IdUsuario= '".$user['IdUsuario']."'");                
                if ($result[0]->entrar == 'SI' && $dirIp!=$result[0]->DirIp ){
                    //return response()->json(['error' => 'Estimado Usuario(a), usted tiene una Sesion iniciada. '], 401);                    
                }
            }
            
            $token = JWTAuth::fromUser($user, $this->getData($user));                       
            DB::update("UPDATE usuario SET FechaCnx = NOW(), DirIp=$dirIp, Sesion='INICIADA' WHERE IdUsuario = ".$user['IdUsuario']."");
            return response()->json(compact('token'));

        } catch (JWTException $e) {
            return response()->json(['error' => 'No se pudo crear el token'.$e], 200);            
        } catch (\Exception $exc) {
            return JsonResponse::create(array('error' => "No se pudo autenticar el usuario", "request" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    public function autenticarConductor(Request $request){
        try {
            $dirIp= ip2long($request->ip());                    
            if (!$dirIp){
                $dirIp = 0;
            }
                        
            $usuario = $request->get('email');
            $password = $request->get('password');
            $imei = $request->get('imei');
                        
            $user = Usuario::select('Estado','Sesion','Clave', 'Nombre', 'IdUsuario', 'TipoAcceso', 
                    'Modulo', 'ConductorId')->where("Login",$usuario)->first();
            
            if (empty($user)){
                return JsonResponse::create(array('error' => "Usuario no existe en el Sistema"), 200);                
            }
            
            if($user->Estado != 'ACTIVO'){
                return JsonResponse::create(array('error' => "Usuario bloqueado"), 200);                
            }
            
            if($user->TipoAcceso != 3){
                return JsonResponse::create(array('error' => "Tipo de acceso No permitido"), 200);     
            }
        
            if (!password_verify($password, $user->Clave)) {
                return JsonResponse::create(array('error' => "Credenciales no validas"), 200);                
            }             
            
            $enviarnotifiacion = false;            
            if($user->Sesion == 'INICIADA'){
                $enviarnotifiacion = true;
//                $result = DB::Select("SELECT DirIp, IF(DATE(FechaCnx) = CURRENT_DATE(), 'SI', 'NO') entrar"
//                        . " FROM usuario WHERE IdUsuario= '".$user['IdUsuario']."'");                
//                if ($result[0]->entrar == 'SI' && $dirIp!=$result[0]->DirIp ){
//                    return response()->json(['error' => 'Estimado Usuario(a), usted tiene una Sesion iniciada. '], 500);                    
//                }
            }
            
            $this->buscarConductor($user->ConductorId, $imei, $enviarnotifiacion);
                        
            $token = JWTAuth::fromUser($user, $this->getData($user));                       
            DB::update("UPDATE usuario SET FechaCnx = NOW(), DirIp=$dirIp, Sesion='INICIADA' WHERE IdUsuario = ".$user['IdUsuario']."");
            return response()->json(compact('token'));

        } catch (JWTException $e) {
            return response()->json(['error' => 'No se pudo crear el token'.$e], 200);            
        } catch (\Exception $exc) {
            return JsonResponse::create(array('error' => "No se pudo autenticar el usuario", "request" =>json_encode($exc->getMessage())), 500);
        }
    }        

    private function getData($user)
    {
        $data = [
            'user' => [
                'IdUsuario' => $user->IdUsuario,
                'Nombre' => $user->Nombre, 
                'TipoAcceso' => $user->TipoAcceso, 
                'Modulo'=> $user->Modulo
            ]];
        return $data;
    }
    
    private function buscarConductor ($conductorId, $imei, $enviarnotifiacion){
        $conductor = Conductor::select("CdPlaca", "VehiculoId")->where("IdConductor", $conductorId)->first();        
        $gps = Gps::select("gpImei", "gpKey")->where("gpVehiculoId", $conductor->VehiculoId)
                    ->where("gpEstado", "ACTIVO")->first();
        $imeiActual = "";        
        if(!empty($gps)){
           $imeiActual = $gps->gpImei; 
           
           if($enviarnotifiacion && $gps->gpImei != $imei){
               $payload = array(
                    'title'         => "TRL (Cerrar Sesión)",
                    'msg'           => "Estimado usuario se ha detectado un inicio de sesión en otro dispositivo. Su sesión ha caducado.",
                    'std'           => 1000,
                );
                                        
                $idPushvec = array();
                $idPushvec[0] = $key = $gps->gpKey; 
                $this->enviarNotificacion($idPushvec,$payload);  
            }           
        }
        
        $this->registrarImei($conductor->CdPlaca, $conductor->VehiculoId, $imeiActual, $imei);                
    }        
    
    private function registrarImei ($placa, $IdVehiculo,  $ImeiActual,  $ImeiNuevo){
        try{                                   
            
            if ($ImeiActual !==""){
                DB::update("UPDATE gps SET gpEstado = 'INACTIVO' WHERE gpVehiculoId = $IdVehiculo ");
            }
            
            $smartphone = Gps::where("gpImei", $ImeiNuevo)->first();            
            if (empty($smartphone)){                
                $smart = new Gps();                
                $smart->gpImei = $ImeiNuevo;                
                $smart->gpLatitud = '0';
                $smart->gpLongitud = '0';
                $smart->gpEstado = 'ACTIVO';
                $smart->gpVehiculoId = $IdVehiculo;
                $smart->gpKey = '0';                
                $smart->gpFecha = '0000-00-00';
                $smart->gpPlaca = $placa;
                $smart->save();
                return JsonResponse::create(array('message' => "Correcto", "request" =>"Imei Guardado Correctamente"), 200);
            } else {
                $smartphone->gpPlaca = $placa;
                $smartphone->gpVehiculoId = $IdVehiculo;                
                $smartphone->gpEstado = 'ACTIVO';
                $smartphone->save();
                return JsonResponse::create(array('message' => "Correcto", "request" =>"Imei Actualizado Correctamente"), 200);
            }            
            return JsonResponse::create(array('message' => "Error", "request" =>"Error al Guardar IMEI"), 200);
                                    
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    public function ConfirmarCuenta($id, $key){

        $usuario = Usuario::where("IdUsuario",$id)->where("KeyConf",$key)
                ->select("KeyConf")->first();

        if (empty($usuario)){
            return JsonResponse::create(array('message' => "Error", "request" =>'Error, Key de confirmación invalido'), 200);
        }

        DB::update("UPDATE usuario SET Estado = 'ACTIVO' WHERE IdUsuario = $id ");

        return JsonResponse::create(array('message' => "Correcto", "request" =>'Usuario confirmado correctamente'), 200);
    }

    public function RecuperarClave(Request $request){
        $data = $request->all();
        $correo = $data['email'];
        $usuario = Usuario::where("Email",$correo)->select('Email', 'Nombre',  'Login', 'IdUsuario')->first();
        if (empty($usuario)) {
            return JsonResponse::create(array('message' => "error", "request" =>'Email No Existe en El Sistema'), 200);
        }       
        
        $keyCon = uniqid('bT',true);
        DB::update("UPDATE recuperacion SET Estado ='VENCIDO' WHERE UsuarioId = $usuario->IdUsuario AND date(Fecha)= CURRENT_DATE()");
        $id = DB::table('recuperacion')->insertGetId(
            array('UsuarioId' => $usuario->IdUsuario, 'KeyConf' => $keyCon, 'Estado' => 'ACTIVO', 'Username' => $usuario->Login)
        );
        
        $para  = $usuario->Email;
        $nombre = $usuario->Nombre;        
        $titulo = utf8_encode("Cambio de Contraseña [Trl Transporte]");
        // mensaje
        $mensaje = "
        <html>
        <head>
          <title>". utf8_encode("Recuperación de  contraseña") ."</title>
        </head>
        <body>
            <img style='height:60px;' src='http://".$_SERVER['HTTP_HOST']."/trl/images/logo.png' alt=''/>
            <h1>Hola, ". $usuario->Nombre ."</h1><br/>
            <p>Hemos Recibido una solicitud, para recuperar su contraseña</p>
            <p> Si deseas cambiar tu contraseña, por favor sigue este enlace para ingresar una nueva contraseña</p>
            <p><a href='http://".$_SERVER['HTTP_HOST']."/inicio/index.html#/cambiarClave/$id/$usuario->IdUsuario/$keyCon' target='_blank'>Click Aqui, para cambiar tu Contraseña</a></p>
            <br/>
            <p>Atentamente</p>
            <p>Tu equipo de TRL</p>
        </body>
        </html>";
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
        $cabeceras .= 'To: '.$nombre.' <'.$para.'>' . "\r\n";
        $cabeceras .= 'From: Transporte Ruta Libre <info@trl.co>' . "\r\n"; 
        $this->SenEmail($para, $titulo, $mensaje);                
        //mail($para, $título, $mensaje, $cabeceras);        
        return JsonResponse::create(array('message' => "Correcto", "request" =>'Email enviado Correctamente'), 200);
    }

    

    public function vefiricarKey($idUsuario, $id, $key){

       $Object =DB::select("SELECT Id, UsuarioId, Estado,  TIMESTAMPDIFF(MINUTE, Fecha, NOW()) AS minutos"
               . " FROM recuperacion WHERE Id=$id  AND KeyConf = '$key' LIMIT 1");

        if(empty($Object)){
           return array('message' => 'error', 'request' =>'Error, Key de confirmación inválido');
        }

        if($Object[0]->UsuarioId != $idUsuario){
           return array('message' => 'error', 'request' =>'Error, Key de Confirmación Falso');
        }

        if($Object[0]->Estado == 'VENCIDO'){
           return array('message' => 'error', 'request' =>'Error, Key de Confirmación Vencido');
        }

        if( (int)$Object[0]->minutos > 20){
           return array('message' => 'error', 'request' =>'Error, El tiempo para cambiar tu contraseña ha caducado');
        }

        return array('message' => "Correcto", "request" =>'');
    }
    
    public function updatePassword(Request $request, $id)
    {        
        try{                                                  
            $data = $request->all();             
            $verificar =  $this->vefiricarKey($id, $data["Codigo"], $data["Key"]);
            
            if ($verificar['message'] != "Correcto"){
                return $verificar;
            }                       
            $clave = $data["Clave"];
            $usuario = Usuario::find($id);
            $usuario->Clave = password_hash($clave, PASSWORD_DEFAULT);            
            $usuario->Sesion = 'CERRADA';
            $usuario->ValidarClave = 'NO';
            $usuario->save();
            DB::update("UPDATE recuperacion SET estado ='VENCIDO' WHERE Id = ".$data['Codigo']." and keyConf='".$data["Key"]."'");            
            
            $user = $usuario->Login;
            $para  = $usuario->Email;
            $nombre = $usuario->Nombre;
            
            $this->enviarEmailClave($user, $para, $nombre, $clave);
                    
            return JsonResponse::create(array('message' => "Correcto", "request" =>'Contraseña modificada correctamente'), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    public function cambiarClave(Request $request)
    {        
        try{                                                  
            $data = $request->all();                                           
            $clave = $data["Clave"];
            $id = $data["Id"];
            $usuario = Usuario::find($id);
            if(empty($usuario)){
                return JsonResponse::create(array('message' => 'error', 'request' =>'Usuario no se encuentra registrado en el sistema.'));
            }
            $usuario->Clave = password_hash($clave, PASSWORD_DEFAULT);            
            $usuario->Sesion = 'CERRADA';
            $usuario->ValidarClave = 'NO'; 
            $usuario->save();            
            
            $user = $usuario->Login;
            $para  = $usuario->Email;
            $nombre = $usuario->Nombre;
            
            
            $this->enviarEmailClave($user, $para, $nombre, $clave);
            
            return JsonResponse::create(array('message' => "Correcto", "request" =>'Contraseña modificada correctamente'), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
    
    private function enviarEmailClave($user, $para, $nombre, $clave){
         // título
            $titulo = utf8_encode("Cambio de Contraseña [TRL Transporte]");
            // mensaje
            $mensaje = "
            <html>
            <head>
              <title>". utf8_encode("Cambio de Contraseña") ."</title>
            </head>
            <body>          
              <h1>Hola, $nombre </h1><br/>
              <p>Tu contraseña ha sido modificada exitosamente</p>                         
              <br/>    
              <h3>Tus datos de Inicio de Session</h3>
              <p>Usuario TRL: $user</p>
              <p>Contraseña: $clave</p>
               <br/>
              <p>Atentamente</p>
              <p>Tu equipo de TRL</p>
            </body>
            </html> ";

            $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
            $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $cabeceras .= 'To: '.$nombre.' <'.$para.'>' . "\r\n";
            $cabeceras .= 'From: Transporte Ruta Libre <info@trl.com.co>' . "\r\n";  
            $this->SenEmail($para, $titulo, $mensaje);
            //mail($para, $título, $mensaje, $cabeceras);       
    }

    public function updateEstado(Request $request, $IdUsuario){
       try {
           $data = $request->all();
           $usuario = Usuario::find($IdUsuario);
           $usuario->Estado = $data['Estado'];           
           $usuario->save();
           return JsonResponse::create(array('message' => "Usuario actualizado correctamente", "request" =>json_encode($IdUsuario)), 200);
       }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
   }
   
    public function refreshToken()
    {
        $token = JWTAuth::getToken();                        
        if(!$token){
            return response()->json(['Token not provided'], 401);
        }
        try{
            $newToken = JWTAuth::refresh($token);
        }catch(TokenInvalidException $e){
            return response()->json(['error' => $e->getMessage()], 403);
        }         
        return response()->json(['token'=>$newToken]);
    }
    
    public function ReenviarEmail(Request $request)
    {        
        try{                                                  
            $data = $request->all();                                                       
            $clave = $this->generarClave();
            
            $id = $data["IdUsuario"];
            $usuario = Usuario::find($id);
            if(empty($usuario)){
                return JsonResponse::create(array('message' => 'error', 'request' =>'Usuario no se encuentra registrado en el sistema.'));
            }
            $usuario->Clave = password_hash($clave, PASSWORD_DEFAULT);            
            $usuario->Sesion = 'CERRADA';
            $usuario->ValidarClave = 'SI'; 
            $usuario->Estado = 'POR CONFIRMAR';
            $usuario->KeyConf = uniqid('TrL',true);
            $usuario->save();                        
            
            $this->EnviarEmail($data, $id, $clave, $usuario->KeyConf);
            
            return JsonResponse::create(array('message' => "Correcto", "request" =>'Email enviado correctamente'), 200);
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
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
        return $res;
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

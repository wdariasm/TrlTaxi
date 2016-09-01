<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Usuario;
use App\UsuarioPermiso;
use Illuminate\Http\JsonResponse;
use DB;
use Crypt;
 
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
                'ClienteId', 'PersonaId', 'ConductorId', 'TipoAcceso', 'Contrato', 'Email', 'rol.Descripcion' )->get();
    }
    
    public  function GetPermisos ($user){
        
        $permiso = UsuarioPermiso::join('permiso', 'usuariopermiso.IdPermiso', '=' , 'permiso.IdPermiso')
                ->where('usuariopermiso.IdUsuario', $user)
                ->select( 'permiso.IdPermiso', 'pmNombre', 'pmModulo')->get();         
        return $permiso;
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
            $bytes = openssl_random_pseudo_bytes(3,$cstrong);
            $clave = strtoupper(bin2hex($bytes));   
            
            if(!isset($data["Login"])){
                return JsonResponse::create(array('message' => "Error al crear usuario", "request" =>json_encode('Error')), 200);
            }
            
            $usuario= new Usuario();              
            $usuario->Login = $data["Login"];
            $usuario->Clave =  Crypt::encrypt($clave);
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
            $usuario->Email = $data["Correo"];
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
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc->getMessage())), 401);
        }
    }
    
    public function EnviarEmail($data, $idUsuario,  $clave, $key ){                  
        $user = $data['Login'];                
        $para  = $data['Correo'];
        $nombre = $data['Nombre'];
        // título
        $título = 'Confirmacion Email [Transporte Ruta Libre]';
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
               
        mail($para, $título, $mensaje, $cabeceras);
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
    
    public function validar($user){
        return Usuario::where("Login",$user)->select("Login")->first();
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

            return JsonResponse::create(array('message' => "Datos Actualizados Correctamente", "request" =>json_encode($usuario->IdUsuario)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc)), 401);
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
            return JsonResponse::create(array('message' => "error", "request" =>json_encode($exc)), 401);
        }
    }

    public function autenticar(Request $request){
        try {
            $data = $request->all();
            $dirIp= ip2long($request->ip());        
            
            if (!$dirIp){
                $dirIp = 0;
            }

            $user = Usuario::select('Estado','Sesion', 'Clave', 'IdUsuario')->where("Login",$data['username'])->first();                   
            if (empty($user)){
                return JsonResponse::create(array('message' => "error", "request" =>'Usuario no existe en el Sistema'), 200);
            }

            if($user['Estado'] != 'ACTIVO'){
                return JsonResponse::create(array('message' => "error", "request" =>'Usuario Bloqueado'), 200);
            }         
          
            $clave =Crypt::decrypt($user['Clave']);                                    
            if(strcmp($data['clave'], $clave) !== 0 ){                 
                return JsonResponse::create(array('message' => "error", "request" =>'Credenciales no validas'), 200);
            }            
            
           /* if($user['Sesion'] == 'INICIADA'){
                $result = DB::Select("SELECT DirIp, IF(DATE(FechaCnx) = CURRENT_DATE(), 'SI', 'NO') entrar"
                        . " FROM usuario WHERE IdUsuario= '".$user['IdUsuario']."'");                
                if ($result[0]->entrar == 'SI' && $dirIp!=$result[0]->DirIp ){
                    return JsonResponse::create(array('message' => "error", "request" =>'Usted Tiene una Sesion iniciada Ya'), 200);
                }
            }*/
            
            $usuario = DB::select("SELECT us.IdUsuario,  us.ConductorId, us.ClienteId, us.PersonaId, us.Nombre, us.Login, us.Estado, us.TipoAcceso, "
                    . " us.Modulo, GROUP_CONCAT(up.IdPermiso SEPARATOR ',') permisos, us.ValidarClave FROM usuario us INNER JOIN "
                    . " usuariopermiso up ON us.IdUsuario=up.IdUsuario WHERE us.IdUsuario='".$user['IdUsuario']."' GROUP BY us.IdUsuario ");

            DB::update("UPDATE usuario SET FechaCnx = NOW(), DirIp=$dirIp, Sesion='INICIADA' WHERE IdUsuario = ".$user['IdUsuario']."");

            return JsonResponse::create(array('message' =>"Correcto", "request" =>json_encode($usuario[0])), 200);

        } catch (\DecryptException $e) {
            return JsonResponse::create(array('message' => "No se puedo autenticar el usuario", "request" =>json_encode($e->getMessage())), 401);
        } catch (\Exception $exc) {
            return JsonResponse::create(array('message' => "No se puedo autenticar el usuario", "request" =>json_encode($exc->getMessage())), 401);
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
        $título = utf8_encode("Cambio de Contraseña [Trl Transporte]");
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
        mail($para, $título, $mensaje, $cabeceras);        
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
            $usuario->Clave =  Crypt::encrypt($clave);            
            $usuario->Sesion = 'CERRADA';
            $usuario->ValidarClave = 'NO';
            $usuario->save();
            DB::update("UPDATE recuperacion SET estado ='VENCIDO' WHERE Id = ".$data['Codigo']." and keyConf='".$data["Key"]."'");            
            
            $user = $usuario->Login;
            $para  = $usuario->Email;
            $nombre = $usuario->Nombre;
            
            $this->enviarEmailClave($user, $para, $nombre, $clave);
                    
            return JsonResponse::create(array('message' => "Correcto", "request" =>'Contraseña modificada correctamente'), 200);
        } catch (Exception $exc) {            
            return JsonResponse::create(array('message' => "No se pudo Modificar la Contraseña", "request" =>json_encode($exc)), 401);
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
            $usuario->Clave =  Crypt::encrypt($clave);            
            $usuario->Sesion = 'CERRADA';
            $usuario->ValidarClave = 'NO'; 
            $usuario->save();            
            
            $user = $usuario->Login;
            $para  = $usuario->Email;
            $nombre = $usuario->Nombre;
            
            
            $this->enviarEmailClave($user, $para, $nombre, $clave);
            
            return JsonResponse::create(array('message' => "Correcto", "request" =>'Contraseña modificada correctamente'), 200);
        } catch (Exception $exc) {            
            return JsonResponse::create(array('message' => "No se pudo Modificar la Contraseña", "request" =>json_encode($exc)), 401);
        }
    }
    
    private function enviarEmailClave($user, $para, $nombre, $clave){
         // título
            $título = utf8_encode("Cambio de Contraseña [TRL Transporte]");
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
              <p>Usuario SportsBook: $user</p>
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
           // mail($para, $título, $mensaje, $cabeceras);       
    }

    public function updateEstado(Request $request, $IdUsuario){
       try {
           $data = $request->all();
           $usuario = Usuario::find($IdUsuario);
           $usuario->Estado = $data['Estado'];
           $msj = ($data['Estado'] === 'ACTIVO') ? 'ACTIVADO' : 'BORRADO';
           $usuario->save();
           return JsonResponse::create(array('message' => "USUARIO $msj CORRECTAMENTE", "request" =>json_encode($IdUsuario)), 200);
       } catch (Exception $ex) {
           return JsonResponse::create(array('message' => "No se pudo modificar el usuario", "exception"=>$ex->getMessage(), "request" =>json_encode($IdUsuario)), 401);
       }
   }

}

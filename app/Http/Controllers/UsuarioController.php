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
        //
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
            $bytes = openssl_random_pseudo_bytes(5,$cstrong);
            $clave = strtoupper(bin2hex($bytes));   
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
            $usuario->save();
            
            $permisos = $data["Permisos"];            
            foreach ($permisos as $p) {
                $insert = new UsuarioPermiso();
                $insert->IdUsuario =$usuario->IdUsuario;
                $insert->IdPermiso = $p['idPermiso'];
                $insert->save();
            }
            
            $this->EnviarEmail($data, $usuario->IdUsuario, $clave, $usuario->KeyConf);

            return JsonResponse::create(array('message' => "Usuario guardado correctamente", "request" =>json_encode($usuario->IdUsuario)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc)), 401);
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
         <img style='height:60px;' src='http://localhost/trl/images/logo.png' alt=''/>
          <h1> ¡Bienvenido a Transporte Ruta Libre!</h1>
          <p>Hola, $nombre </p><br/>
          <p> Por favor sigue este enlace para confirmar sus Datos de Usuario</p>
          <p><a href='http://localhost/inicio/index.html#/0/confirmar/$idUsuario/$key' target='_blank'>Click Aqui, Para Confirmar tus Datos </a></p> 
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
        //
    }

    
     public function perfiles(){
        $result = DB::select ("SELECT * FROM rol");
        return $result;
    }
    
    
    public function validar($user){
        return Usuario::where("Login",$user)->select("Login")->first();
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
         try{
            $data = $request->all();
            $usuario = Usuario::find($id);
            $usuario->Nombre = $data["Nombre"];
            $usuario->Estado = $data["Estado"];
            $usuario->Modulo = $data["Modulo"];
            $usuario->Sesion = 'CERRADA';
            $usuario->TipoAcceso = $data["TipoAcceso"];
            $usuario->Login = $data["Login"];
            $usuario->save();

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
            DB::update("UPDATE usuario SET  session='CERRADA' WHERE idUsuario = '$usuario'");
            return JsonResponse::create(array('message' => 'Correcto', "request" =>'Session Cerrada Correctamente'), 200);
        }catch (Exception $exc) {
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
            if($user['Sesion'] == 'INICIADA'){
                $result = DB::Select("SELECT DirIp, IF(DATE(FechaCnx) = CURRENT_DATE(), 'SI', 'NO') entrar"
                        . " FROM usuario WHERE IdUsuario= '".$user['IdUsuario']."'");                
                if ($result[0]->entrar == 'SI' && $dirIp!=$result[0]->DirIp ){
                    return JsonResponse::create(array('message' => "error", "request" =>'Usted Tiene una Sesion iniciada Ya'), 200);
                }
            }
            
            $usuario = DB::select("SELECT us.IdUsuario,  us.ConductorId, us.ClienteId, us.PersonaId, us.Nombre, us.Login, us.Estado, us.TipoAcceso, "
                    . " us.Modulo, GROUP_CONCAT(up.IdPermiso SEPARATOR ',') permisos FROM usuario us INNER JOIN "
                    . " usuariopermiso up ON us.IdUsuario=up.IdUsuario WHERE us.IdUsuario='".$user['IdUsuario']."' GROUP BY us.IdUsuario ");

            DB::update("UPDATE usuario SET FechaCnx = NOW(), DirIp=$dirIp, Sesion='INICIADA' WHERE IdUsuario = ".$user['IdUsuario']."");

            return JsonResponse::create(array('message' =>"Correcto", "request" =>json_encode($usuario)), 200);

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

        $usuario = Cliente::where("Email",$correo)->select('Email', 'Nombre',  'idCliente')->first();
        if (empty($usuario)) {
            return JsonResponse::create(array('message' => "error", "request" =>'Email No Existe en El Sistema'), 200);
        }

        if (strcmp($usuario->Email, $correo) !== 0) {
            return JsonResponse::create(array('message' => "error", "request" =>'El Email Ingresado no Coincide, Con el registrado en el Sistema'), 200);
        }

        $keyCon = uniqid('bT',true);
        DB::update("UPDATE recuperacion SET estado ='VENCIDO' WHERE idCliente = $usuario->idCliente AND date(fecha)= CURRENT_DATE()");
        $id = DB::table('recuperacion')->insertGetId(
            array('idCliente' => $usuario->idCliente, 'keyConf' => $keyCon, 'estado' => 'ACTIVO')
        );

        $config = Configuracion::where("idParametro",1)->select('empresa', 'prUrl')->first();

        $para  = $usuario->Email;
        $nombre = $usuario->Nombre;
        // título
        $título = utf8_encode("Cambio de Contraseña [$config->empresa]");
        // mensaje
        $mensaje = "
        <html>
        <head>
          <title>". utf8_encode("Recuperación de  Contraseña") ."</title>
        </head>
        <body>
            <img style='height:60px;' src='http://$config->prUrl/taxi/images/logo.png' alt=''/>
            <h1>Hola, ". $usuario->Nombre ."</h1><br/>
            <p>Hemos Recibido una solicitud, para recuperar Contraseña</p>
            <p> Si deseas cambiar tu Contraseña, por favor sigue este enlace para ingresar una Nueva Contraseña</p>
            <p><a href='http://$config->prUrl/cliente/index.html#/cambiarClave/$id/$usuario->idCliente/$keyCon' target='_blank'>Click Aqui, para cambiar tu Contraseña</a></p>
            <br/>
            <p>Atentamente</p>
            <p>Tu equipo de $config->empresa</p>
        </body>
        </html>
        ";

        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";

        $cabeceras .= 'To: '.$nombre.' <'.$para.'>' . "\r\n";
        $cabeceras .= 'From: SportsBook Atlantis <info@BahiaTaxi.com>' . "\r\n";
        //mail($para, $título, $mensaje, $cabeceras);
        return JsonResponse::create(array('message' => "Correcto", "request" =>'Email enviado Correctamente'), 200);
    }

    

    public function vefiricarKey($idCliente, $id, $key){

       $Object =DB::select("SELECT id, idCliente, estado,  TIMESTAMPDIFF(MINUTE, fecha, NOW()) AS minutos"
               . " FROM recuperacion WHERE id=$id  AND keyConf = '$key' LIMIT 1");

        if(empty($Object)){
           return array('message' => 'error', 'request' =>'Error, Key de Confirmación Invalido');
        }

        if($Object[0]->idCliente != $idCliente){
           return array('message' => 'error', 'request' =>'Error, Key de Confirmación Falso');
        }

        if($Object[0]->estado == 'VENCIDO'){
           return array('message' => 'error', 'request' =>'Error, Key de Confirmación Vencido');
        }

        if( (int)$Object[0]->minutos > 10){
           return array('message' => 'error', 'request' =>'Error, El tiempo para Cambiar tu Contraseña ha Caducado');
        }

        return array('message' => "Correcto", "request" =>'');
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

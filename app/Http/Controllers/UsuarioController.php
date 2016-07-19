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
}

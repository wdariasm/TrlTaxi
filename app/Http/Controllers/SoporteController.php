<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Http\JsonResponse;
use App\Soporte;
use DB;

class SoporteController extends Controller
{
    public function index()
    {
        return Soporte::all();
    }     
    
    public function show($user){
        try
        { 
            $condicion = "";
            if($user !=="ADMIN"){
                $condicion = " WHERE spUsuario = $user";
            }
            $result = DB::select("select *  from soporte $condicion order by IdSoporte desc");
            return $result;
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    }
    
    public function store(Request $request)
    {
        try
        { 
            $codigo = uniqid().".png";
            $para ="wdam1993@gmail.com";
            $email = $request->get('email');
            $login = $request->get('login');
            $nombre = $request->get('nombre');
            $asunto = $request->get('asunto');
            $mensajes = $request->get('mensaje');
            $Base64Img = $request->get('imagen'); 
            $error = $request->get('error'); 
            $url = $request->get('url');
            
            $soporte= new Soporte();
            $soporte->spUsuario = $login;            
            $soporte->spNombre = $nombre;
            $soporte->spEmail = $email;
            $soporte->spAsunto = $asunto;
            $soporte->spMensaje = $mensajes;
            $soporte->spError = $error;
            $soporte->spUrl = $url;
            $soporte->spImagen = "../img/error/".$codigo;
            $soporte->save();
            
            list($type, $Base64Img) = explode(';', $Base64Img);
            list(, $Base64Img) = explode(',', $Base64Img);

            $Base64Img = base64_decode($Base64Img);
            file_put_contents('../img/error/'.$codigo, $Base64Img); 
            
            $this->EmailNotificacion($para, $codigo, $soporte);
            
            return JsonResponse::create(array('message' => "Correcto", "request" =>json_encode($soporte->IdSoporte)), 200);
             
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        }
    
    }
    
    private function EmailNotificacion($para, $codigo, $soporte){
        $titulo = utf8_encode("[Error TRL]");
            // mensaje
            $mensaje = "
            <html>
            <head>
              <title>". utf8_encode("Error TRL") ."</title>
            </head>
            <body>          
              <h2>Usuario, $soporte->spNombre </h2><br/>
              <p>Hemos tenido el siguiente error: $soporte->spAsunto</p>                         
              <br/>    
              <h3>Datos del mensaje</h3>
              <p>Url: $soporte->spUrl</p>
              <p>Mensaje: $soporte->spMensaje</p> 
              <p>Error: $soporte->spError</p> 
                <img  src='http://".$_SERVER['HTTP_HOST']."/img/error/$codigo' alt='Error'/>
               <br/>
              <p>Atentamente</p>
              <p>Tu equipo  TRL</p>
            </body>
            </html> ";          
            
            $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
            $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $cabeceras .= 'To: '.$soporte->spNombre.' <'.$para.'>' . "\r\n";
            $cabeceras .= 'From: Transporte Ruta Libre <info@trl.com.co>' . "\r\n";  
            //mail($para, $título, $mensaje, $cabeceras);    
            
            $this->SenEmail($para, $titulo, $mensaje);
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

<?php

namespace App\Utilidades;
use Illuminate\Http\JsonResponse;

/**
 * Description of EnviarEmail
 *
 * @author FEWL
 */
class EnviarEmail {
   
    
    public function EmailSolicitud($idServicio, $contrato,  $responsable, $email){
        // título
        $titulo = 'Solicitud de servicio [TRL] ✔️✔️';
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
        unset($correo);
        return "Correcto";

    }    
}

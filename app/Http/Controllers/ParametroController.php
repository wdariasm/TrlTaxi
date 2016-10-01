<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Parametro;
use Illuminate\Http\JsonResponse;


class ParametroController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Parametro::first();
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
            $param = Parametro::find($id);
            $param->parCedula = $data["parCedula"];   
            $param->parEmpresa = $data["parEmpresa"];
            $param->parCiudad = $data["parCiudad"];
            $param->parFirma = $data["parFirma"];            
            $param->parConsecutivo = $data["parConsecutivo"];
            $param->parFormato = $data["parFormato"];
            $param->parTipoDoc = $data["parTipoDoc"];
            $param->parLatitud = $data["parLatitud"];
            $param->parLongitud = $data["parLongitud"];
            $param->parEnviarEmail = $data["parEnviarEmail"];
            $param->parEmail = $data["parEmail"];
            
            $param->save();                      
            return JsonResponse::create(array('message' => "Datos Guardados correctamente", "request" =>json_encode($param->id)), 200);
        } catch (Exception $exc) {            
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc)), 401);
        }
    }
    
    public function error(Request $request)
    {
        try{
            
            $codigo = uniqid().".png";
            $para ="wdam1993@gmail.com";
            $nombre = $request->get('nombre');
            $asunto = $request->get('asunto');
            $mensajes = $request->get('mensaje');  
            $Base64Img = $request->get('imagen'); 
            $error = $request->get('error'); 
            $url = $request->get('url');
            
            list($type, $Base64Img) = explode(';', $Base64Img);
            list(, $Base64Img) = explode(',', $Base64Img);

            $Base64Img = base64_decode($Base64Img);
            file_put_contents('../img/error/'.$codigo, $Base64Img); 
                       
            $título = utf8_encode("[Error TRL]");
            // mensaje
            $mensaje = "
            <html>
            <head>
              <title>". utf8_encode("Error TRL") ."</title>
            </head>
            <body>          
              <h2>Usuario, $nombre </h2><br/>
              <p>Hemos tenido el siguiente error: $asunto</p>                         
              <br/>    
              <h3>Datos del mensaje</h3>
              <p>Url: $url</p>
              <p>Mensaje: $mensajes</p> 
              <p>Error: $error</p> 
                <img  src='http://".$_SERVER['HTTP_HOST']."/img/error/$codigo' alt='Error'/>
               <br/>
              <p>Atentamente</p>
              <p>Tu equipo de TRL</p>
            </body>
            </html> ";          
            
            $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
            $cabeceras .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
            $cabeceras .= 'To: '.$nombre.' <'.$para.'>' . "\r\n";
            $cabeceras .= 'From: Transporte Ruta Libre <info@trl.com.co>' . "\r\n";  
            mail($para, $título, $mensaje, $cabeceras);   
            
            return JsonResponse::create(array('message' => "Correcto", "request" =>json_encode($codigo)), 200);
        }catch (\Exception $exc) {            
            return JsonResponse::create(array('message' =>'Error', "Error" =>json_encode($exc->getMessage())), 401);
        }
        
    }

   
}

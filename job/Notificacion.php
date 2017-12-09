<?php

/**
 * Description of Notificacion
 *
 * @author FEWL
 */
class Notificacion {
    //put your code here
    
    private $dbh;
    
    function __construct($conexion) {
        $this->dbh = $conexion;
    }
    
    
    public function NotificacionConductor ($idConductor, $mensaje){
        $payload = array(
            'title'         => "TRL Servicio",
            'msg'           => $mensaje,
            'std'           => 1,
        );
                                        
        $idPushvec = array();
        $idPushvec[0] = $key = $this->obtenerRegid($idConductor);
        $this->enviarNotificacion($idPushvec,$payload);    
    }
    
    private function NotificacionCliente($idCliente, $mensaje){
        $payload = array(
            'title'         => "TRL Servicio",
            'msg'           => $mensaje,
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
            $sql = $this->dbh->prepare("SELECT sm.gpKey FROM (conductor c INNER JOIN vehiculo v ON c.VehiculoId = v.IdVehiculo) INNER JOIN "
                . "gps sm ON v.IdVehiculo = sm.gpVehiculoId WHERE sm.gpEstado='ACTIVO' AND  c.IdConductor=$idConductor LIMIT 1");
            
            $sql->execute();
            
            $resultado = $sql->fetch(PDO::FETCH_OBJ);  
            
            if(!empty($resultado)){
                return $resultado->gpKey;
            }
            return null;
        }  catch (Exception $e) {
            return JsonResponse::create(array('message' => "ErrorKey", "request" =>$e->getMessage()), 401);
        }
    } 
    
    private  function obtenerKeyCliente($idCliente){
        try {
            
            $sql = $this->dbh->prepare("SELECT KeyNotificacion FROM  clientes WHERE IdCliente = $idCliente");
            $sql->execute();
            $resultado = $sql->fetch(PDO::FETCH_OBJ);              
            if(!empty($resultado)){                
                return $resultado->KeyNotificacion;
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
}

<?php
/**
 * Description of ValidarServicio
 *
 * @author FEWL
 */

require_once './Conexion.php';
require_once './Notificacion.php';


class Servicio {
    
    private  $dbh;        
    private  $notificar;
    public function __construct()
    {
        $this->dbh = new Conexion();        
   }
    
    /*  Funcion que permite validar un servicio asignado a un conductor 
        y si no lo acepta en determinado tiempo, se debe colocar nuevamente en solicitado.
     *  */
    public function ValidarServicioAsignados (){
        try{
            
            
            $sql  = $this->dbh->prepare("SELECT IdServicio, ConductorId, "
                . " MINUTE(TIMEDIFF(FechaAsignacion,  NOW())) tiempo FROM servicio "
                . " WHERE  Estado = 'ASIGNADO' AND DATE(FechaAsignacion) = CURRENT_DATE() HAVING tiempo > 6");
            $sql->execute();

            $resultado = $sql->fetchAll();

            $this->notificar =  new Notificacion($this->dbh);

            foreach ($resultado as $row) {
                $idServcio = $row['IdServicio'];
                $idConductor = $row['ConductorId'];

                $sql2 = $this->dbh->prepare("UPDATE servicio SET  Estado='SOLICITADO', ConductorId=NULL, Placa ='' WHERE IdServicio= $idServcio");
                $sql2->execute();

                $msjConductor = "Estimado usuario el servicio N° ". $idServcio . ", ha sido cancelado.";          
                $this->notificar->NotificacionConductor($idConductor, $msjConductor);
            } 

            $this->dbh->desconectar();
        } catch (Exception $exc) {
            return $exc->getMessage(). " " . $exc->getFile();
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Fpdf;
use DB;
use Illuminate\Http\JsonResponse;

class ReporteController extends Controller
{
   
    public function GenerarPDF(){
        $pdf=new Fpdf();
        $pdf::AddPage();
        $pdf::SetFont('Arial', 'B', 14);
        $pdf::Rect(8,10,193,275); //BORDE DE LA HOJA
        $pdf::Cell(35,24,$pdf::Image('../trl/images/logo.png',112,12,80,25),0,'R');
        $pdf::Cell(35,24,$pdf::Image('../trl/images/logoMintrasporte.png',20,12,80,25),0,'L');
        $pdf::Rect(110,10,91,40); //rectangulo para el logo de la empresa #2
        $pdf::Rect(8,10,102,40); //rectangulo para el logo minTransporte #1
        
        $pdf::Ln(2);
        $pdf::SetFont('Times', 'B', 9);
        $pdf::Cell(35,60,$pdf::Text(48, 55,'FICHA TECNICA DEL FORMATO UNICO DEL EXTRACTO DE CONTRATO "FUEC"')); 
        $pdf::Ln(2);
        $pdf::SetFont('Times', 'B', 12);
        $pdf::Cell(35,65,$pdf::Text(9, 60,'EXTRACTO DEL SERVICIO PUBLICO DE TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL'));
        $pdf::Ln(2);
        $pdf::SetFont('Times');
        ini_set('date.timezone','America/Bogota'); 
         $f = date("d-m-Y H:i:s");  
        $pdf::Cell(35,70,$pdf::Text(65,65,'EXPEDIDO el  , Hora'.$f )); // fecha  y hora expedido
        
        $pdf::Cell(35,75,$pdf::Text(70,70,'#'));
        $pdf::SetFont('Times','I',9);
        $pdf::Cell(35,75,$pdf::Text(185,70,'Code:'));
        $pdf::Rect(8,50,193,23);// tercer rectangulo
        
         
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(35,121,'RAZON SOCIAL:');
        $pdf::SetFont('Times');
        $pdf::Cell(85,121,$pdf::Text(47,77.5,'TRANSPORTE RUTA LIBRE'),0,'R');//NOMBRE DE LA EMPRESA
        $pdf::Rect(8,73,122,7); // rectangulo nombre de la empresa #4
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(85,121,'NIT:');
        $pdf::SetFont('Times');
        $pdf::Cell(85,121,$pdf::Text(141,77.5,'8999')); // NIT DE LA EMPRESA
        $pdf::Rect(130,73,71,7);  //rectangulo nit de la empresa #5
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(35,135,'CONTRATO No:');
        $pdf::SetFont('Times');
        $pdf::Cell(35,135,$pdf::Text(45,84.8,'015'),0,'C'); //NUMERO DEL CONTRATO
        $pdf::Rect(8,80,193,7); //rectangulo numero de contrato #6
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(35,149,'CONTRATANTE:');
        $pdf::SetFont('Times');
        $pdf::Cell(35,149,$pdf::Text(47,91.8,'LEAM'),0,'R');//NOMBRE DEL CONTRATANTE
        $pdf::Rect(8,87,122,7); // rectangulo nombre de la empresa #7
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(35,149,'NIT:');
        $pdf::SetFont('Times');
        $pdf::Cell(35,149,$pdf::Text(141,91.8,'8999')); // NIT CONTRATANTE
        $pdf::Rect(130,87,71,7);  //rectangulo nit de la empresa #8
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(35,163,'OBJETO CONTRATO:');
        $pdf::SetFont('Times');
        $pdf::Cell(35,163,$pdf::Text(56,98.8,'015'),0,'C'); //OBJETO CONTRATO 
        $pdf::Rect(8,94,193,7); //rectangulo numero de contrato #9
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','',10);
        $pdf::Cell(35,174,$pdf::Text(12,104.5,'SERVICIO DE TRANSPORTE'),0,'L'); //TRAER CONTRATO
        $pdf::Rect(8,101,193,5); //rectangulo descripcion contrato #10
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(35,186,'RECORRIDO:');
        $pdf::SetFont('Times');
        $pdf::Cell(35,186,$pdf::Text(40,110.5,''),0,'C'); //RECORRIDO
        $pdf::Rect(8,106,193,7); //rectangulo de recorrido #11
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','',12);
        $pdf::Cell(35,196,$pdf::Text(55,118.5,'CARTAGENA-MALAGANA-CARTAGENA'),0,'L'); //DESCRIPCION RUTA
        $pdf::Ln(0);
        $pdf::SetFont('Times','',10);
        $pdf::Cell(35,196,$pdf::Text(27.5,124.5,'CARTAGENA-TURBACO-ARJONA-GAMBOTE-EL VISO-MALAGANA'),0,'L'); //DESCRIPCION DE RUTAS
        $pdf::Rect(8,113,193,14); //rectangulo descripcion de la ruta #12
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Cell(35,229,'CONVENIO    CONSORCIO    UNION    TEMPORAL    CON:');
        $pdf::SetFont('Times');
        $pdf::Cell(35,229,$pdf::Text(128,131.8,'015'),0,'C'); //CONVENIO
        $pdf::Rect(8,127,193,7); //rectangulo convenio #13
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Text(70,139,'VIGENCIA DEL CONTRATO'); //vigencia contrato
        $pdf::Rect(8,134,193,7); //VIGECIA contrato #14

        $pdf::Ln(0);
        $pdf::SetFont('Times','B',10);
        $pdf::Cell(35,256,'FECHA INICIAL:');
        $pdf::SetFont('Times','',10);
        $pdf::Cell(35,256,$pdf::Text(43,145,''),0,'C'); //FECHA INICIAL 
        $pdf::Rect(8,141,193,7); //rectangulo fecha inicial  #15
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',10);
        $pdf::Text(11,153,'FECHA VENCIMIENTO:');
        $pdf::SetFont('Times','',10);
        $pdf::Cell(35,260.9,$pdf::Text(53,174,''),0,'C'); //FECHA VENCIMIENTO
        $pdf::Rect(8,148,193,7); //rectangulo fecha vencimiento #16
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Text(70,160,'CARACTERISTICAS DEL VEHICULO '); //caracterictica vehiculo
        $pdf::Rect(8,155,193,7); //caracteristica vehiculo #17
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Text(24,167,'PLACA');
        $pdf::Rect(8,162,48,7); // #18
        $pdf::Text(72,167,'MODELO');
        $pdf::Rect(8,162,96,7); // #19
        $pdf::Text(120,167,'MARCA');
        $pdf::Rect(8,162,144,7); // #20
        $pdf::Text(170,167,'CLASE');
        $pdf::Rect(8,162,193,7); // #21
        
        $pdf::SetFont('Times','',12);
        $pdf::Cell(35,260.9,$pdf::Text(24,174,''),0,'C'); //PLACA
        $pdf::Rect(8,169,48,7); // #22
        
        $pdf::Cell(35,260.9,$pdf::Text(72,174,''),0,'C'); //MODELO
        $pdf::Rect(8,169,96,7); // #23
        
        $pdf::Cell(35,260.9,$pdf::Text(120,174,''),0,'C'); //MARCA
        $pdf::Rect(8,169,144,7); // #24
        
        $pdf::Cell(35,260.9,$pdf::Text(170,174,'MOTO'),0,'C'); //CLASE
        $pdf::Rect(8,169,193,7); //#25
        
        $pdf::Ln(0);
        $pdf::SetFont('Times','B',12);
        $pdf::Text(34,181,'NUMERO INTERNO');
        $pdf::Rect(8,176,96,7); // #26
        $pdf::Text(120,181,'NUMERO TARJETA OPERACION');
        $pdf::Rect(8,176,193,7); // #27
        
        $pdf::SetFont('Times','B',12);
        $pdf::SetTextColor(0,0,153);
        $pdf::Cell(35,260.9,$pdf::Text(34,188,'0000'),0,'C'); //NUMERO INTERNO 
        $pdf::Rect(8,183,96,7); // #28
        
        $pdf::Cell(35,260.9,$pdf::Text(120,188,'100000'),0,'C'); //NUMERO TARJETA OPERACION
        $pdf::Rect(8,183,193,7); // #29
        
        $pdf::Ln(0);
        $pdf::SetTextColor(0,0,0);
        $pdf::SetFont('Times','',10);
        $pdf::Text(10,196,'Conductor 1');
        $pdf::Rect(8,190,27,10); // #30
        
        $pdf::Text(10,204,'Responsable del');
        $pdf::Text(10,208,'contratante');
        $pdf::Rect(8,200,27,10); // #31

        $pdf::SetFont('Times','B',9);
        $pdf::Text(37,194,'Nombres y Apellidos: '); 
        $pdf::Rect(8,190,100,10); //rectangulo de nombres y apellido Conductor 1 #32 
        $pdf::Text(37,204,'Nombres y Apellidos: '); 
        $pdf::Rect(8,200,100,10); // rectangulo de nombres y apellidos del responsable contratante#33
        $pdf::Text(110,194,'No. Cedula: '); 
        $pdf::Rect(8,190,130,10); // rectangulo numero de cedula del conductor #33
        $pdf::Text(110,204,'No. Cedula: '); 
        $pdf::Rect(8,200,130,10); // rectangulo numero de cedula responsable#34
        $pdf::Text(140,194,'No. Licencia: '); 
        $pdf::Rect(8,190,160,10); // rectangulo numero de licencia del conductor #35
        $pdf::Text(140,204,'Telefono: '); 
        $pdf::Rect(8,200,160,10); // rectangulo numero de telefono del responsable #36
        $pdf::Text(170,194,'Vigencia: '); 
        $pdf::Rect(8,190,193,10); // rectangulo de vigencial conductor #37
        $pdf::Text(170,204,'Direccion: '); 
        $pdf::Rect(8,200,193,10); // rectangulo de la direccion del responsable #38
        
        $pdf::SetFont('Times','',10);
       
        $pdf::Cell(35,260.9,$pdf::Text(37,199,'LIA MARTINES'),0,'C');//CONDUCTOR 1
        $pdf::Cell(35,260.9,$pdf::Text(37,209,'LIS CARRASCAL'),0,'C'); //RESPONSABLE DEL CONTRATANTE
        $pdf::Cell(35,260.9,$pdf::Text(110,199,'108977'),0,'C'); //NUMERO CEDULA DEL CONDUCTOR 
        $pdf::Cell(35,260.9,$pdf::Text(110,209,'08877'),0,'C'); //NUMERO DE CEDULA DEL RESPONSABLE
        $pdf::Cell(35,260.9,$pdf::Text(140,199,'09-97-97'),0,'C'); //NUMERO DE LICENCIA 
        $pdf::Cell(35,260.9,$pdf::Text(140,209,'796252'),0,'C'); //TELEFONO
        $pdf::Cell(35,260.9,$pdf::Text(170,199,'2016 -'),0,'C'); //VIGENCIA "fecha"
        $pdf::Cell(35,260.9,$pdf::Text(170,209,'CRR 36 BIS 16 C 51'),0,'C'); //DIRECCION DEL RESPONSABLE
        
        
        $pdf::SetFont('Times','B',12);
        $pdf::Text(55,215,'FORMATO UNICO EXTRACTO DE CONTRATO');
        $pdf::Rect(8,210,193,7); // #39
        
        $pdf::Cell(35,260.9,$pdf::Text(25,235,'HOLA'),0,'C'); //DATOS EMPRESA 
        $pdf::Rect(8,217,96,59); // #40
        
        $pdf::Cell(35,260.9,$pdf::Text(115,235,'FIRMA'),0,'C'); //FIRMA
        $pdf::Rect(8,217,193,59); // #41
        
        $pdf::SetFont('Times','',9);
        $pdf::Text(10,282,'Verificacion Online: '); 
        $pdf::SetFont('Times','',12);
        $pdf::Text(87,282,'NOTA: Area Verificaciones '); 
        $pdf::SetFont('Times','B',12);
        $pdf::Text(140,282,'Valido hasta:  '); 
        
        $pdf::SetFont('Times','',12);
        $pdf::SetTextColor(0,0,153);
        $pdf::Cell(35,260.9,$pdf::Text(37,282,'http://'),0,'C'); //RUTA HTTP
        $pdf::SetTextColor(255,0,0);
        $pdf::Cell(35,260.9,$pdf::Text(165,282,'2081'),0,'C'); //fecha de Validez
        $pdf::Rect(8,276,193,9); // #42
        $pdf::Output();
        exit();
    }

        /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //       
    }
    
    
    

   


  
}

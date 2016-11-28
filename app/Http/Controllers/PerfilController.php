<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Perfil;
use App\Permiso;
use App\PerfilPermiso;
use Illuminate\Http\JsonResponse;
use DB;

class PerfilController extends Controller
{
    public function index()
    {
        return Perfil::all();       
    }
    
    public function GetPerfilActivos()
    {
        return Perfil::where('rEstado','ACTIVO')->orderBy('Descripcion', 'asc')->get();       
    }
    
    public function GetPermisos(){
        return Permiso::select('IdPermiso','pmNombre','pmModulo')
                ->where('pmEstado','ACTIVO')               
                ->orderBy('pmNombre', 'asc')->get();
    }
    
//    public  function GetPermisosByPerfil($perfil){
//        return DB::select("SELECT   GROUP_CONCAT(IdPermiso) permisos FROM rolpermiso WHERE idRol=$perfil  GROUP BY idRol");
//    }
    
    public  function GetPermisosByPerfil($perfil){
        return PerfilPermiso::join('permiso', 'rolpermiso.IdPermiso', '=' , 'permiso.IdPermiso')
                ->where('rolpermiso.IdRol', $perfil)
                ->select( 'permiso.IdPermiso', 'permiso.pmNombre', 'permiso.pmModulo')->get();              
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
         try {            
            $data = $request->all();        
            $perfil = new Perfil();            
            $perfil->Descripcion = $data["Descripcion"];
            $perfil->rEstado  = $data["rEstado"];            
            $perfil->save();                                          
            $permisos = $data["Permisos"];            
            foreach ($permisos as $p) {
                $insert = new PerfilPermiso();
                $insert->IdRol =$perfil->id;
                $insert->IdPermiso = $p['IdPermiso'];
                $insert->save();
            }
            
            return JsonResponse::create(array('message' => "Perfil Guardado Correctamente", "request" =>json_encode($perfil->id)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        try {            
            $data = $request->all();            
            $perfil = Perfil::find($id);            
            $perfil->rEstado  = 'ACTIVO';
            $perfil->save();            
            PerfilPermiso::where('IdRol',$id)->delete();
            $permisos = $data["Permisos"];            
            foreach ($permisos as $p) {
                $insert = new PerfilPermiso();
                $insert->IdRol =$id;
                $insert->IdPermiso = $p['IdPermiso'];
                $insert->save();
            }
            
            
            return JsonResponse::create(array('message' => "Perfil Modificado Correctamente", "request" =>json_encode($id)), 200);
            
        }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id){
        try {             
            $perfil = Perfil::find($id);    
            $perfil->rEstado = 'INACTIVO';
            $perfil->save();
            PerfilPermiso::where('IdRol',$id)->delete();
            return JsonResponse::create(array('message' => "Perfil inactivado Correctamente", "request" =>json_encode($id)), 200);
       }catch (\Exception $exc) {
            return JsonResponse::create(array('file' => $exc->getFile(), "line"=> $exc->getLine(),  "message" =>json_encode($exc->getMessage())), 500);
        } 
    }
}

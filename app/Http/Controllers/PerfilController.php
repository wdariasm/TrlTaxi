<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Perfil;
use App\Permiso;
use App\PerfilPermiso;
use Illuminate\Http\JsonResponse;

class PerfilController extends Controller
{
    public function index()
    {
        return Perfil::orderBy('Descripcion', 'asc')->get();       
    }
    
    public function GetPerfilActivos()
    {
        return Perfil::where('Estado','ACTIVO')->orderBy('Descripcion', 'asc')->get();       
    }
    
    public function GetPermisos(){
        return Permiso::select('IdPermiso','pmNombre','pmModulo')
                ->where('pmEstado','ACTIVO')               
                ->orderBy('pmNombre', 'asc')->get();
    }
    
    public  function GetPermisosByPerfil($perfil){
        return PerfilPermiso::where('IdRol',$perfil)
                ->select("IdPermiso")
                ->get();
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
            $perfil->Estado  = $data["Estado"];            
            $perfil->save();                  
            $permisos = $data["permisos"];
            
            foreach ($permisos as $p) {
                $insert = new PerfilPermiso();
                $insert->IdRol =$perfil->id;
                $insert->IdPermiso = $p['IdPermiso'];
                $insert->save();
            }
            
            return JsonResponse::create(array('message' => "Perfil Guardado Correctamente", "request" =>json_encode($perfil->id)), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Perfil", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
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
            $perfil->Descripcion = $data["Descripcion"];
            $perfil->Estado  = $data["Estado"];
            $perfil->save();
            $permisos = $data["permisos"];
            PerfilPermiso::where('IdRol',$id)->delete();
            foreach ($permisos as $p) {
                $insert = new PerfilPermiso();
                $insert->IdRol =$perfil->id;
                $insert->IdPermiso = $p['IdPermiso'];
                $insert->save();
            }
            return JsonResponse::create(array('message' => "Perfil Modificado Correctamente", "request" =>json_encode($id)), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Modificar el Perfil", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
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
            $perfil->delete();
            return JsonResponse::create(array('message' => "Perfil Eliminado Correctamente", "request" =>json_encode($id)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Campeonato", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }
}

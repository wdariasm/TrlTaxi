<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Usuario;
use Illuminate\Http\JsonResponse;
use DB;

 
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
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
            $usuario= new Usuario();

            $usuario->IdUsuario = $data["IdUsuario"];
            $usuario->Login = $data["Login"];
            $usuario->Clave = sha1($data["clave"]);
            $usuario->Nombre = $data["Nombre"];
            $usuario->Estado = $data["Estado"];
            $usuario->Modulo = $data["Modulo"];
            $usuario->Sesion = 'CERRADA';
            $usuario->FechaCnx = $data["FechaCnx"];
            $usuario->DirIp = $data["DirIp"];
            $usuario->ClienteId = $data["ClienteId"];
            $usuario->PersonaId = $data["PersonaId"];
            $usuario->ConductorId = $data["ConductorId"];
            $usuario->TipoAcceso =  $data["TipoAcceso"];
            $usuario->save();

            return JsonResponse::create(array('message' => "Guardado correctamente", "request" =>json_encode($usuario->IdUsuario)), 200);
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar", "request" =>json_encode($exc)), 401);
        }
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
        return Usuario::where("IdUsuario",$user)->select("IdUsuario")->first();
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

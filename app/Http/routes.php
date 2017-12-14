<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => 'cors'], function () {    
    Route::get('api/transfert/excel','TransfertController@plantillaExcel');
    Route::post('api/usuario/autenticar', 'UsuarioController@autenticar');
    Route::post('api/login/conductor', 'UsuarioController@autenticarConductor');    
    Route::get('api/usuario/{id}/{key}/confirmar','UsuarioController@ConfirmarCuenta');
    Route::get('api/usuario/{id}/recuperar/{idKey}/{key}','UsuarioController@VefiricarKey');
    Route::post('api/usuario/recordar', 'UsuarioController@RecuperarClave');
    Route::put('api/usuario/actualizar/{idUsuario}','UsuarioController@updatePassword');
    Route::get('api/usuario/token','UsuarioController@refreshToken');
    Route::get('api/servicio/{id}/calificacion','ServicioController@getCalificacion');
    Route::put('api/servicio/calificar/{id}','ServicioController@calificar');    
    Route::put('api/gps/posicion/{imei}','GpsController@setPosicion');    
    
    Route::group(['middleware' => 'jwt.auth'], function () {                 
        include 'Routes/routesMarca.php';
        include 'Routes/routesTipoVehiculo.php';
        include 'Routes/routesServicio.php';
        include 'Routes/routesConductor.php';
        include 'Routes/routesVehiculo.php';
        include 'Routes/routesEscolaridad.php';
        include 'Routes/routesTipoDocumento.php';
        include 'Routes/routesCliente.php';
        include 'Routes/routesUsuario.php';
        include 'Routes/routesNovedad.php';
        include 'Routes/routesLicencia.php';
        include 'Routes/routesPersona.php';
        include 'Routes/routesPerfil.php';
        include 'Routes/routesDisponibilidad.php';
        include 'Routes/routesZona.php';
        include 'Routes/routesDepartamento.php';
        include 'Routes/routesRuta.php';
        include 'Routes/routesTransfert.php';
        include 'Routes/routesBanco.php';
        include 'Routes/routesFranquicia.php';
        include 'Routes/routesTipoMantenimiento.php';
        include 'Routes/routesTipoServicio.php';
        include 'Routes/routesContrato.php';
        include 'Routes/routesEncuesta.php';
        include 'Routes/routesTraslado.php';
        include 'Routes/PlantillaRoutes.php';
        include 'Routes/routesMantenimiento.php';
        include 'Routes/routesDetalleMantenimiento.php';
        include 'Routes/routesParametro.php';
        include 'Routes/routesReporte.php';
        include 'Routes/routesPdfContrato.php';
        include 'Routes/MotivoRoutes.php';
        include 'Routes/soporteRoutes.php';
        include 'Routes/GpsRoutes.php';
        
        Route::resource("api/parada","ParadaController");
        Route::resource("api/detalle","DetalleServicioController");
        Route::resource("api/contacto","ContactoController");
    });
});
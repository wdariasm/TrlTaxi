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

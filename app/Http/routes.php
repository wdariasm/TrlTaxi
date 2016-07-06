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

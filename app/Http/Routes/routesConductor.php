<?php
Route::resource("api/conductor","ConductorController");
Route::put('api/conductor/updateEstado/{IdConductor}','ConductorController@updateEstado');
Route::putNovedad('api/conductor/novedad/{IdConductor}','ConductorController@guardarNovedad');
Route::postNovedad ('api/conductor/novedad/{IdConductor}','ConductorController@guardarNovedad');
Route::get('api/conductor/{Cedula}/validar','ConductorController@validarIdentificacion'); 
Route::get('api/conductor/{IdConductor}/novedades','ConductorController@GetNovedadByConductor');





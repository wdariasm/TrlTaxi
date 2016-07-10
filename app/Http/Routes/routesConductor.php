<?php
 Route::resource("api/conductor","ConductorController");
Route::put('api/conductor/updateEstado/{IdConductor}','ConductorController@updateEstado');
Route::get('api/conductor/{Cedula}/validar','ConductorController@validarIdentificacion');    





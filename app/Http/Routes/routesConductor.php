<?php
Route::resource("api/conductor","ConductorController");
Route::put('api/conductor/updateEstado/{IdConductor}','ConductorController@updateEstado');

Route::put('api/conductor/novedad/{nvCodigo}','ConductorController@updateNovedad');
Route::post('api/conductor/novedad','ConductorController@GuardarNovedad');

Route::put('api/conductor/licenciaConduccion/{IdLicencia}','LicenciaConduccionController@update');
Route::post('api/conductor/licenciaConduccion','LicenciaConduccionController@store');

Route::get('api/conductor/{Cedula}/validar','ConductorController@validarIdentificacion'); 
Route::get('api/conductor/{IdConductor}/novedades','ConductorController@GetNovedadByConductor');

Route::get('api/conductor/{IdConductor}/licencias','LicenciaConduccionController@GetLicencia'); 




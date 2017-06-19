<?php
Route::resource("api/disponibilidad","DisponibilidadController");
Route::put('api/disponibilidad/updateEstado/{dpCodigo}','DisponibilidadController@updateEstado');
//Route::get('api/disponibilidad/{esCodigo}/validar','DisponibilidadController@validarCodigo');

 /* Obtener tarifas disponibilidad por id de plantilla */
 Route::get('api/plantilla/{idPlantilla}/disponibilidad','DisponibilidadController@getByPlanitlla');
 
 /* Obtener valor de disponibilidad */
 Route::get('api/disponibilidad/plantilla/{idPlantilla}/tipo/{tipoVehiculo}','DisponibilidadController@getDisponiblidad');


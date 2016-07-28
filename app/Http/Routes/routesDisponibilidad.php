<?php
Route::resource("api/disponibilidad","DisponibilidadController");
Route::put('api/disponibilidad/updateEstado/{dpCodigo}','DisponibilidadController@updateEstado');
//Route::get('api/disponibilidad/{esCodigo}/validar','DisponibilidadController@validarCodigo');



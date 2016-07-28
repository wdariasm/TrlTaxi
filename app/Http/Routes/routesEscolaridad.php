<?php
Route::resource("api/escolaridad","EscolaridadController");
Route::put('api/escolaridad/updateEstado/{esCodigo}','EscolaridadController@updateEstado');
Route::get('api/escolaridad/{esCodigo}/validar','EscolaridadController@validarCodigo');



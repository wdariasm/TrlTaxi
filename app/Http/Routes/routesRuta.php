<?php
Route::resource("api/ruta","RutaController");
Route::put('api/ruta/updateEstado/{rtCodigo}','RutaController@updateEstado');



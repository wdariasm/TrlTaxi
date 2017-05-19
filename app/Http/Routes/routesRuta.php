<?php
Route::resource("api/ruta","RutaController");
Route::put('api/ruta/updateEstado/{rtCodigo}','RutaController@updateEstado');

/* Obtener tarifas ruta por id de plantilla */
    Route::get('api/plantilla/{idPlantilla}/ruta','RutaController@getByPlanitlla');



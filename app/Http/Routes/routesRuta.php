<?php
Route::resource("api/ruta","RutaController");
Route::put('api/ruta/updateEstado/{rtCodigo}','RutaController@updateEstado');

/* Obtener plantillas transfer por id de plantilla */
    Route::get('api/plantilla/{idPlantilla}/ruta','RutaController@getByPlanitlla');



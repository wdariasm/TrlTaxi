<?php

 Route::resource("api/traslado","TrasladoController");
 Route::put('api/traslado/updateEstado/{tlCodigo}','TrasladoController@updateEstado');

 /* Obtener tarifas traslado por id de plantilla */
    Route::get('api/plantilla/{idPlantilla}/traslado','TrasladoController@getByPlanitlla');
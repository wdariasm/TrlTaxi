<?php

    Route::resource("api/plantilla","PlantillaController");    
    Route::get('api/tiposervicio/{id}/plantilla','PlantillaController@getPlantillaporTipo'); 
    Route::get('api/plantilla/{id}/tiposervicio/{tipo}/tipovehiculo','PlantillaController@getTiposVehiculo'); 
    
    /* Eliminar datos de una plantilla */
    Route::post('api/plantilla/borrar','PlantillaController@borrarDatos');

    /* Obtener valor de paradas */
    Route::get('api/plantilla/{id}/parada','PlantillaController@getValoresParada');

    /*Cargue de plantillas por archivo*/
    Route::post('api/plantilla/cargue','PlantillaController@cargueArchivo');
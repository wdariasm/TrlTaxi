<?php

    Route::resource("api/plantilla","PlantillaController");    
    Route::get('api/tiposervicio/{id}/plantilla','PlantillaController@getPlantillaporTipo'); 

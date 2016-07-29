<?php
    Route::get('api/zona/turno','ZonaController@getZonaTurno');
    Route::get('api/zonas','ZonaController@getZonaNombre');
    Route::resource("api/zona","ZonaController");
    Route::put('api/zona/updateEstado/{id}','ZonaController@updateEstado');
    
    //Gestion de puntos por zona
    Route::get('api/zona/{id}/puntos','ZonaController@getPuntos');
    
    Route::get('api/zona/{id}/taxis','ZonaController@getNumTaxi');
    
    Route::get('api/zona/{id}/taxistas','ZonaController@getTaxistasByZona');



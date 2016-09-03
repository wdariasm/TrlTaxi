<?php
    
    Route::get('api/zonas','ZonaController@getZonaNombre');
    Route::resource("api/zona","ZonaController");
    Route::put('api/zona/updateEstado/{id}','ZonaController@updateEstado');
    
    //Gestion de puntos por zona
    Route::get('api/zona/{id}/puntos','ZonaController@getPuntos');
    
    Route::get('api/zona/{latitud}/{longitud}','CalcularZonaController@getZonaByPunto');
                



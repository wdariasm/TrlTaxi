<?php

    Route::resource("api/gps","GpsController");  
    
    Route::get('api/localizacion/{placa}/{estado}','GpsController@localizacion');


<?php
    
    Route::get('api/tiposervicios','TipoServicioController@getActivos');
    Route::resource("api/tiposervicio","TipoServicioController");
    Route::put('api/tiposervicio/updateEstado/{svCodigo}','TipoServicioController@updateEstado');

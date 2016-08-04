<?php

    Route::resource("api/tiposervicio","TipoServicioController");
    Route::put('api/tiposervicio/updateEstado/{svCodigo}','TipoServicioController@updateEstado');

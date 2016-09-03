<?php
    Route::resource("api/servicio","ServicioController");
    Route::put('api/servicio/updateEstado/{svCodigo}','ServicioController@updateEstado');

     //Obtener servicios de un cliente //
    Route::get('api/cliente/{id}/servicios/{rol}/{usuario}','ServicioController@getServicioCliente');
<?php
    Route::resource("api/servicio","ServicioController");
    Route::put('api/servicio/updateEstado/{svCodigo}','ServicioController@updateEstado');

     //Obtener servicios de un cliente //
    Route::get('api/cliente/{id}/servicios/{rol}/{usuario}','ServicioController@getServicioCliente');
    
     //Obtener servicios de un conductor //
    Route::get('api/conductor/{id}/servicios/{estado}','ServicioController@getServicioConductor');
    
    //Conductores libres para asignar servcio//
    Route::get('api/servicio/tipo/{id}/conductores','ServicioController@getConductores');
    
    /* Asignar servicio*/
    Route::post('api/servicio/asignar','ServicioController@asignar');
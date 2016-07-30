<?php
    Route::get('api/departamento/procesar','DepartamentoController@ProcesarMunicipio'); 
    Route::resource("api/departamento","DepartamentoController");    
    Route::get('api/departamento/{id}/municipios','DepartamentoController@getMunicipios');

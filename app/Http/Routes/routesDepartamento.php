<?php
    Route::get('api/departamento/procesar','DepartamentoController@ProcesarMunicipio'); 
    Route::resource("api/departamento","DepartamentoController");    

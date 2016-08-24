<?php

    Route::resource("api/contrato","ContratoController");    
    Route::get('api/contrato/{numero}/tiposervicio','ContratoController@getPorNumeroContrato');    
    Route::get('api/tipoContrato','ContratoController@tipoContrato');

    //Obtener contratod de un cliente //
    Route::get('api/cliente/{id}/contratos','ContratoController@getContratoByCliente');
<?php

    Route::resource("api/contrato","ContratoController");
    Route::put('api/contrato/updateEstado/{IdCliente}','ContratoController@hoa');
    Route::get('api/tipoContrato','ContratoController@tipoContrato');


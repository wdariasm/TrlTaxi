<?php

    Route::resource("api/contrato","ContratoController");    
    Route::get('api/tipoContrato','ContratoController@tipoContrato');


<?php
    Route::get('api/transferts','TransfertController@GetTarifasActivas');
    Route::resource("api/transfert","TransfertController");
    Route::put('api/transfert/updateEstado/{codigo}','TransfertController@updateEstado');


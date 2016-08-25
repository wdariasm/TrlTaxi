<?php
    Route::get('api/transferts','TransfertController@GetTarifasActivas');
    Route::resource("api/transfert","TransfertController");
    Route::put('api/transfert/updateEstado/{codigo}','TransfertController@updateEstado');
    
    Route::get('api/transfert/{plantilla}/{tipo}/{origen}/{destino}','TransfertController@getPrecioTransfert');

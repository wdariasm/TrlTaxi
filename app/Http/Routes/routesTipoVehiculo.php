<?php
Route::resource("api/tipoVehiculo","TipoVehiculoController");
    Route::put('api/tipoVehiculo/updateEstado/{tvCodigo}','TipoVehiculoController@updateEstado');



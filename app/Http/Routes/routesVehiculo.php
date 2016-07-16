<?php
    
    Route::get('api/vehiculo/{placa}/validar','VehiculoController@ValidarPlaca');
    Route::get('api/vehiculo/{id}/novedades','NovedadController@GetNovedadByVehiculo');
    Route::put('api/vehiculo/updateEstado/{placa}','VehiculoController@UpdateEstado');
    Route::resource("api/vehiculo","VehiculoController");

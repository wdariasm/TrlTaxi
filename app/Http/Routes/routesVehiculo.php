<?php
    Route::get('api/vehiculo/{id}/novedades','NovedadController@GetNovedadByVehiculo');
    Route::resource("api/vehiculo","VehiculoController");

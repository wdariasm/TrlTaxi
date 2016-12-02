<?php
    
    Route::get('api/vehiculo/{placa}/validar','VehiculoController@ValidarPlaca');
    Route::get('api/vehiculo/{id}/novedades','NovedadController@GetNovedadByVehiculo');
    
    Route::get('api/vehiculo/{id}/documentos','DocumentoController@getDocumento');
    
    Route::get('api/vehiculo/{placa}/gps','VehiculoController@getGpsVehiculo');
    
    Route::put('api/vehiculo/updateEstado/{placa}','VehiculoController@UpdateEstado');
    Route::resource("api/vehiculo","VehiculoController");
    
    /* adjuntar documento al vehiculo */
    Route::post('api/vehiculo/documento','DocumentoController@store');
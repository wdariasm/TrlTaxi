<?php

Route::resource("api/mantenimiento","MantenimientoController");
Route::get('api/mantenimiento/{detCodigo}/detalle','MantenimientoController@detallePorId');
Route::put('api/mantenimiento/detalle/{detCodigo}','MantenimientoController@updateDetalle');


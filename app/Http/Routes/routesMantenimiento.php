<?php

Route::resource("api/mantenimiento","MantenimientoController");

Route::put('api/conductor/detalleMantenimiento/{detCodigo}','MantenimientoController@updateDetalle');


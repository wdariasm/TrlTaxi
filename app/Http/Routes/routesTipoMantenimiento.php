<?php
Route::resource("api/tipoMantenimiento","TipoMantenimientoController");
Route::put('api/tipoMantenimiento/updateEstado/{tvCodigo}','TipoMantenimientoController@updateEstado');



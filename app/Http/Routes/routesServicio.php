<?php
 Route::resource("api/servicio","ServicioController");
     Route::put('api/servicio/updateEstado/{svCodigo}','ServicioController@updateEstado');


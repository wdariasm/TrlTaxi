<?php

 Route::resource("api/traslado","TrasladoController");
 Route::put('api/traslado/updateEstado/{tlCodigo}','TrasladoController@updateEstado');


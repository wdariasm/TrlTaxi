<?php

Route::resource("api/escolaridad","EscolaridadController");
Route::put('api/escolaridad/updateEstado/{maCodigo}','EscolaridadController@updateEstado');



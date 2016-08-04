<?php

Route::resource("api/encuesta","EncuestaController");
Route::put('api/encuesta/updateEstado/{ecCodigo}','EncuestaController@updateEstado');

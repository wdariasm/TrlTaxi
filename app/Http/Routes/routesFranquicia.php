<?php

 Route::resource("api/franquicia","FranquiciaController");
 Route::put('api/franquicia/updateEstado/{frCodigo}','FranquiciaController@updateEstado');


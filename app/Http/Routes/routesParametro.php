<?php

// Route::get("api/parametro/contador","ParametroController@getNumRegistros");
   Route::resource("api/parametro","ParametroController");

   Route::post("api/soporte/error", "ParametroController@error");

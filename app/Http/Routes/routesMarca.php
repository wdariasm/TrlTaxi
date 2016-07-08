<?php
    Route::resource("api/marca","MarcaController");
    Route::put('api/marca/updateEstado/{maCodigo}','MarcaController@updateEstado');


<?php

    Route::resource("api/usuario","UsuarioController");
    Route::get('api/usuario/{user}/validar','UsuarioController@validar');
    Route::post('api/usuario/autenticar', 'UsuarioController@autenticar');


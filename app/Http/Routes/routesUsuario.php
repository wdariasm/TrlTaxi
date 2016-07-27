<?php

    Route::resource("api/usuario","UsuarioController");
    Route::get('api/usuario/{user}/validar','UsuarioController@validar');
    Route::post('api/usuario/autenticar', 'UsuarioController@autenticar');
    Route::get('api/usuario/{id}/{key}/confirmar','UsuarioController@ConfirmarCuenta');
    Route::get('api/usuario/{id}/recuperar/{idKey}/{key}','UsuarioController@VefiricarKey');       
    Route::put('api/usuario/actualizar/{idUsuario}','UsuarioController@updatePassword');
    Route::post('api/usuario/recordar', 'UsuarioController@RecuperarClave');
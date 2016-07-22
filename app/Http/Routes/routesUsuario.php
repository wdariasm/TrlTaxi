<?php

    Route::resource("api/usuario","UsuarioController");
    Route::get('api/usuario/{user}/validar','UsuarioController@validar');
    Route::post('api/usuario/autenticar', 'UsuarioController@autenticar');
    Route::get('api/usuario/{id}/{key}/confirmar','UsuarioController@ConfirmarCuenta');
    Route::get('api/usuario/{id}/recuperar/{idKey}/{key}','UsuarioController@VefiricarKey');   
    //Route::put('api/usuario/actualizar/{id}','UsuarioController@UpdatePassword');
    Route::put('api/usuario/updatePassword/{IdUsuario}','UsuarioController@updatePassword');
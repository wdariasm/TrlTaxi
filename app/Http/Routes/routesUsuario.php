<?php
    
    Route::resource("api/usuario","UsuarioController");    
    Route::get('api/usuario/{user}/validar','UsuarioController@validar');    
    
    
    Route::delete('api/usuario/{id}/cerrar','UsuarioController@cerrarSesion');
    
    Route::get('api/usuario/{id}/permisos','UsuarioController@GetPermisos');
    
    /* Cambiar contraseña desde el administrador */
    Route::post('api/usuario/cambiar','UsuarioController@cambiarClave');
    
    /*usuarios por cliente*/
    Route::get('api/cliente/{id}/usuarios','UsuarioController@getUserByCliente');
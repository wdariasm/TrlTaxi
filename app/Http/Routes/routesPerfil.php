<?php 
    Route::get('api/permisos','PerfilController@GetPermisos');    
    Route::get('api/perfil/{id}/permisos','PerfilController@GetPermisosByPerfil');
    Route::get('api/perfil/estado','PerfilController@GetPerfilActivos');
    Route::resource('api/perfil', 'PerfilController');

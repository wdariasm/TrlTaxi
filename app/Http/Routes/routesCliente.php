<?php
 Route::resource("api/cliente","ClienteController");
 Route::put('api/cliente/updateEstado/{IdCliente}','ClienteController@updateEstado');
 Route::get('api/cliente/{Identificacion}/validar','ClienteController@validarIdentificacion'); 

 /* Key de notificacion  */
 Route::put('api/cliente/{id}/key','ClienteController@updateKey');


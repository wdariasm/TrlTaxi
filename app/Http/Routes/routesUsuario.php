<?php

Route::resource("api/usuario","UsuarioController");
Route::get('api/usuario/{user}/validar','UsuarioController@validar');



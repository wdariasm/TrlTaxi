<?php
 Route::resource("api/cliente","ClienteController");
 Route::put('api/cliente/updateEstado/{IdCliente}','ClienteController@updateEstado');



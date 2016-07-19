<?php
Route::resource("api/licenciaConduccion","LicenciaConduccionController");
Route::get('api/licenciaConduccion/{Numero}/validar','LicenciaConduccionController@validarNumero');

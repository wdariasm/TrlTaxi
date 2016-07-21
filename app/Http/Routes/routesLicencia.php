<?php
Route::resource("api/licenciaConduccion","LicenciaConduccionController");
Route::get('api/licenciaConduccion/{Numero}/validar','LicenciaConduccionController@validarNumero');
Route::put('api/licenciaConduccion/updateEstado/{IdLicencia}','LicenciaConduccionController@updateEstado');

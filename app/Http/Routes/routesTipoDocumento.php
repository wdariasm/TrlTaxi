<?php

Route::resource("api/tipoDocumento","TipoDocumentoController");

Route::put('api/tipoDocumento/updateEstado/{tdCodigo}','TipoDocumentoController@updateEstado');


<?php

    Route::resource("api/persona","PersonaController");
    Route::get('api/persona/{user}/validar','PersonaController@validarIdentificacion');


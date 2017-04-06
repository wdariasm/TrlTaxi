<?php
    
    Route::get("api/reporte","ReporteController@GenerarPDF");

    /* Reporte administrador */
    Route::post('api/reporte/admin','ReporteController@reporteAdminitrador');
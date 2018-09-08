<?php

    Route::get('api/reporte/admin/descarga/{buscarPorFecha}/{tipoServicio}'
            ,'ReporteController@descargarReporteAdmin');
    
    Route::get("api/reporte","ReporteController@GenerarPDF");

    /* Reporte administrador */
    Route::post('api/reporte/admin','ReporteController@reporteAdminitrador');
    
     /* Reporte cliente */
    Route::post('api/reporte/cliente','ReporteController@reporteCliente');
    
    /* Reporte centro de costo */
    Route::post('api/reporte/centrocosto','ReporteController@reporteCentroCosto');
    
    /* Reporte conductor */
    Route::post('api/reporte/conductor','ReporteController@reporteConductor');
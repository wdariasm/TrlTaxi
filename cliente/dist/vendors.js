app.service("contratoService",["$http",function(o){this.get=function(e){var i=o.get(uri+"/api/contrato/"+e);return i},this.getPorNumeroCto=function(e){var i=o.get(uri+"/api/contrato/"+e+"/tiposervicio");return i},this.getByCliente=function(e){var i=o.get(uri+"/api/cliente/"+e+"/contratos");return i},this.getTipoVehiculo=function(e){var i=o.get(uri+"/api/plantilla/"+e+"/tipovehiculo");return i},this.getTransfert=function(e,i,r,t){var n=o.get(uri+"/api/transfert/"+e+"/"+i+"/"+r+"/"+t);return n}}]),app.service("servicioService",["$http",function(o){this.post=function(e){var i=o.post(uri+"/api/servicio",e);return i}}]),app.service("usuarioService",["$http",function(o){this.get=function(e){var i=o.get(uri+"/api/usuario/"+e);return i},this.put=function(e,i){var r=o.put(uri+"/api/usuario/"+e,i);return r},this.udpatePass=function(e,i){var r=o.put(uri+"/api/usuario/updatePassword/"+e,i);return r},this.cerrarSesion=function(e){var i=o.delete(uri+"/api/usuario/"+e+"/cerrar");return i}}]),app.service("zonaService",["$http",function(o){this.get=function(e){var i=o.get(uri+"/api/zona/"+e);return i},this.getPuntos=function(e){var i=o.get(uri+"/api/zona/"+e+"/puntos");return i},this.getZona=function(e,i){var r=o.get(uri+"/api/zona/"+e+"/"+i);return r}}]),app.controller("homeController",["$scope",function(o){function e(){o.Login=session.getUser()}o.Titulo="BIENVENIDOS",o.Login={};var i=1;o.mostrarOcultarMenu=function(){if(1===i){document.getElementById("cont-menu").className="menuLeft";var o=document.getElementById("contenido");o.classList.remove("contenido-normal"),o.classList.add("contenido-expandido"),i+=1}else{var o=document.getElementById("contenido");o.classList.remove("contenido-expandido"),o.classList.add("contenido-normal"),document.getElementById("cont-menu").className="menuRight",i=1}},o.SetTitulo=function(e){o.Titulo=e},e()}]),app.controller("salirController",["$scope","usuarioService","toaster",function(o,e,i){function r(){var r=e.cerrarSesion(o.$parent.Login.IdUsuario);r.then(function(e){sessionStorage.setItem("usuario",""),sessionStorage.removeItem("usuario"),o.mensaje="Su sesión ha finalizado correctamente",i.pop("success","¡Información!","Su sesión ha terminado."),setTimeout('location.href = "../inicio/index.html#/login"',3e3)},function(o){i.pop("error","¡Error!",o.data.request),console.log("failure loading usuarios",o)})}o.$parent.SetTitulo("CERRANDO SESIÓN"),o.mensaje="Cerrando sesión ....",r()}]),app.controller("serviciosController",["$scope","zonaService","ngTableParams","toaster","contratoService","funcionService","servicioService",function(o,e,i,r,t,n,a){function c(){this.coordenadas=null,this.marcador=null}function s(){o.Contrato={TipoServicio:[],Plantilla:[],TipoVehiculo:[],FechaInicio:"",FechaFin:"",Estado:"",Nombre:"",FormaPago:[]},o.Servicio={DireccionOrigen:"",DireccionDestino:"",ContratoId:0,NumeroContrato:"",Nit:"",Telefono:"",Tipo:{},Responsable:"",FechaServicio:"",Hora:"",Valor:0,NumHoras:"0",NumPasajeros:"0",ClienteId:o.$parent.Login.ClienteId,ZonaOrigen:"",ZonaDestino:"",LatOrigen:"",LngOrigen:"",LatDestino:"",LngDestino:"",UserReg:o.$parent.Login.Login}}function l(){var e=document.getElementById("txtOrigen");o.AutocompleteOrigen=new google.maps.places.Autocomplete(e,O),o.AutocompleteOrigen.bindTo("bounds",o.mapServicio),o.AutocompleteOrigen.addListener("place_changed",function(){P.close(),o.markerOrigen.setVisible(!1);var e=o.AutocompleteOrigen.getPlace();if(!e.geometry)return void r.pop("error","¡Error!","No pudo resolver la  posición");v(o.mapServicio,e),o.markerOrigen.setIcon("images/origen.png"),o.markerOrigen.setPosition(e.geometry.location),o.markerOrigen.setVisible(!0),o.popup||(o.popup=new google.maps.InfoWindow),o.Servicio.LatOrigen=e.geometry.location.lat(),o.Servicio.LngOrigen=e.geometry.location.lng(),m(o.Servicio.LatOrigen,o.Servicio.LngOrigen,"ZonaOrigen"),o.Servicio.DireccionOrigen=e.formatted_address;var i="";e.address_components&&(i=[e.address_components[0]&&e.address_components[0].short_name||"",e.address_components[1]&&e.address_components[1].short_name||"",e.address_components[2]&&e.address_components[2].short_name||""].join(" ")),P.setContent("<div><strong>"+e.name+"</strong><br>"+i),P.open(o.mapServicio,o.markerOrigen),I=e.place_id,g(I,T,E,y,N)})}function p(){var e=document.getElementById("txtDestino");o.AutocompleteDestino=new google.maps.places.Autocomplete(e,O),o.AutocompleteDestino.bindTo("bounds",o.mapServicio),o.AutocompleteDestino.addListener("place_changed",function(){P.close(),h.setVisible(!1);var e=o.AutocompleteDestino.getPlace();if(!e.geometry)return void r.pop("error","¡Error!","No pudo resolver la  posición");v(o.mapServicio,e),h.setIcon("images/destino.png"),h.setPosition(e.geometry.location),h.setVisible(!0),o.popup||(o.popup=new google.maps.InfoWindow),o.Servicio.LatDestino=e.geometry.location.lat(),o.Servicio.LngDestino=e.geometry.location.lng(),m(o.Servicio.LatDestino,o.Servicio.LngDestino,"ZonaDestino"),o.Servicio.DireccionDestino=e.formatted_address;var i="";e.address_components&&(i=[e.address_components[0]&&e.address_components[0].short_name||"",e.address_components[1]&&e.address_components[1].short_name||"",e.address_components[2]&&e.address_components[2].short_name||""].join(" ")),P.setContent("<div><strong>"+e.name+"</strong><br>"+i),P.open(o.mapServicio,h),T=e.place_id,g(I,T,E,y,N)})}function u(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(e){var i={lat:e.coords.latitude,lng:e.coords.longitude};o.Posicion.Latitud=e.coords.latitude,o.Posicion.Longitud=e.coords.longitude;var r=new google.maps.Circle({center:i,radius:e.coords.accuracy});o.AutocompleteOrigen.setBounds(r.getBounds())})}function d(){var e={zoom:16,center:new google.maps.LatLng(o.Posicion.Latitud,o.Posicion.Longitud),mapTypeId:google.maps.MapTypeId.ROADMAP};o.mapServicio=new google.maps.Map(document.getElementById("dvMapaServicio"),e),N.setMap(o.mapServicio),google.maps.event.addListener(o.mapServicio,"click",function(e){var i=e.latLng.lat(),r=e.latLng.lng(),t=new google.maps.LatLng(i,r),n=new google.maps.Marker({position:t,map:o.mapServicio,animation:google.maps.Animation.DROP,title:"Marcador"}),a=new c;a.coordenadas=t,a.marcador=n,o.vecPoligono.push(a),f()}),o.markerOrigen=new google.maps.Marker({map:o.mapServicio}),h=new google.maps.Marker({map:o.mapServicio})}function g(o,e,i,t,n){o&&e&&t.route({origin:{placeId:o},destination:{placeId:e},travelMode:i},function(o,e){e===google.maps.DirectionsStatus.OK?n.setDirections(o):r.pop("error","¡Error!","Error al resolver dirección")})}function v(o,e){e.geometry.viewport?o.fitBounds(e.geometry.viewport):(o.setCenter(e.geometry.location),o.setZoom(17))}function m(i,t,n){var a=e.getZona(i,t);a.then(function(e){return e.data.length>0?void(o.Servicio[n]=e.data[0].znCodigo):(o.Servicio[n]="",void r.pop("error","No se encontro la zona"))},function(o){r.pop("error","¡Error!","Error al buscar zona ",0),console.log("Some Error Occured "+JSON.stringify(o))})}function S(){if(!o.TipoSelect.tvCodigo)return void r.pop("info","¡Alerta!","Seleccione el tipo de vehículo");if(""===o.Servicio.ZonaOrigen)return void r.pop("info","¡Alerta!","Por favor ingrese la dirección de origen correctamente");if(""===o.Servicio.ZonaDestino)return void r.pop("info","¡Alerta!","Por favor ingrese la dirección de destino correctamente");o.Servicio.Valor=0;var e=t.getTransfert(o.Plantilla.plCodigo,o.TipoSelect.tvCodigo,o.Servicio.ZonaOrigen,o.Servicio.ZonaDestino);e.then(function(e){e.data?(o.Servicio.Valor=e.data.tfValor,o.Servicio.Codigo=e.data.tfCodigo):r.pop("info","¡Alerta!","Estimado Usuario(a), no se encontró el precio con estos parametros de ubicación y tipo de vehículo",0)},function(o){r.pop("error","¡Error!","Error al buscar precios ",0),console.log("Some Error Occured "+JSON.stringify(o))})}function f(){for(var e=[],i=0;i<o.vecPoligono.length;i++)e.push(o.vecPoligono[i].coordenadas);null!==o.poly&&o.poly.setMap(null),o.poly=new google.maps.Polygon({paths:e,strokeColor:"#FF0000",strokeOpacity:.8,strokeWeight:2,fillColor:"#FF0000",fillOpacity:.25}),o.poly.setMap(o.mapServicio)}function C(e){var i=t.getTipoVehiculo(e);i.then(function(e){o.Contrato.TipoVehiculo=e.data},function(o){r.pop("error","¡Error!","Error al cargar tipos de vehículo",0),console.log("Some Error Occured "+JSON.stringify(o))})}o.Zonas=[],o.Zona={},o.Contrato={},o.Contratos=[],o.ContratoSelect={},o.Boton={Cargando:!0},o.$parent.SetTitulo("SOLICITAR SERVICIOS"),o.Servicio={},o.TipoSelect={},o.Plantilla={},o.Puntos=[],o.editMode=!1,o.mapServicio,o.markerOrigen=null;var h=null,P=new google.maps.InfoWindow,O={componentRestrictions:{country:"co"}},I=null,T=null,E=google.maps.TravelMode.DRIVING,y=new google.maps.DirectionsService,N=new google.maps.DirectionsRenderer;o.vecPoligono=new Array,o.poly=null,o.tbZona={},o.title="Nuevo Servicio",o.Posicion={Latitud:10.4370725,Longitud:-75.524795},o.$parent.SetTitulo("GESTIÓN DE SERVICIOS"),o.AutocompleteOrigen=null,o.AutocompleteDestino=null,u(),d(),l(),p(),s(),o.eliminarUltimoPunto=function(){o.vecPoligono.length>0&&(o.vecPoligono[o.vecPoligono.length-1].marcador.setMap(null),o.vecPoligono.pop(),f())},o.Nuevo=function(){o.editMode=!1,o.title="Nuevo Servicio",s()},o.get=function(e){o.editMode=!0,o.title="EDITAR ZONA",o.Zona=e,getPuntos(e.znCodigo)},o.BuscarContrato=function(e){o.Servicio.ContratoId=0;var i="";if("COMBO"===e)i=o.ContratoSelect.ctNumeroContrato;else{if(!o.Servicio.NumeroContrato)return void r.pop("info","Estimado usuario(a), por favor ingrese el número de contrato");i=o.Servicio.NumeroContrato}r.pop("wait","Consulta","Consultando informacioón....",0),o.Servicio.Tipo=[];var n=t.getPorNumeroCto(i);n.then(function(e){e.data?(r.clear(),o.Servicio.ContratoId=e.data.IdContrato,o.Contrato.Nombre=e.data.ctContratante,o.Servicio.Nit=e.data.ctNitCliente,o.Servicio.Telefono=e.data.ctTelefono,o.Servicio.NumeroContrato=e.data.ctNumeroContrato,o.Contrato.FormaPago=angular.copy(e.data.ctFormaPago),o.Contrato.FechaFin=new Date(e.data.ctFechaFinal).toLocaleDateString("en-GB"),o.Contrato.FechaInicio=new Date(e.data.ctFechaInicio).toLocaleDateString("en-GB"),o.Contrato.Estado=e.data.ctEstado,o.Contrato.TipoServicio=e.data.TipoServicio,o.Contrato.Plantilla=e.data.Plantilla,0===o.Contrato.TipoServicio&&r.pop("error","No se encontraón servicios asociados a este contrato",0),console.log(o.Contrato.FormaPago)):r.pop("error","Número de contrato no existe")},function(o){r.pop("error","¡Error!",o,0),console.log("Some Error Occured "+JSON.stringify(o))})},o.TipoServicioCheck=function(e){if(console.log(o.Servicio.Tipo),"SI"===o.Servicio.Tipo.csPlantilla){if(1===o.Servicio.Tipo.csTipoServicioId&&d(),o.titlePlantilla="Plantillas "+o.Servicio.Tipo.csDescripcion,0===o.Contrato.Plantilla.length)return void r.pop("error","¡Error!","No se definieron plantillas para este contrato");var i=n.arrayObjectIndexOf(o.Contrato.Plantilla,o.Servicio.Tipo.csTipoServicioId,"pcTipoServicio");i>=0&&(o.Plantilla=o.Contrato.Plantilla[i],C(o.Plantilla.plCodigo))}else o.titlePlantilla="Dispobilidad ",o.VerPlantilla=!1},o.ConsultarPrecio=function(){switch(o.Servicio.Tipo.csTipoServicioId){case 1:S();break;case 2:break;case 3:break;case 4:break;default:r.pop("error","¡Alerta!","Seleccione un tipo de servicio")}},o.GetContratos=function(){s();var e=t.getByCliente(o.Servicio.ClienteId);e.then(function(e){o.Contratos=e.data},function(o){r.pop("error","¡Error!","Error al cargar contratos"),console.log("Some Error Occured "+JSON.stringify(o))})},o.Guardar=function(){if(!o.Servicio.Tipo.csTipoServicioId)return void r.pop("info","¡Alerta!","Seleccione el tipo de servicio");if(!o.TipoSelect.tvCodigo)return void r.pop("info","¡Alerta!","Seleccione el tipo de vehículo");if(o.Servicio.NumPasajeros>o.TipoSelect.tvNumPasajero)return void r.pop("info","¡Alerta!","Estimado Usuario(a), el número de pasajeros supera el limite permitido para el tipo de vehículo seleccionado ("+o.TipoSelect.tvDescripcion+")",7e3);if(0===o.Servicio.Valor)return void r.pop("info","¡Alerta!","Valor del servicio no puede ser cero(0). Por favor hacer click en consultar precio");o.Servicio.TipoServicidoId=o.Servicio.Tipo.csTipoServicioId,o.Servicio.PlantillaId=o.Plantilla.plCodigo,o.Servicio.FormaPago="EFECTIVO";var e=a.post(o.Servicio);e.then(function(e){r.pop("success","¡Información!",e.data.message),o.Nuevo()},function(o){r.pop("error","¡Error!",o.data.request),console.log("Some Error Occured "+JSON.stringify(o))})},o.GetContratos()}]);
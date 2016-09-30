 function abrirModalError() {
    var width = window.screen.width;
    var height = window.screen.height;
    var canvas = document.querySelector("#canvasPan");
    canvas.width = width;
    canvas.height = height;
    html2canvas(document.querySelector("body"), { canvas: canvas }).then(function (canvas) {        
        var imgObj = new Image();
        imgObj.id = "pic";
        imgObj.src = canvas.toDataURL("image/png");
        var img = document.getElementById("imgCanvas");
        img.src = imgObj.src;
    });
    $("#modalError").modal("show");
}

function enviarImagen() {
    if ($("#txtAsuntoSoporte").val() == "" || $("#txtMensajeSoporte").val() == "") {
        $("#infoSoporte").html("Todos los campos son requeridos");
        $("#infoSoporte").css("color", "red");
    } else {
        $("#btnCapturar").prop( "disabled", true );
        $("#infoSoporte").html("Enviando...");
        $("#infoSoporte").css("color", "black");
        var img = document.getElementById("imgCanvas");
        var e = {};
        e.url = location.href;
        e.asunto = $("#txtAsuntoSoporte").val();
        e.mensaje = $("#txtMensajeSoporte").val();
        e.imagen = img.src;        
        e.nombre = session.getNombre();       
        e.error = session.getError();
        $.ajax({
            type: "POST",
            url: uri + "/api/soporte/error"  + "?token=" + sessionStorage.getItem("trl_token"),
            data:  JSON.stringify(e),
            async: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
          
            success: function (result) {
                console.log(result);
                $("#btnCapturar").prop("disabled", false);
                if (result.message === "Correcto") {
                    $("#infoSoporte").html("Su mensaje ha sido enviado correctamente");
                    $("#infoSoporte").css("color", "green");
                    $("#txtAsuntoSoporte").val("");
                    $("#txtMensajeSoporte").val("");
                    //$("#modalError").modal("hide");
                } else {
                    $("#infoSoporte").html(result.d.Mensaje);
                    $("#infoSoporte").css("color", "red");
                }
            },
            error: function () {
                $("#btnCapturar").prop("disabled", false);
            }
        });
    }
}


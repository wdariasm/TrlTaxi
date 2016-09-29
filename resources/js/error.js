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
        e.Url = location.href;
        e.Asunto = $("#txtAsuntoSoporte").val();
        e.Mensaje = $("#txtMensajeSoporte").val();
        e.Imagen = img.src;
        e.idRemitente = session.getNombre();
        e.nomRemitente = "";       
        
        $.ajax({
            type: "POST",
            url: "",
            data: "{'Reg':" + JSON.stringify(e) + "}",
            async: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $("#btnCapturar").prop("disabled", false);
                if (result.d.Error == false) {
                    $("#infoSoporte").html("Su mensaje ha sido enviado a soporte satisfactoriamente");
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


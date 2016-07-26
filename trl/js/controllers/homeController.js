app.controller("homeController", ["$scope", function ($scope) {
        
    $scope.Titulo = "BIENVENIDOS"; 
    $scope.Login = {};
        
    var click = 1;    
        
    $scope.mostrarOcultarMenu = function(){    
        if(click===1){               
//            var div  =  document.getElementById("sidebar");
//                div.classList.remove('open');   
                document.getElementById("cont-menu").className = "menuLeft";
            var div1  =  document.getElementById("contenido");
                div1.classList.remove('contenido-normal');   
                div1.classList.add('contenido-expandido');                
                click += 1;
        } else{                       
            var div1  =  document.getElementById("contenido");
                div1.classList.remove('contenido-expandido');   
                div1.classList.add('contenido-normal');
            
            document.getElementById("cont-menu").className = "menuRight";
            
            click = 1;
        }
    };
    
    //ESTABLECER TITULO PRINCIPAL
    $scope.SetTitulo = function (title){
        $scope.Titulo = title;
    };
    
    function validarUser (){        
        $scope.Login = session.getUser();                       
        console.log($scope.Login);
    }
    
    validarUser();
    
    
}]);


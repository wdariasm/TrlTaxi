var session = {
        
    setUsuario: function(usuario){      
       sessionStorage.setItem("usuario",usuario);       
    },
    
    /// Obtiene todos los Datos del Usuario
    getUsuario: function(){      
        return this.validarObjectLocal("usuario")? JSON.parse(sessionStorage.getItem("usuario")) :  null;       
    },
    
    validarObjectLocal: function(string){        
        return sessionStorage.getItem(string) !== "" && sessionStorage.getItem(string) !== undefined && sessionStorage.getItem(string) !== null;        
    },
    
    
    //Obtener Usuario
    getUser:function(){
        
        var obj = sessionStorage.getItem("usuario");          
        if (obj){            
            return JSON.parse(atob(obj));
        }else{            
            alert("Acceso Denegado, no tiene permisos para realizar esta operación");
            location.href = "../inicio/index.html#/login";
            return null;
        }   
    }               
};



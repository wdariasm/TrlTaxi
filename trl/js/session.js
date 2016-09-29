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
    },               
    
    getNombre:function(){        
        var obj = sessionStorage.getItem("usuario");          
        if (obj){                       
            var js = JSON.parse(atob(obj));
            return js.Login + " - " + js.Nombre;
        }
        
    }     
};

var config = {
    setConfig: function(config){      
       sessionStorage.setItem("trlconfig", config);       
    },
    
    /// Obtiene todos los Datos del Config
    getConfig: function(){      
        return this.validarObjectLocal("trlconfig")? JSON.parse(atob(sessionStorage.getItem("trlconfig"))) :  null;       
    },
    
    validarObjectLocal: function(string){        
        return sessionStorage.getItem(string) !== "" && sessionStorage.getItem(string) !== undefined && sessionStorage.getItem(string) !== null;        
    },
           
    
    //Obtener NOMBRE CLIENTE
    getLatitud:function(){        
        var cf = sessionStorage.getItem("trlconfig");        
        if (cf){   
            var obj  = JSON.parse(atob(cf));
            return obj.parLatitud;
        }  
    },         
    
    getLongitud: function(){               
        var cf = sessionStorage.getItem("trlconfig");        
        if (cf){   
            var obj  = JSON.parse(atob(cf));
            return obj.parLongitud;
        }                  
    }, 
   
    getEnviarEmail: function(){
        var cf = sessionStorage.getItem("trlconfig");        
        if (cf){   
            var obj  = JSON.parse(atob(cf));
            return obj.parEnviarEmail;
        }  
    },
    
    getEmail: function(){
        var cf = sessionStorage.getItem("trlconfig");        
        if (cf){   
            var obj  = JSON.parse(atob(cf));
            return obj.parEmail;
        }  
    }
};

var ruta = {
    setConfig: function(config){      
       sessionStorage.setItem("trlRuta", config);       
    },
    
    get:function(){        
        var cf = sessionStorage.getItem("trlRuta");        
        if (cf){   
            return atob(cf);           
        }  
    }
};



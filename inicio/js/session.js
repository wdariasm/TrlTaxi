var session = {
        
    setCliente: function(usuario){      
       sessionStorage.setItem("usuario",usuario);       
    },
    
    /// Obtiene todos los Datos del Cliente
    getCliente: function(){      
        return this.validarObjectLocal("usuario")? JSON.parse(sessionStorage.getItem("usuario")) :  null;       
    },
    
    validarObjectLocal: function(string){        
        return sessionStorage.getItem(string) !== "" && sessionStorage.getItem(string) !== undefined && sessionStorage.getItem(string) !== null;        
    },
    
    cerrarSesion: function(){
        sessionStorage.setItem("usuario","");
        sessionStorage.removeItem("usuario");        
        location.href = "../usuario/index.html#/login/usuario";
    }, 
    
    //Obtener Cliente
    getidCliente:function(){
        var obj = JSON.parse(sessionStorage.getItem("usuario"));          
        if (obj){            
            return obj.idCliente;
        }else{
            location.href = "../usuario/index.html#/login/usuario";
        }   
    }, 
    
    //Obtener NOMBRE CLIENTE
    getNombre:function(){
        var obj = JSON.parse(sessionStorage.getItem("usuario"));        
        if (obj){            
            return obj.Nombre;
        }
    },         
    
    getTelefono: function(){
        var obj = JSON.parse(sessionStorage.getItem("usuario"));        
        if (obj){            
            return obj.Telefono;
        }  
    },
    
    getGrupo: function(){
        var obj = JSON.parse(sessionStorage.getItem("usuario"));        
        if (obj){            
            return obj.idGrupo;
        }  
    },
           
    getDireccion: function(){
        var obj = JSON.parse(sessionStorage.getItem("usuario"));        
        if (obj){            
            return (obj.Direccion);
        }  
    },
    
    getEmail: function(){
        var obj = JSON.parse(sessionStorage.getItem("usuario"));        
        if (obj){            
            return (obj.Email);
        }  
    }
            
};



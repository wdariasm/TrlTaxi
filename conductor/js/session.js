var session = {
        
    setCliente: function(cliente){      
       sessionStorage.setItem("cliente",cliente);       
    },
    
    /// Obtiene todos los Datos del Cliente
    getCliente: function(){      
        return this.validarObjectLocal("cliente")? JSON.parse(sessionStorage.getItem("cliente")) :  null;       
    },
    
    validarObjectLocal: function(string){        
        return sessionStorage.getItem(string) !== "" && sessionStorage.getItem(string) !== undefined && sessionStorage.getItem(string) !== null;        
    },
    
    cerrarSesion: function(){
        sessionStorage.setItem("cliente","");
        sessionStorage.removeItem("cliente");        
        location.href = "../cliente/index.html#/login/cliente";
    }, 
    
    //Obtener Cliente
    getidCliente:function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));          
        if (obj){            
            return obj.idCliente;
        }else{
            location.href = "../cliente/index.html#/login/cliente";
        }   
    }, 
    
    //Obtener NOMBRE CLIENTE
    getNombre:function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));        
        if (obj){            
            return obj.Nombre;
        }
    },         
    
    getTelefono: function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));        
        if (obj){            
            return obj.Telefono;
        }  
    },
    
    getGrupo: function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));        
        if (obj){            
            return obj.idGrupo;
        }  
    },
           
    getDireccion: function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));        
        if (obj){            
            return (obj.Direccion);
        }  
    },
    
    getEmail: function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));        
        if (obj){            
            return (obj.Email);
        }  
    }, 
    
    getLatitud: function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));        
        if (obj){            
            return (obj.latitud);
        }  
    }, 
    
    getLongitud: function(){
        var obj = JSON.parse(sessionStorage.getItem("cliente"));        
        if (obj){            
            return (obj.longitud);
        }  
    } 
};



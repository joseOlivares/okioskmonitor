
let contadorEquipo={
    offline:[],
    warning:[],
    ready:[],
    total:0,
    addOffline:function(ipId){
        if(ipId && contadorEquipo.total>contadorEquipo.offline.length && ipId.length>3){
            contadorEquipo.offline.push(ipId);
            contadorEquipo.delReady(ipId);
            contadorEquipo.delWarning(ipId);
        }           
    },
    addWarning:function(ipId){
        if(ipId &&  contadorEquipo.total>contadorEquipo.warning.length && ipId.length>3){
            contadorEquipo.warning.push(ipId);
            contadorEquipo.delOffline(ipId);
            contadorEquipo.delReady(ipId);
        }
           
    },
    addReady:function(ipId){
        if(ipId && contadorEquipo.total>contadorEquipo.ready.length && ipId.length>3){
            contadorEquipo.ready.push(ipId);
            contadorEquipo.delWarning(ipId);
            contadorEquipo.delOffline(ipId);
        }

    },
    delOffline:function(ipId){
        if(ipId && ipId.length>3){
            const index = array.indexOf(ipId);
            if(index!==-1)
                contadorEquipo.offline.splice(index, 1);//borrando elemento
        }
    },
    delWarning:function(ipId){
        if(ipId && ipId.length>3){
            const index = array.indexOf(ipId);
            if(index!==-1)
                contadorEquipo.warning.splice(index, 1);//borrando elemento
        }
    },  
    delReady:function(ipId){
        if(ipId &&  ipId.length>3){
            const index = array.indexOf(ipId);
            if(index!==-1)
                contadorEquipo.ready.splice(index, 1);//borrando elemento
        }   
    },
    setTotal:function(totalEquipos){
        if(totalEquipos && totalEquipos>=0){
            contadorEquipo.total=totalEquipos;
        }else{
            contadorEquipo.total=0;
        }
    }

}

module.exports = contadorEquipo;
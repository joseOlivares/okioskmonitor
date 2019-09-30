const { format } = require('timeago.js');
const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

helpers.isAdminAcciones = (idPerfil, idusuario, nombre_usuario) => {
   
    let html = "";
    if (idPerfil != 1) {
        html = html + "<a href='/usuario/editarusuario/"+ idusuario + "' class='btn btn-info'>Editar</a>" + 
                      `<a onclick='validarBorrado(${idusuario},"${nombre_usuario}")' class='btn btn-danger'>Borrar</a>`;

    }else{
        html = html + "<a class='btn btn-primary' disabled='disabled'>ROOT</a>";
    }
    //console.log(html);
    return html;
};

//Creando IF que compara 2 valores, Jolivares, se usa en editarusuarios.hbs
helpers.perfilSeleccionado=(usuarioIdperfil, perfilIdperfil, perfilNombre)=>{
    
    if(usuarioIdperfil == perfilIdperfil){
        return `<option value="${perfilIdperfil}" selected="selected">${perfilNombre}</option>`;
    }
    return `<option value="${perfilIdperfil}">${perfilNombre}</option>`;
};

helpers.fechaCorta=(mydate)=>{
    var f=new Date(mydate);

    return f.toLocaleString();
}

helpers.estadoUsuario=(myState)=>{
    var estado="Inactivo";
    if(myState===1){
        estado="Activo";
    }

    if(myState===0){
        estado="Eliminado";
    }

    return estado;
}

//backup
//"<a href='/usuario/borrarusuario/"+ idusuario + "' class='btn btn-danger'>Borrar</a>"


module.exports = helpers;
/*
	LIbreria para definir la IP Estatica y puerto del servidor de monitoreo
	Codificado  e implementado por Jose Luis Olivares, email: joseluiss_503@hotmail.com
	Version 1.0,    Junio 2017
	Actualización: Septiembre 2019
*/

const servidor={
	IP:'http://192.168.9.149:3000' //IP y puerto del servidor de monitoreo, ex  'http://192.168.79.128:3000'
};

const dbServer={
		dbServer: '127.0.0.1', 
		user:'admin',
		pass:'admin',
		db:'dbmonitoreo',
		port:'33068'
}
//ip del servidor de base de datos, database server IP
module.exports.dbServer=dbServer; 
module.exports.servidor=servidor;
//-----------------------------------------------------------------------------
//Libreria para leer estatus de impresor Zebra TTP
//Basada en las especificaciones del fabricante
//Codificado  e implementado por Jose Luis Olivares, email: joseluiss_503@hotmail.com
//Version 1.0,  Junio 2017
//Version 2.0,  Septiembre 2019
//-----------------------------------------------------------------------------

//***Global Vars****
      var printerName="Zebra TTP 2030"; //Nombre del impresor instalado en el cliente
      var  clientIP=cliente.IP; //Ip del cliente a monitorear, leida desde seIPs.js
      var  ipAsID=clientIP.replace(/[.]/g,'');//usando ip sin puntos como identificador
	  var  serverIP=servidor.IP; //leida desde setIps.js

      var prStatus=-1, strPrinterStatus=-1, prExtendedPrinterstatus=-1;
      var prDetectedErrorState=-1,strDetectedErrorstate=-1, prExtendedDetectedErrorState=-1, strExtendedDetectedErrorState=-1;
	  var prLastErrorCode=-1,strLastErrorCode=-1, strErrorDescription=-1;
	  var myPrinter={};//para guardar los errores locales del printer
	  var existeError=false;//guarda el estado del equipo, por default no tiene errores 
	  var existiaError=false;//guarda el estado previo del error

	  var locator = new ActiveXObject("WbemScripting.SWbemLocator");//solo en Iexplorer
	  
      //var service = locator.ConnectServer(".");
	  var service = locator.ConnectServer(".","root/cimv2");

    //Varables SocketIO
	//server local: http://localhost:3000/
	//idClienteX=ipAsID;
	var socket = io.connect(serverIP,{query:'ipClienteX='+ipAsID}); //creating socket connection to server  'http://192.168.79.128:3000'
	//*******

var app={
	checkPrinterStatus:function(){  
		  var properties = service.ExecQuery("SELECT * FROM Win32_Printer");
		 // var properties=service.ExecQuery("SELECT * FROM  Win32_PrintJob");
	      var e = new Enumerator (properties);//Este objeto solo es compatible con Internet Explorer, no con las aplicaciones de Tienda Windows 8.x.
		  var pos=1;

	      for (;!e.atEnd();e.moveNext())  //atEnd, item, moveNext solo es aplicable en Iexplorer
	      {
	            //elementPosition++;
				var p = e.item ();			


	            if (p.Default==true)       
	            {
					//Leyendo la data del printer Default, para enviarla al server
		      		  printerName=p.caption;
		              prStatus=p.printerStatus;
		              prExtendedPrinterstatus=p.ExtendedPrinterStatus;
		              prDetectedErrorState=p.DetectedErrorState;
					  prExtendedDetectedErrorState=p.ExtendedDetectedErrorState;
					  
					  prStringStatus=p.status;
					  prDriverName=p.DriverName;//no se envía					  
					  prLastErrorCode=p.LastErrorCode||-1;//no se envia
					  strErrorDescription=p.ErrorDescription||-1;//no se envia

					  //var printer=p;
					  //debugger;
					  
			    }//End IF		

		            //alert('Corrida # '+pos);
		            pos++;
	      }//end For
	},

	showResults:function(){
		alert(printerName+' Printer Status: '+prStatus+' '+myPrinter.strPrinterStatus+'| Extended Prn Status: '+prExtendedPrinterstatus +'| Estado de error detectado:'+prDetectedErrorState+' '+myPrinter.strDetectedErrorstate+' |Estado de error extendido '+ prExtendedDetectedErrorState +' '+myPrinter.strExtendedDetectedErrorState +'| LastErrorCode= '+prLastErrorCode+' Error Desciption: '+strErrorDescription);
	},	

	sendData: function(){
		var datos={ip:clientIP,ipID:ipAsID,printerName:printerName,prStatus:prStatus,prStringStatus:prStringStatus,prExtendedPrinterstatus:prExtendedPrinterstatus,prDetectedErrorState:prDetectedErrorState, prExtendedDetectedErrorState:prExtendedDetectedErrorState};		
		socket.emit('ver_status',datos);

		//intentaremos registrar el error del printer en el log ,(aun no se prueba)
			myPrinter=evaluaEstadoPrinter({prStatus:prStatus,prExtendedPrinterstatus:prExtendedPrinterstatus,prDetectedErrorState:prDetectedErrorState,prExtendedDetectedErrorState:prExtendedDetectedErrorState});
			
				if(myPrinter.generalState==='Listo'){//cuando no existe error en el printer
					if(existiaError){
						socket.emit('registrar_log',datos); //si ya no existe error, tambien lo registramos			
					}

					existeError=false;
					existiaError=false;
				}else{
					existeError=true; //cuando existe un error en el printer
				}

				if(existeError===true && existiaError===false){
					existiaError=true; //guardamos el estado anterior
					//hacemos inserción del error
					socket.emit('registrar_log',datos);
				}
			//app.showResults();
		//------------------------------------
	}, 

    initialize: function() {
		"use strict";
		var self=this;
		//self.getClientIP();
		self.checkPrinterStatus(); //Leyendo estado del printer
		//self.showResults();
		self.sendData();


	}//cierra initialize
};

//app.initialize();
function socket_enviar(){
	app.initialize();
};

var sendingData=setInterval(socket_enviar,7000);//enviando datos cada 7 seg, mejor cada 10


//agregado 09/11/2017 Lee estado general del hardware
socket.on('ver_hwClienteData',function(myIpID){
	//alert("entra a funcion de datos del cliente ipID="+myIpID);
	
	if(myIpID===ipAsID){//si la ipid solicitada es la del cliente actual
	    var propOS=service.ExecQuery("Select * from Win32_OperatingSystem"); //OS 
	    var e5 = new Enumerator (propOS);
	    var os;
	      for (;!e5.atEnd();e5.moveNext())
	      {
	            var p5 = e5.item ();  
	            os={Nombre:p5.Caption,Arquitect:p5.OSArchitecture.toString(), Version:p5.Version, Estado:p5.Status};        
	      }

		var propCpu=service.ExecQuery("SELECT * FROM Win32_Processor");
	    var e4 = new Enumerator (propCpu);
	    var cpu;
	      for (;!e4.atEnd();e4.moveNext ())
	      {
	            var p4 = e4.item ();
 				cpu={Nombre:p4.Name,NombrePc:p4.SystemName};
	      }
   

         var propMem=service.ExecQuery("Select * from Win32_PhysicalMemory"); //Memoria
         var e3 = new Enumerator (propMem);
	  	 var detMem=[];//guarda el datalle devarias memorias

	      for (;!e3.atEnd();e3.moveNext())
	      {
	            var p3 = e3.item ();
	            var mCapacity=0;;
	            mCapacity=(Number(p3.Capacity)/1024)/1024;  

				detMem.push({Ubicacion:p3.DeviceLocator,Fabricante:p3.Manufacturer,Capacidad:mCapacity, Estado:p3.status});
				//para acceder al detalle de memorias, Eje>    memoriax.detalle[0].Capacidad;
	      }    

	

	      var propDisks=service.ExecQuery("Select * from Win32_DiskDrive where Size>0");//Discos
	      var e2 = new Enumerator (propDisks);
	      var detDisk=[];//detalle de discos
	      for (;!e2.atEnd();e2.moveNext ())
	      {
	            var p2 = e2.item ();
	            var diskSize=  (Number(p2.Size) + 536870912 ) / 1073741824;
				detDisk.push({Fabricante:p2.Manufacturer,Modelo:p2.Model,Size:diskSize.toFixed(2),SerialNum:p2.SerialNumber,Estado:p2.Status,Descripcion:p2.Description, CodigoError:p2.ConfigManagerErrorCode, LastErrorCode:p2.LastErrorCode,Interface:p2.InterfaceType});
	      }

	      socket.emit('detalle_hwCliente',os,cpu,detMem,detDisk);//enviando detalle del HW solicitado al servidor index.js

	}//cierra IF
});//probar si funciona llamarlo desde aqui o colocarlo dentro de app
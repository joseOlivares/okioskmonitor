function checkPrinterStatus (){

                //estado de error detectado 0, estado de error extendido 0, 
              switch (prStatus) {
                  case 1: 
                    strPrinterStatus = "Other - Otro"; 
                    break;    //prExtendedPrinterstatus  = wbemObject.ExtendedPrinterStatus 
                  case 2: 
                    strPrinterStatus = "Unknown - Desconocido";
                    break; 
                  case 3: 
                    strPrinterStatus = "Idle - Sin Utilizar"; 
                    break;
                  case 4: 
                    strPrinterStatus = "Printing - Imprimiendo"; 
                    break;
                  case 5: 
                    strPrinterStatus = "Warmup - Calentando";
                    break; 
                  case 6: 
                    strPrinterStatus= "Stopped printing - Impresion detenida";
                    break; 
                  case 7: 
                    strPrinterStatus = "Offline - Fuera de Linea";
                    break;       
               }   

              switch(prDetectedErrorState){  
                  case 0: 
                      strDetectedErrorstate=" Unknown - Desconocido";
                      break; 
                  case 1: 
                      strDetectedErrorstate=" Other - Otro";
                      break; 
                  case 2: 
                      strDetectedErrorstate=" NoError";
                      break; 
                  case 3: 
                      strDetectedErrorstate=" Low Paper - Papel Bajo";
                      break; 
                  case 4: 
                      strDetectedErrorstate=" NoPaper - Sin Papel";
                      break; 
                  case 5: 
                      strDetectedErrorstate=" Low Toner - Papel Bajo ";
                      break; 
                  case 6: 
                      strDetectedErrorstate=" NoToner - Sin Toner";
                      break; 
                  case 7: 
                      strDetectedErrorstate=" Door Open - Puerta abierta";
                      break; 
                  case 8: 
                      strDetectedErrorstate=" Jammed - Atascado";
                      break; 
                  case 9: 
                      strDetectedErrorstate=" Offline - Fuera de Linea";
                      break; 
                  case 10: 
                      strDetectedErrorstate=" Service Requested - Requiere Servicio";
                      break; 
                  case 11: 
                      strDetectedErrorstate=" Output Bin Full - Papel en puerta de salida";
                      break;
              }


              switch (prExtendedDetectedErrorState){
                  case 0: 
                      strExtendedDetectedErrorState=" Unknown - Desconocido";
                      break; 
                  case 1: 
                      strExtendedDetectedErrorState=" Other - Otro";
                      break; 
                  case 2: 
                      strExtendedDetectedErrorState=" No Error";
                      break; 
                  case 3: 
                      strExtendedDetectedErrorState=" Low Paper -Papel Bajo";
                      break; 
                  case 4: 
                      strExtendedDetectedErrorState=" No Paper - Sin Papel";
                      break; 
                  case 5: 
                      strExtendedDetectedErrorState=" Low Toner - Papel Bajo";
                      break; 
                  case 6: 
                      strExtendedDetectedErrorState=" No Toner - Sin Toner";
                      break; 
                  case 7: 
                      strExtendedDetectedErrorState=" Door Open - Puerta abierta";
                      break; 
                  case 8: 
                      strExtendedDetectedErrorState=" Jammed - atascado";
                      break; 
                  case 9: 
                      strExtendedDetectedErrorState=" Service Requested - Requiere Servicio";
                      break; 
                  case 10: 
                      strExtendedDetectedErrorState=" Output Bin Full - Papel en puerta de salida";
                      break; 
                  case 11: 
                      strExtendedDetectedErrorState=" Paper Problem - Problema de Papel";
                      break; 
                  case 12: 
                      strExtendedDetectedErrorState=" Cannot Print Page - No se puede imprimir la pagina";
                      break; 
                  case 13: 
                      strExtendedDetectedErrorState=" User Intervantion Required - Requiere intervencion del Usuario";
                      break; 
                  case 14: 
                      strExtendedDetectedErrorState=" Out of Memory - Sin memoria";
                      break; 
                  case 15: 
                      strExtendedDetectedErrorState=" Server Unknown - Servidor desconocido"; 
                      break;
              }//end switch

}

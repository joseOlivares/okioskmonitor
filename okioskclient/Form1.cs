using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security;
using System.Security.Permissions;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

//Cliente para monitoreo de Kioskos
//Desarrollado por: José Luis Olivares
//Email: joseluiss_503@hotmail.com
//Linkedin: https://www.linkedin.com/in/jolivaress/
//Fecha: Septiembre 2019

namespace okioskclient
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Resize(object sender, EventArgs e)
        { //Codigo nuevo, intentando ocultar formulario en kioscos al minimizar
            if (WindowState == FormWindowState.Minimized)
            {
                ShowInTaskbar = false;
                notifyIcon1.Visible = true;
            }
            else
            {
                ShowInTaskbar = true;
                notifyIcon1.Visible = false;
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {   
            //String fullPath = "C:/okiosk_monitor/agente_monitoreo.html";
     
            String  appPath = Path.GetDirectoryName(System.AppDomain.CurrentDomain.BaseDirectory);
            appPath = Directory.GetParent(appPath).FullName;

            String configPath = appPath; //path al archivo setServerIP
            configPath += @"\okiosk_installer\app\config";
            //validamos que la ruta a los archivos de configuración (y éstos) existan

            if (System.IO.Directory.Exists(configPath))
            {   
                appPath += @"\okiosk_installer\app\agente_monitoreo.html";
                String htmlPathOk = new Uri(appPath).LocalPath;
                //htmlPathOk = htmlPathOk.Replace("\\", "/");
                //webBrowser1.Navigate(fullPath);
                //MessageBox.Show(htmlPathOk);
              
                webBrowser1.Navigate(htmlPathOk);
            }
            else
            {
                //MessageBox.Show("Revise que exista la ruta C:/okiosk_monitor/agente_monitoreo_official/");
                webBrowser1.DocumentText =
                    "<html><body style='background-color:#FFD2D2;'><div style='text-align: center; margin-top:20%;'>" +
                    "<h3>No fue posible encontrar los archivos de configuración en la ruta "+configPath+"</h3>" +
                    "</div></body></html>";
            }


            notifyIcon1.BalloonTipIcon = ToolTipIcon.Info;
            notifyIcon1.BalloonTipText = "okiosk Monitor Client";
            notifyIcon1.BalloonTipTitle = "okiosk Monitor";
            notifyIcon1.ShowBalloonTip(1000);
        }

        private void WebBrowser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
           
        }

        static Boolean ValidarIP(String ip)
        {
            Regex ipExp = new Regex(@"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$"); //Exp Regular par IP valida
            if (ip.Length>=7) //longitud minima de una ip, Ex. 1.1.1.1
            {
                if (ipExp.IsMatch(ip))//validando patron de una ip
                {
                    return true;
                }

            }
            return false;
        }

        private void NotifyIcon1_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            this.Show();
            this.WindowState = FormWindowState.Normal;
        }

        private void ToolStripMenuItemExit_Click(object sender, EventArgs e)
        {   //se agregó menu salir en notificación
            Application.Exit();
        }

        private void IPServidorToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //Configurando IP Cliente
            //this.TopMost = false;//enviando main form al fondo

            String ipCliente = Microsoft.VisualBasic.Interaction.InputBox("Escriba la Ip del cliente (este equipo):",
                                "Ip a monitorear", "192.168.7.224");

            ipCliente = ipCliente.Trim(); //borrando espacios
            //this.TopMost = true;

            if (ipCliente == "")
            {
                return; //si presinó cancelar
            }

            String appPath = Path.GetDirectoryName(System.AppDomain.CurrentDomain.BaseDirectory);
            appPath = Directory.GetParent(appPath).FullName;
            String jsFile = appPath + @"\okiosk_installer\app\config\setIPs.js";

            if (ValidarIP(ipCliente)) //validamos la IP
            {
                string fileContent;
                MessageBox.Show("Formato de IP Válido");
                try
                {
                    fileContent = File.ReadAllText(jsFile);
                    String patIpCliente = @"cliente={IP:\'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b\'}";
                    String newIpCliente = @"cliente={IP:'" + ipCliente + "'}";
                    String newContent = Regex.Replace(fileContent, patIpCliente, newIpCliente);

                    //definiendo permisos de escritura en archivo
                    FileIOPermission fPermission = new FileIOPermission(FileIOPermissionAccess.Write | FileIOPermissionAccess.Read, jsFile);

                    try
                    {
                        fPermission.Demand();
                        File.WriteAllText(jsFile, newContent);//Escribimos el nuevo archivo
                        MessageBox.Show("¡IP Guardada correctamente! (La aplicación se reiniciará)");

                        System.Diagnostics.Process.Start(Application.ExecutablePath); // to start new instance of application
                        this.Close(); //to turn off current app         
                    }
                    catch (Exception)//SecurityException
                    {
                        MessageBox.Show(@"No tiene permisos para escribir directamente en .\config\setIPs.js" +
                            Environment.NewLine + "Intente ejecutar la aplicación como administrador");
                        throw;
                    }

                }
                catch (Exception err)
                {
                    MessageBox.Show(err.ToString());
                    throw;
                }
            }
            else
            {
                MessageBox.Show("¡Formato de Ip introducido no es válido!");
                return;
            }
        }

        private void IPServidorToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            //IP Server
            String appPath = Path.GetDirectoryName(System.AppDomain.CurrentDomain.BaseDirectory);
            appPath = Directory.GetParent(appPath).FullName;
            String jsFile = appPath + @"\okiosk_installer\app\config\setIPs.js";

            //this.TopMost = false;  //enaviando form principal al fondo

            String ipServer = Microsoft.VisualBasic.Interaction.InputBox("Escriba la Ip del Servidor de Monitoreo:",
        "Ip Servidor", "192.168.1.1");

            //this.TopMost = true;
            ipServer = ipServer.Trim();
            String newIpServer = @"servidor={IP:'http://" + ipServer + ":3000'}";

            if (ipServer == "")
            {
                return; //si presinó cancelar
            }


            if (ValidarIP(ipServer))// si la ip del server es válida
            {
                string fileContent;
                MessageBox.Show("Formato de IP Válido");

                try
                {
                    fileContent = File.ReadAllText(jsFile);
                    String patIpServer = @"servidor={IP:\'http://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000\b\'}";
                    //definiendo permisos de escritura en archivo
                    FileIOPermission fPermission = new FileIOPermission(FileIOPermissionAccess.Write | FileIOPermissionAccess.Read, jsFile);
                    try
                    {                      
                        String newContent2 = Regex.Replace(fileContent, patIpServer, newIpServer);
                        //-----Para validar cambios y ver si se aplicaron
                        //MessageBox.Show(fileContent);
                        //MessageBox.Show(newContent2);
                        //------------------------------------------------
                        fPermission.Demand();
                        File.WriteAllText(jsFile, newContent2);//Escribimos el nuevo archivo
                        MessageBox.Show("¡IP Guardada correctamente! (La aplicación se reiniciará)");

                        System.Diagnostics.Process.Start(Application.ExecutablePath); // to start new instance of application
                        this.Close(); //to turn off current app
                    }
                    catch (Exception)//SecurityException
                    {
                        MessageBox.Show(@"No tiene permisos para escribir directamente en .\config\setIPs.js" +
                            Environment.NewLine + "Intente ejecutar la aplicación como administrador");
                        throw;
                    }

                }
                catch (Exception err)
                {
                    MessageBox.Show(err.ToString());
                    throw;
                }

            }
            else
            {
                MessageBox.Show("¡Formato de Ip introducido no es válido!");
                return;
            }

        }        
    }
}

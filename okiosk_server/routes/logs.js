const express = require('express');
const router = express.Router();
const pool = require('../database');
const perfil=require('../lib/validarperfil');//Validador de perfil, Jose Olivares, Sept 2019
////prefijo '/kiosko'
/*
    sess=req.session;
    if (!sess.username) {
        res.redirect('/login');
    } else {
        //Codigo aqui
    }
*/


//ver Log de errores de Kiosko
//por Jose Luis Olivares, 23/09/2019
router.get('/verlogkioskos', async (req, res) => {
    sess=req.session;
    if (!sess.username||!perfil.validarAcceso(sess.idperfil)) {
        res.redirect('/login');
    } else {
        //Codigo aqui
        const logKioskos = await pool.query(`SELECT tblalertas_log.*, tblequipo.nombre,tblequipo.serie,tblequipo.ip,tblequipo.ubicacion,tblequipo.contacto,
        tblequipo.telefono, tblequipo.email  FROM tblalertas_log INNER JOIN tblequipo WHERE tblalertas_log.idequipo=tblequipo.idequipo`); 

        //console.log(kioskos);

	    //18/09/2019 para corregir que se navegue hasta aqui sin estar logueado (Olivares)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); 
               
        res.render('kiosko/verlogkioskos', {logKioskos});
    }
    
});




module.exports = router;
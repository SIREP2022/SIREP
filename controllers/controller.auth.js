const query = require('../database/pool-conexion.js');
const authConfig = require('../config/auth')
const jwt = require('jsonwebtoken');
const controllerAuth = {}

controllerAuth.logIn = async(req, res) => {
    req.session.user = '';
    req.session.token = '';
    req.session.pv = '';
    req.session.up = '';
    /* ============CONSULTA QUE TRAE EL LOGIN DEL USUARIO QUE PASA COMO PARAMETRO============ */
    var sql =`select identificacion, Rol, Ficha, Estado, Password from personas WHERE Login = '${req.body.user}'`;
    try{
        let rows =  await query(sql);
        /* ====FILAS DE LA CONSULTA */
        if(rows[0].Estado == 0) return res.json({status: 'errorIn', message: 'Usuario no se enccuentra activo'});
        if(rows.length <= 0) return res.json({status: 'error', message: 'User not found'});
        /* ====VALIDA LA CONTRASEÑA===== */
        if(req.body.password == rows[0].Password) compare = true;
        else compare = false;

        if(!compare) return res.json({status: 'error', message: 'User or password incorrect'});
        let json = {
            id: rows[0].identificacion,
            role: rows[0].Rol,
            ficha: rows[0].Ficha
        }
        if(json.role == 'Lider UP'){
            if(req.body.up) req.session.up = req.body.up;
            else {
                var ups = `SELECT * FROM unidades_productivas WHERE fk_persona = '${json.id}'`;
                let rowsUPS = await query(ups);
                if(rowsUPS.length > 1) return res.json({status: 'error_up',  message: 'Tiene asignada mas de una unidad productiva', data: rowsUPS});
                else {
                    if(rowsUPS[0]) req.session.up = rowsUPS[0].codigo_up;
                    else req.session.up = '';
                }
            }
        }
        if(json.role == 'Punto Venta'){
            if(req.body.pv) {
                req.session.pv = req.body.pv;
            }
            else {
                var pvs = `SELECT * FROM punto_venta WHERE fk_persona = '${json.id}'`;
                var rowsPVS = await query(pvs);
                if(rowsPVS.length > 1) return res.json({status: 'error_pv',  message: 'Tiene asignada mas de un punto de venta', data: rowsPVS});
                else {
                    if(rowsPVS[0]) req.session.pv = rowsPVS[0].Id_punto_vent;
                    else req.session.pv = '';
                }
            }
        }
        let token = jwt.sign({user: json}, authConfig.secret, {expiresIn: authConfig.expires});
        var decoded = jwt.verify(token, authConfig.secret);
        req.session.token = token;
        return res.json({user:decoded.user, token});
    } catch (e) {
        return res.json({status: 'error', message: 'Error with sql query: '+ e})
    } 
}
controllerAuth.logOut = (req, res) => {
    req.session.user = '';
    req.session.token = '';
    req.session.pv = '';
    req.session.up = '';
} 
controllerAuth.changePassword = async (req, res) => {
    let token = req.session.token;
    let decoded = jwt.verify(token, authConfig.secret);
    let actual_password = req.body.actual_password;
    let new_password = req.body.new_password;
    if(!new_password) return res.json({status: 'error', message: 'New password cannot be empty'})
    var sql =`select Password from personas WHERE identificacion = '${decoded.user.id}'`;
    try{
        let rows = await query(sql);
        if(actual_password == rows[0].Password) compare = true;
        else compare = false;
        if(!compare) return res.json({status: 'error', message: 'La contraseña actual no coincide'})
        let pass_new = new_password;
        var sql_update =`update personas set password = '${pass_new}' WHERE identificacion = '${decoded.user.id}'`;
        //=========UPDATE PASSWORD============== 
        await query(sql_update)
        return res.json({status: 'success', message: 'Contraseña editada con éxito'})
    } catch (err) {
        return res.json({status: 'error', message: err.message});
    }
}

module.exports = controllerAuth;
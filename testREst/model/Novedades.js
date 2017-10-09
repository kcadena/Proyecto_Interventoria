var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();


module.exports.getDataNewsPercent = function (data) {
    var sequelize = sqlCon.configConnection();
    console.log(data);
    var query1 = `
    select 
    c.usuario_asignado asignado,us.nombre usu_nov,ua.nombre usu_car,
    n.keym,n.id_caracteristica,n.id_usuario,
    c.tipo,a.nombre,
    c.porcentaje_cumplido porcentaje_actual,
    n.porcentaje_cambio,
    (n.porcentaje_cambio) porcentaje_futuro,
    n.fecha_creacion
    from novedades n
    join usuarios us on n.usuario_own = us.id_usuario
    join caracteristicas c on c.keym = n.keym  and c.id_caracteristica = n.id_caracteristica and c.id_usuario = n.id_usuario
    
    join usuarios ua on c.usuario_asignado = ua.id_usuario
    
    join actividades a on a.keym_car = n.keym  and a.id_caracteristica = n.id_caracteristica and a.id_usuario_car = n.id_usuario
    where usuario_novedad = `+ data.id_usuario + ` and n.tipo = 'POR' and n.estado = 'WAI' order by n.usuario_own;
    `;

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log("Se encontro correctamente la lista de novedades\n\n\n" + JSON.stringify(x));
                resolve(x);
            })
            .catch(x => {
                console.log("NO se encontro correctamente la lista de novedades " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}

module.exports.approvalPercentage = function (data) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n  DATA ====>    '+data);
    var sequelize = sqlCon.configConnection();
    var query1 = `
        select percentageApproval(
            `+data.keym+`,
            `+data.id_caracteristica+`,
            `+data.id_usuario+`,
            `+data.stateApproval+`,
            `+data.porcentaje_cambio+`
        );
    `;


    console.log('\n\n\n\n\n  query1 ====>    '+query1+'\n\n\n');

    return new Promise((resolve, reject) => {
        sequelize
            .query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log("Se aprobo correctamente el cambio de porcentaje => " + JSON.stringify(x));
                resolve(true);
            })
            .catch(x => {
                console.log("NO se aprobo correctamente el cambio de porcentaje " + x);
                reject(false);
            })
            .done(x => {
                sequelize.close();
                console.log("Se ha cerrado sesion de la conexion a la base de datos");
            });
    });
}
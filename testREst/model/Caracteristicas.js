var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');

var router = express.Router();



module.exports.createCharacteristic = function (data, type_char) {
    console.log(JSON.stringify(data));

    //Informacion segun la caracteristica

    var keym_padre = data.keym_padre;
    var id_caracteristica_padre = data.id_caracteristica_padre;
    var id_usuario_padre = data.id_usuario_padre;

    //Datos actuales
    var keym_car = 0;
    var id_usuario_car = data.id_usuario;
    var id_caracteristica_car;  //Luego asignamos su respectivo valor

    //Al momento de crearse la caracteristica el usuario asignado es el mismo que lo creo
    var usuario_asignado = data.id_usuario;

    var estado = 'Iniciacion';

    var porcentaje_asignado = data.porcentaje_asignado == undefined ? porcentaje_asignado = 0 : porcentaje_asignado = data.porcentaje_asignado;
    var porcentaje_cumplido = data.porcentaje_cumplido == undefined ? porcentaje_cumplido = 0 : porcentaje_cumplido = data.porcentaje_cumplido;
    var recursos = data.recursos == undefined ? recursos = 0 : recursos = data.recursos;
    var recursos_restantes = data.recursos_restantes == undefined ? recursos_restantes = 0 : recursos_restantes = data.recursos_restantes;
    var presupuesto = data.presupuesto == undefined ? presupuesto = 0 : presupuesto = data.presupuesto;
    var costos = data.costos == undefined ? costos = 0 : costos = data.costos;

    var tipo_caracteristica = type_char;
    var visualizar_superior = true;

    var publicacion_web = false;
    var porcentaje = 0;
    var publicacion_reporte = false;

    //Date
    var current_date = new Date();
    var fecha_inicio = data.fecha_inicio;
    var fecha_fin = data.fecha_fin;
    var fecha_ultima_modificacion = current_date.toLocaleString();



    //Obtenemos el id_caracteristica actual de esta caracteristica


    if (type_char === 'A')
        return new Promise((resolve, reject) => {
            var sequelize = sqlCon.configConnection();

            getIdCharacteristic(keym_car, id_usuario_car, id_caracteristica_padre, tipo_caracteristica).then(x => {
                data.id_caracteristica = parseInt(x[0].car) + 1;
                id_caracteristica_car = parseInt(x[0].car) + 1;

                if (tipo_caracteristica === 'A') {

                    var num = parseInt(x[0].act) + 1;
                    data.id_actividad = num;
                }

                else
                    data.id_proyecto = parseInt(x[0].prj) + 1;

                var query1;

                if (type_char == 'P') {
                    query1 = `
                    INSERT INTO caracteristicas
                    (keym,id_usuario,id_caracteristica,estado,porcentaje_asignado,
                    porcentaje_cumplido,recursos,recursos_restantes,presupuesto,costos,tipo_caracteristica,visualizar_superior,
                    usuario_asignado,publicacion_web,porcentaje,fecha_inicio,fecha_fin,
                    fecha_ultima_modificacion,publicacion_reporte)

                    VALUES (
                        `+ keym_car + `,
                        `+ id_usuario_car + `,
                        `+ id_caracteristica_car + `,
                        '`+ estado + `',
                        `+ porcentaje_asignado + `,
                        `+ porcentaje_cumplido + `,
                        `+ recursos + `,
                        `+ recursos_restantes + `,
                        `+ presupuesto + `,
                        `+ costos + `,
                        '`+ tipo_caracteristica + `',
                        `+ visualizar_superior + `,
                        `+ usuario_asignado + `,
                        `+ publicacion_web + `,
                        `+ porcentaje + `,
                        '`+ fecha_inicio + `',
                        '`+ fecha_fin + `',
                        '`+ fecha_ultima_modificacion + `',
                        `+ publicacion_reporte + `

                    );`;
                }
                else {
                    query1 = `
                    INSERT INTO caracteristicas
                    VALUES (
                        `+ keym_car + `,
                        `+ id_usuario_car + `,
                        `+ id_caracteristica_car + `,

                        `+ keym_padre + `,
                        `+ id_usuario_padre + `,
                        `+ id_caracteristica_padre + `,

                        '`+ estado + `',
                        `+ porcentaje_asignado + `,
                        `+ porcentaje_cumplido + `,
                        `+ recursos + `,
                        `+ recursos_restantes + `,
                        `+ presupuesto + `,
                        `+ costos + `,
                        '`+ tipo_caracteristica + `',
                        `+ visualizar_superior + `,
                        `+ usuario_asignado + `,
                        `+ publicacion_web + `,
                        `+ porcentaje + `,
                        '`+ fecha_inicio + `',
                        '`+ fecha_fin + `',
                        '`+ fecha_ultima_modificacion + `',
                        `+ publicacion_reporte + `

                    );`;
                }

                console.log('\n\n\n\n\n\n\n\n' + query1 + '\n\n\n\n\n\n\n\n');

                //Creacion de Query para insertar datos a la base de datos


                sequelize.query(query1, { type: sequelize.QueryTypes.INSERT })
                    .then(x => {
                        console.log('Se ha registrado correctamente la Caracteristica');
                        //JSON con datos a ser devueltos para crear la actividad
                        var json_char = {
                            keym: keym_car,
                            id_caracteristica: id_caracteristica_car,
                            id_usuario: id_usuario_car,
                            fecha_ultima_modificacion: fecha_ultima_modificacion
                        };
                        resolve(json_char);
                    }).catch(x => {
                        console.log('Error' + x);
                        reject(false);
                    }).done(x => {
                        sequelize.close();
                        console.log('Se ha cerrado sesion de la conexion a la base de datos');
                    });




            }).catch(x => {
                console.log("Gran error getIdCharacteristic(): " + x);
                reject = false;
            });
        });
    else
        return new Promise((resolve, reject) => {
            var sequelize = sqlCon.configConnection();

            getIdCharacteristic(keym_car, id_usuario_car, -1, tipo_caracteristica).then(x => {
                data.id_caracteristica = parseInt(x[0].car) + 1;
                id_caracteristica_car = parseInt(x[0].car) + 1;

                if (tipo_caracteristica === 'A')
                    data.id_actividad = parseInt(x[0].act) + 1;
                else
                    data.id_proyecto = parseInt(x[0].prj) + 1;

                var query1;

                if (type_char == 'P') {
                    query1 = `
                    INSERT INTO caracteristicas
                    (keym,id_usuario,id_caracteristica,estado,porcentaje_asignado,
                    porcentaje_cumplido,recursos,recursos_restantes,presupuesto,costos,tipo_caracteristica,visualizar_superior,
                    usuario_asignado,publicacion_web,porcentaje,fecha_inicio,fecha_fin,
                    fecha_ultima_modificacion,publicacion_reporte)

                    VALUES (
                        `+ keym_car + `,
                        `+ id_usuario_car + `,
                        `+ id_caracteristica_car + `,
                        '`+ estado + `',
                        `+ porcentaje_asignado + `,
                        `+ porcentaje_cumplido + `,
                        `+ recursos + `,
                        `+ recursos_restantes + `,
                        `+ presupuesto + `,
                        `+ costos + `,
                        '`+ tipo_caracteristica + `',
                        `+ visualizar_superior + `,
                        `+ usuario_asignado + `,
                        `+ publicacion_web + `,
                        `+ porcentaje + `,
                        '`+ fecha_inicio + `',
                        '`+ fecha_fin + `',
                        '`+ fecha_ultima_modificacion + `',
                        `+ publicacion_reporte + `

                    );`;
                }
                else {
                    query1 = `
                    INSERT INTO caracteristicas
                    VALUES (
                        `+ keym_car + `,
                        `+ id_usuario_car + `,
                        `+ id_caracteristica_car + `,

                        `+ keym_padre + `,
                        `+ id_usuario_padre + `,
                        `+ id_caracteristica_padre + `,

                        '`+ estado + `',
                        `+ porcentaje_asignado + `,
                        `+ porcentaje_cumplido + `,
                        `+ recursos + `,
                        `+ recursos_restantes + `,
                        `+ presupuesto + `,
                        `+ costos + `,
                        '`+ tipo_caracteristica + `',
                        `+ visualizar_superior + `,
                        `+ usuario_asignado + `,
                        `+ publicacion_web + `,
                        `+ porcentaje + `,
                        '`+ fecha_inicio + `',
                        '`+ fecha_fin + `',
                        '`+ fecha_ultima_modificacion + `',
                        `+ publicacion_reporte + `

                    );`;
                }


                //Creacion de Query para insertar datos a la base de datos


                sequelize.query(query1, { type: sequelize.QueryTypes.INSERT })
                    .then(x => {
                        console.log('Se ha registrado correctamente la Caracteristica');
                        //JSON con datos a ser devueltos para crear la actividad
                        var json_char = {
                            keym: keym_car,
                            id_caracteristica: id_caracteristica_car,
                            id_usuario: id_usuario_car,
                            fecha_ultima_modificacion: fecha_ultima_modificacion
                        };
                        resolve(json_char);
                    }).catch(x => {
                        console.log('Error' + x);
                        reject(false);
                    }).done(x => {
                        sequelize.close();
                        console.log('Se ha cerrado sesion de la conexion a la base de datos');
                    });




            }).catch(x => {
                console.log("Gran error getIdCharacteristic(): " + x);
                reject = false;
            });
        });



}

module.exports.getPercentage = function (data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        var query1 = `
                select func(
                    `+data.keym+`,`+data.id_caracteristica+`,`+data.id_usuario+`,
                    `+data.porcentaje+`,`+data.porcentaje_cumplido+`,
                    `+data.keym+`,`+data.id_caracteristica+`,`+data.id_usuario+`);
                `;

        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log('YAY porcentaje cumplido   =>   ' + JSON.stringify(x[0].func));
                resolve(x[0].func);
            }).catch(x => {
                console.log('Error al Obtener el porcentaje cumplido' + x);
                reject(false);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });
    });
}

module.exports.updatePercentage = function (data) {
    console.log('OK');
    var flag = true;
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();

        data.forEach(function (element) {
            console.log('\n\n' + JSON.stringify(element));
            var query1 = `
                UPDATE caracteristicas SET porcentaje = `+ element.porcentaje + `
                WHERE keym =  `+ element.keym + `
                and id_caracteristica = ` + element.id_caracteristica + `
                and id_usuario = ` + element.id_usuario + `
            `;
            console.log('\n\n' + query1);
            sequelize.query(query1, { type: sequelize.QueryTypes.UPDATE })
                .then(x => {
                    console.log('ok');
                }).catch(x => {
                    console.log('Error al actualizar porcentajes ' + x);
                    flag = false;
                }).done(x => {
                    sequelize.close();
                    console.log('Se ha cerrado sesion de la conexion a la base de datos');
                });
        }, this);

        if (flag)
            resolve(true);
        else
            reject(false);

    });
}

module.exports.updateCharacteristic = function (data) {
    //Date
    var current_date = new Date();
    var flag1 =true , flag2 = true;
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        var query1 = `
                UPDATE caracteristicas SET

                estado = '`+ data.estado + `',

                porcentaje_asignado = `+ data.porcentaje_asignado + `,
                porcentaje_cumplido = `+ data.porcentaje_cumplido + `,

                fecha_fin = '`+ data.fecha_fin + `',
                fecha_inicio = '`+ data.fecha_inicio + `',
                fecha_ultima_modificacion = '`+ current_date.toLocaleString() + `'

                WHERE keym =  `+ data.keym + `
                and id_caracteristica = ` + data.id_caracteristica + `
                and id_usuario = ` + data.id_usuario + `
                `;

        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log('YAY   =>   ' + JSON.stringify(x));
            }).catch(x => {
                console.log('Error al registrar actividad ' + x);
                flag1=false;
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });

        var query2 = `
            UPDATE actividades SET

            nombre = '`+data.nom_act+`',
            descripcion = '`+data.desc_act+`',
            fecha_ultima_modificacion = '`+ current_date.toLocaleString() +`'

            WHERE keym_car =  `+ data.keym + `
            and id_caracteristica = ` + data.id_caracteristica + `
            and id_usuario_car = ` + data.id_usuario + `
        `;

        sequelize.query(query2, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                console.log('YAY   =>   ' + JSON.stringify(x));
                resolve(true);
            }).catch(x => {
                console.log('Error al registrar actividad ' + x);
                flag2=false;
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });
    });

    if(flag1 && flag2)
        resolve(true);
    else
        reject(false);

}

function getIdCharacteristic(keym, id_usuario, id_caracteristica, type_char) {
    var query1;
    if (type_char === 'A') {
        query1 = `
        select max(t1.car) car,max(t1.act) act
        from
        (
        select max(caracteristicas.id_caracteristica) as car, 0 as act
        from caracteristicas
        where keym = `+ keym + ` and id_usuario = ` + id_usuario + `
        union
        select 0 as car, max(actividades.id_actividad) as act
        from actividades natural join caracteristicas
        where keym = `+ keym + ` and id_usuario = ` + id_usuario + `
        ) as t1 ;`;
    }
    else {

        //and id_caracteristica_padre = ` + id_caracteristica + `
        query1 = `
        select max(t1.car) car,max(t1.prj) prj
        from
        (
        select max(caracteristicas.id_caracteristica) as car, 0 as prj
        from caracteristicas
        where keym = `+ keym + ` and id_usuario = ` + id_usuario + `

        union

        select 0 as car ,max(proyectos.id_proyecto) as prj
        from proyectos join caracteristicas on proyectos.id_caracteristica=caracteristicas.id_caracteristica
        and proyectos.keym_car=caracteristicas.keym
        and proyectos.id_usuario_car=caracteristicas.id_usuario
        where proyectos.keym = `+ keym + ` and proyectos.id_usuario = ` + id_usuario + `
        ) as t1
        `;
    }
    console.log('Query 1 ===>     ' + query1);
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT })
            .then(x => {
                resolve(x);
            }).catch(x => {
                console.log('Error getIdCharacteristic() execute query1 ' + x);
                reject(x);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });
    });
}

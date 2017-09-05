
var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();
var fs = require('fs');
var repository = 'files/';

//Service to create files
module.exports.create_file = function (data, files) {
    //Characteristic Data
    var keym_car = data.keym;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario_car = data.id_usuario;
    //File Data
    // data.nombre_archivo == undefined ? nombre_archivo = files.name :  nombre_archivo = '';
    var keym = 0;
    var id_usuario = data.id_usuario_act;
    var id_archivo; //Later initialize
    var nombre_archivo = '';
    var titulo = data.titulo == undefined ? titulo = 'UNDEFINED' : titulo = data.titulo;
    var subtitulo = data.subtitulo == undefined ? subtitulo = 'UNDEFINED' : subtitulo = data.subtitulo;
    var descripcion = data.descripcion == undefined ? descripcion = 'UNDEFINED' : descripcion = data.descripcion;
    var contenido = data.contenido == undefined ? contenido = 'UNDEFINED' : contenido = data.contenido;
    var fecha_creacion = data.fecha_creacion == undefined ? fecha_creacion = 'UNDEFINED' : fecha_creacion = data.fecha_creacion;
    var fecha_ultima_modificacion = data.fecha_ultima_modificacion == undefined ? fecha_ultima_modificacion = 'UNDEFINED' : fecha_ultima_modificacion = data.fecha_ultima_modificacion;
    var publicacion = data.publicacion == undefined ? publicacion = 1 : publicacion = data.publicacion;
    var tipo = data.tipo;
    var localizacion = 0;
    var longitud = 0;
    var srcGif = '';
    var srcServ = '';



    return new Promise((resolve, reject) => {

        getIdFreeFile(keym, id_usuario, files.file.name).then(x => {
            id_archivo = x[0];
            console.log('\n\n\n\n\nPOL  ' + x[0] + '   ' + x[1]);
            joinNameFile(keym, id_archivo, id_usuario, x[1]).then(nom_arc => {
                nombre_archivo = nom_arc;
                var sequelize = sqlCon.configConnection();

                var query1 = `
                    insert into archivos values 
                    (
                        `+ keym + `,
                        `+ id_archivo + `,
                        `+ id_usuario + `,
                        `+ keym_car + `,
                        `+ id_caracteristica + `,
                        `+ id_usuario_car + `,
                        '`+ nombre_archivo + `',
                        '`+ titulo + `',
                        '`+ subtitulo + `',
                        '`+ descripcion + `',
                        '`+ contenido + `',
                        '`+ fecha_creacion + `',
                        '`+ fecha_ultima_modificacion + `',
                        `+ publicacion + `,
                        '`+ tipo + `',
                        `+ localizacion + `,
                        `+ longitud + `,
                        '`+ srcGif + `',
                        'user`+ id_usuario + `/',
                        false
                    );
    
                `;
                sequelize.query(query1, { type: sequelize.QueryTypes.INSERT }).
                    then(x => {
                        this.fileUpload(files, repository + '/user' + id_usuario + '/', nombre_archivo);
                        console.log('\n\n\n\n\nUpload Completed');
                        resolve(true);
                    }).catch(x => {
                        console.log('Error getIdFreeFile:   ' + x);
                        reject(false);
                    });

            });

        }).catch(x => {
            console.log('Unaxpective load ===>   ' + x);
        });
    });

}


//Service to get files
module.exports.getFileList = function (data) {
    var keym = data.keym;
    var id_caracteristica = data.id_caracteristica;
    var id_usuario = data.id_usuario;

    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        var query1 = `

            select * from archivos a, (select val_configuracion from configuracion_inicial where id = 1) as t1
            where keym_car = `+ keym + ` 
            and id_caracteristica = `+ id_caracteristica + ` 
            and id_usuario_car = `+ id_usuario + `
            and tipo = '`+data.tipo+`'  ;
        `;
        console.log(query1);
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {
                console.log('RESPONDE =======>    ' + JSON.stringify(x))
                resolve(x);
            }).catch(x => {
                resolve(false);
            }).done(x => {
                sequelize.close();
                console.log('Se ha cerrado sesion de la conexion a la base de datos');
            });;
    });

}

//Service to upload profile image
module.exports.imageProfileUpload = function (files, path) {

    var file;

    var result = '-1';

    if (!files) {
        result = '0';
        console.log("no existe archivo");
    }
    else {
        file = files.file;

        //var fina = file.name.replace(/\s/g, "");
        var fina = file.name = 'profile' + getExtension(file.name);

        file.mv(path + fina, function (err) {
            if (err) console.log("error " + err.toString());
            else console.log("carga exitosa");
        });

    }
}

//Service to upload files
module.exports.fileUpload = function (files, path, nom) {

    var file;
    var name = nom;
    console.log('\n\n\n\n Name    ' + name);
    if (name.length == 0)
        name = 'project-' + file.name;

    var result = '-1';
    console.log('REPOSITORY   ' + path);
    if (!files) {
        result = '0';
        console.log("no existe archivo");
    }
    else {
        file = files.file;
        //var fina = file.name.replace(/\s/g, "");
        var fina;
        if (name.length == 0)
            fina = name + getExtension(file.name);
        else
            fina = name;
        file.mv(path + fina, function (err) {
            if (err) console.log("error " + err.toString());
            else console.log("carga exitosa");
        });

    }
}


//===========     Auxiliar Funcions     =================//

// Join IDs to create the name
function joinNameFile(keym, id_archivo, id_usuario, nombre) {
    return new Promise((resolve, reject) => {
        console.log('\n\n\n\nNOMBRE FILE    ======>   ' + nombre);
        resolve(keym + '-' + id_archivo + '-' + id_usuario + '.' + getExtension(nombre));
    });
}

// return the extension te file
function getExtension(dat) {
    var cad = dat.split('.');
    return cad[cad.length - 1];
}

// Return the Free ID of the files
function getIdFreeFile(keym, id_usuario, nombre) {
    console.log('NOMBRE hahahaha ===>   ' + nombre);
    return new Promise((resolve, reject) => {
        var sequelize = sqlCon.configConnection();
        var query1 = `
            select max(id_archivo) as id_act from archivos 
            where keym_arc = `+ keym + ` 
            and id_usuario_arc = `+ id_usuario + `
        `;
        sequelize.query(query1, { type: sequelize.QueryTypes.SELECT }).
            then(x => {
                console.log('\n\n\n\n' + JSON.stringify(x) + '\n\n\n\n\n');
                if (x[0].id_act != null) {
                    console.log('NOT NULL ===>   ' + JSON.stringify(x));
                    var dat = [parseInt(x[0].id_act) + 1, nombre];

                    resolve(dat);
                }

                else {
                    console.log('NOT NULL ===>   ' + JSON.stringify(x));
                    var dat = [1, nombre];
                    resolve(dat);
                }

            }).catch(x => {
                console.log('Error getIdFreeFile:   ' + x);
                reject(false);
            });
    });
}
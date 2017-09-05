var express = require('express');
var Sequelize = require('sequelize');
var sqlCon = require('../config/connectionDb');
var router = express.Router();
var fs = require('fs');

var repository = '/run/media/admin/DATA/UDENAR/WORK/BACKUPS-SQL/SQL INSERT BENEFICIARIOS/Beneficiarios por resguardo/';

module.exports.insertData = function () {
  var keym = 0;
  var id_user = 5;
  var id_car = 31;
  var id_act = 30;
  var sum = 0;
  var sum_usu = 0;
  return new Promise((resolve, reject) => {
    var sequelize = sqlCon.configConnection();
    //Obtenemos IDS lista de resguardos que son IDS_PADRES para nuevas caracteristicas
    var qry_sel_resg = `select keym_car,id_caracteristica,id_usuario_car,nombre
      from actividades
      where nombre like 'Resguardo%' ;`;

    sequelize.query(qry_sel_resg, { type: sequelize.QueryTypes.INSERT })
      .then(x => {

        x.forEach(function (element) {
          //Leemos los archivos relacionados a la lista de resguardos => esta la lista de los beneficiarios
          //console.log('\nOK  ===>  '+repository+element.nombre+'.csv');
          console.log(element.nombre);
          fs.readFile(repository + element.nombre + '.csv', 'utf8', (err, data) => {
            var dat = data.split('\n');
            //console.log('\n\n'+dt.length);
            var dt = dat.length - 1;
            sum = sum + dat.length - 1;
            console.log("\n\n\nCAR    =>   " + JSON.stringify(element));
            if (dat.length > 0) {
              //console.log('\n\n\n\n'+data);

              dat.forEach(function (beneficiario) {
                id_car++;
                id_act++;
                //console.log("OKI ++++> " + element);
                var ben = beneficiario.split(',');
                sum_usu++;
                var qry_insert = `INSERT INTO caracteristicas

                              (
                                keym ,
                                id_caracteristica ,
                                id_usuario ,

                                keym_padre ,
                                id_caracteristica_padre ,
                                id_usuario_padre ,


                                estado ,
                                porcentaje_asignado ,
                                porcentaje_cumplido ,
                                tipo_caracteristica ,
                                visualizar_superior ,
                                usuario_asignado,
                                publicacion_web ,
                                porcentaje ,
                                fecha_inicio ,
                                fecha_ultima_modificacion ,
                                id_beneficiario
                              )
                              VALUES
                              (
                              `+ keym + `,` + id_car + `,` + id_user + `,
                              `+ element.keym_car + `,` + element.id_caracteristica + `,` + element.id_usuario_car + `,
                              'Iniciacion',
                              `+ (100 / dt) + `,
                              0,
                              'A',
                              true,
                              5,
                              false,
                              0,
                              '2017-08-31',
                              '2017-08-31',
                              `+ ben[3] + `
                              );

                              INSERT INTO actividades
                              (
                                keym,
                                id_actividad ,
                                id_usuario ,

                                keym_car ,
                                id_caracteristica ,
                                id_usuario_car ,

                                nombre ,
                                descripcion ,
                                pos ,
                                folder ,
                                fecha_ultima_modificacion
                              )
                              VALUES
                              (

                              `+ keym + `,` + id_act + `,` + id_user + `,
                              `+ keym + `,` + id_car + `,` + id_user + `,

                              'Beneficiario `+ ben[2] + `  ',
                              '`+ ben[0] + ` - ` + ben[1] + `',
                              0,
                              0,
                              '2017-08-31'
                              );`;
                //console.log(qry_insert);
                sequelize.query(qry_insert, { type: sequelize.QueryTypes.SELECT })
                  .then(y => {
                    console.log('OK  =>>  ' + sum_usu);
                  }).catch(y => {
                    console.log('BAD  ' + y);
                  });
              }, this);

            }

          });
        }, this);


      }).catch(x => {
        console.log('Error al registrar actividad ' + x);
        reject(false);
      }).done(x => {
        //sequelize.close();

        console.log('Se ha cerrado sesion de la conexion a la base de datos');
      });



  });
}


module.exports.insertCapitulos = function () {

  var keym = 0;
  var id_user = 5;
  var id_car = 1673;
  var id_act = 1672;
  var sum = 0;
  var sum_usu = 0;


  return new Promise((resolve, reject) => {
    var sequelize = sqlCon.configConnection();

    //Obtenemos IDS lista de resguardos que son IDS_PADRES para nuevas caracteristicas
    var qry_sel_car = `select
        keym,id_caracteristica,id_usuario
        from caracteristicas
        where id_beneficiario is not null;`;
    var inf_cap = [
      {
        nom: "01 - Obras Preliminares",
        per: 0.75
      },
      {
        nom: "02 - Cimentacion",
        per: 4.31
      },
      {
        nom: "03 - Estructura En Concreto",
        per: 27.45
      },
      {
        nom: "04 - Mamposteria",
        per: 10
      },
      {
        nom: "05 - Pisos",
        per: 4.10
      },
      {
        nom: "06 - Cubierta",
        per: 7.19
      },
      {
        nom: "07 - Instalaciones Hidraulicas",
        per: 1.93
      },
      {
        nom: "08 - Instalaciones Electricas",
        per: 4.28
      },
      {
        nom: "09 - Instalaciones Sanitarias",
        per: 3.71
      },
      {
        nom: "10 - Acabados",
        per: 19.25
      },
      {
        nom: "11 - Carpinterias",
        per: 7.58
      },
      {
        nom: "12 - Otros",
        per: 4.62
      },
      {
        nom: "13 - Pozo Séptico",
        per: 4.83
      },
      {
        nom: "14 - Construccion En Madera",
        per: 0
      }
    ];
    sequelize.query(qry_sel_car, { type: sequelize.QueryTypes.SELECT })
      .then(x => {
        x.forEach(function (res_qry_car) {

//console.log('\n\n\n\n'+JSON.stringify(res_qry_car));
          inf_cap.forEach(function (cap) {
            id_car++;
            id_act++;
            var qry_ins = `
              INSERT INTO caracteristicas
              (
                keym ,
                id_caracteristica ,
                id_usuario ,

                keym_padre ,
                id_caracteristica_padre ,
                id_usuario_padre ,


                estado ,
                porcentaje_asignado ,
                porcentaje_cumplido ,
                tipo_caracteristica ,
                visualizar_superior ,
                usuario_asignado,
                publicacion_web ,
                porcentaje ,
                fecha_inicio ,
                fecha_ultima_modificacion
              )
              VALUES
              (
                `+ keym + `,` + id_car + `,` + id_user + `,
                `+ res_qry_car.keym + `,` + res_qry_car.id_caracteristica + `,` + res_qry_car.id_usuario + `,
                'Iniciacion',
                `+ cap.per + `,
                0,
                'A',
                true,
                5,
                false,
                0,
                '2017-08-31',
                '2017-08-31'
              );

              INSERT INTO actividades
              (
                keym,
                id_actividad ,
                id_usuario ,

                keym_car ,
                id_caracteristica ,
                id_usuario_car ,

                nombre ,
                descripcion ,
                pos ,
                folder ,
                fecha_ultima_modificacion
              )
              VALUES
              (

                `+ keym + `,` + id_act + `,` + id_user + `,
                `+ keym + `,` + id_car + `,` + id_user + `,

                '`+ cap.nom + `',
                '`+ cap.nom + `',
                0,
                0,
                '2017-08-31'
              );
            `;
            //var sequelize1 = sqlCon.configConnection();
            sequelize.query(qry_ins, { type: sequelize.QueryTypes.SELECT })
              .then(x => {
                console.log('OK');
               })
              .catch(x => {
                console.log('BAD  '+x);

              })
              .done(x=>{

              });
          }, this);

        }, this);
      }).catch(x => {

      });
  });
}


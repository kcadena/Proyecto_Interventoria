const Sequelize = require('sequelize');


function configConnection() {
    var sqlCon = require('./connectionDb.js');
    const sequelize = new Sequelize('pstt', 'postgres', 'NJpost2016', {  //'NJpost2016'
        //host: 'knower.udenar.edu.co',
        host: 'localhost',
        dialect: 'postgres'
        
    });
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    return sequelize;
}

module.exports.configConnection=configConnection

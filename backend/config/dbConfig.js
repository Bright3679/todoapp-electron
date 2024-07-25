const sql = require('mssql');
require('dotenv').config({ path: '../../backend/.env' });

const config = {
    server: process.env.DB_SERVER,
    database:process.env.DB_DATABASE,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

function connectToDatabase() {
    sql.connect(config).then(connectionPool => {
        pool = connectionPool;
        if (pool.connected) {
            console.log('Connected to SQL Server');
        }
    }).catch(err => {
        console.error('Database connection failed', err);
    });    
}

module.exports = {
    connectToDatabase
};
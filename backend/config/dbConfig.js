const sql = require('mssql');
require('dotenv').config({ path: '../../backend/.env' });

const config = {
    server: process.env.DB_SERVER || "DESKTOP-NBH600P\\SQLEXPRESS",
    database:process.env.DB_DATABASE || "testdb",
    user:process.env.DB_USER || "sa",
    password:process.env.DB_PASSWORD|| "admin",
    port: process.env.DB_PORT || 1433,
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
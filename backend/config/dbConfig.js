const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const config = {
    server: process.env.DB_SERVER || '172.20.10.2',
    database: process.env.DB_DATABASE || "testdb",
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "admin",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        port: parseInt(process.env.DB_PORT || '1433', 10)
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
    console.log('DB_SERVER:', process.env.DB_SERVER);
  
}

module.exports = {
    connectToDatabase
};
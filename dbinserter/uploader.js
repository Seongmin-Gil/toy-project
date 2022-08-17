const fs = require('fs');
const { DataSource } = require('typeorm');
require('dotenv').config();

const appData = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const csv = fs.readFileSync('./test.csv', 'utf8').trim();

const tableName = 'users';
const rowDatas = csv.split('\r\n');
const colunms = rowDatas[0];

const rows = rowDatas.map(rowdata => rowdata.split(',')).slice(1);

appData.initialize()
    .then(() => {
        console.log('data server connnect')
        appData.query(
        `INSERT INTO ${tableName} (${colunms})
        VALUES ?;
        `, [rows]);
    })
    .catch((error) => console.log(error))
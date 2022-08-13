const { DataSource } = require('typeorm');
const fs = require('fs');
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
const result = [];
const rowData = csv.split('\r\n');
const colunms = rowData[0];
for (const data of rowData) {
    const dataWords = data.split(',');
    result.push(dataWords);
}
const datas = result.slice(1);
const colunmWords = result[0]
const tableName = 'users'
const obj = {};
const dataObjs = [];
for(const data of datas) {
    for (const index in colunmWords) {
        obj[colunmWords[index]] = data[index];
    }
    dataObjs.push(JSON.parse(JSON.stringify(obj)));
}

const insertDB = async(tableName, colunms, datas) => {
    await appData.query(`
    INSERT INTO ${tableName} (${colunms})
    VALUES (${datas.id}, "${datas.name}", "${datas.email}", "${datas.password}", "${datas.profile}");
    `)
}

appData.initialize()
    .then(()=> {
        console.log('data server connnect')
        for (const dataObj of dataObjs) {
            insertDB(tableName, colunms, dataObj);
            console.log('insert: ', dataObj);
        }
    })
    .catch((error)=> console.log(error))

console.log('--------done-------')


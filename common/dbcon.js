const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    host:process.env.DBURL,
    user:process.env.DBUSER,
    password:process.env.DBPASSWORD,
    database:process.env.DBNAME,
    multipleStatements:true
});
db.connect((err)=>{
    if(err){
        console.log('error in connection');
    }else{
        console.log('db connected');
    }
})

module.exports = db
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./common/dbcon');
const jwt = require('jsonwebtoken');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const verifyToken = (req,res,next) => {
    const token = req.headers['token'];
    if(!token){
        return res.json({"Result":"Token is missing."});
    }else{
        jwt.verify(token,"jwtSecretKey",(err,decoded) => {
            if(err){
                res.json({"Result":err});
            }else{
                req.isAdmin = decoded.idAdmin;
                next();
            }
        })
    }
}

app.post('/api/login', (req,res) => {
    db.query("select * from admin where username=? and password=?", [req.body.username,req.body.password],(err,rows,fields) =>{
        if(err){
            return res.json("Error, Bad request.");
        }
        if(rows.length>0){
            const idAdmin = rows[0]["idadmin"];
            const token = jwt.sign({idAdmin},"jwtSecretKey",{expiresIn:300});
            return res.json({"Result":true,token});
        }else{
            return res.json("Fail, Invalid Username/Password.");
        }
        //res.send(rows);
    });
});

app.get('/api/listNews',verifyToken,(req,res)=>{
    db.query("select * from news",(err,rows) =>{
         res.send(rows);
    })
});

app.post('/api/addNews',verifyToken,(req,res)=>{
    db.query("insert into news set title=?,post_date=NOW(),details=?,status=?",[req.body.title,req.body.details,req.body.status],(err,rows) =>{
        if(err){
            res.json({"Result":"Error occured, please check with administrator."});
        }else{
            res.json({"Result":"News added successfully."});
        }
    })
});

app.get('/',(req,res) => {
        res.json({"Result":"Invalid method called."});
});

const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`Listening at ${port}...`));
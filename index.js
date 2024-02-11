const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./common/dbcon');
const jwt = require('./common/jwtToken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/login', (req,res) => {
    db.query("select * from admin where username=? and password=?", [req.body.username,req.body.password],(err,rows,fields) =>{
        if(err){
            return res.json({"Result":false,"Msg":"Bad request."});
        }
        if(rows.length>0){
            const idu = rows[0]["idadmin"];
            const token = jwt.signToken(idu);
            return res.json({"Result":true,token});
        }else{
            return res.json({"Result":false,"Msg":"Invalid Username/Password."});
        }
        //res.send(rows);
    });
});

app.get('/api/listNews',jwt.verifyToken,(req,res)=>{
    db.query("select * from news",(err,rows) =>{
         res.send(rows);
    })
});

app.post('/api/addNews',jwt.verifyToken,(req,res)=>{
    db.query("insert into news set title=?,post_date=NOW(),details=?,status=?",[req.body.title,req.body.details,req.body.status],(err,rows) =>{
        if(err){
            res.json({"Result":false,"Msg":"Error occured, please check with administrator."});
        }else{
            res.json({"Result":true,"Msg":"News added successfully."});
        }
    })
});

app.put('/api/updateNews',jwt.verifyToken,(req,res)=>{
    db.query("update news set title=?,details=?,status=? where id=?",[req.body.title,req.body.details,req.body.status,req.body.id],(err,rows) =>{
        if(err){
            res.json({"Result":false,"Msg":"Error occured, please check with administrator."});
        }else{
            if(rows.affectedRows>0){
                res.json({"Result":true,"Msg":"News updated successfully."});
            }else{
                res.json({"Result":false,"Msg":"Record not found."});
            }
            
        }
    })
});

app.delete('/api/deleteNews',jwt.verifyToken,(req,res)=>{
    db.query("delete from news where id=?",[req.body.id],(err,rows) =>{
        if(err){
            res.json({"Result":false,"Msg":"Error occured, please check with administrator."});
        }else{
            res.json({"Result":true,"Msg":"News deleted successfully."});
        }
    })
});

app.put('/api/changePassword',jwt.verifyToken,(req,res)=>{
    db.query("update admin set password=? where idadmin=?",[req.body.password,req.decoded.idu],(err,rows) =>{
        if(err){
            res.json({"Result":false,"Msg":"Error occured, please check with administrator."});
        }else{
            if(rows.affectedRows>0){
                res.json({"Result":true,"Msg":"Password updated successfully."});
            }else{
                res.json({"Result":false,"Msg":"User not found."});
            }
        }
    });
});

app.get('/',(req,res) => {
        res.json({"Result":"Invalid method called."});
});

const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`Listening at ${port}...`));
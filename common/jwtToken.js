const jwt = require('jsonwebtoken');

const signToken = (idu) => {
    return jwt.sign({idu},"jwtSecretKey",{expiresIn:300});
}

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

module.exports = {signToken,verifyToken}
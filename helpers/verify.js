const jwt = require("jsonwebtoken");

module.exports.verify = (req,res,next)=>{
    let auth = req.get("Authorization");
    jwt.verify(auth,process.env.SECRET,(err,data)=>{
        if(err)
            return res.json({err});
        req.decodedData = data;
        next();
    });
};
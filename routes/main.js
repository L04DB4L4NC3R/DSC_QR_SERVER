const router = require("express").Router();
const jwt = require("jsonwebtoken");
const urlmodel = require("../schema/schema").urlmodel;
const verify = require("../helpers/verify").verify;

router.post("/admin",(req,res,next)=>{
    if(req.body.name === process.env.ADMIN_NAME && req.body.password === process.env.ADMIN_PASS){
        jwt.sign({
            name:req.body.name,
            level:"admin"
        },process.env.SECRET,(err,token)=>{
            if(err)
                next(err);
            res.json({token});
        });
    } else{
        next(new Error("Wrong ID or password"));
    }
});





router.post("/admin/seturl",verify,(req,res,next)=>{
    urlmodel.find({})
    .then((d)=>{
        if(d.length===0){
            urlmodel.create({
                url:req.body.url
            }).then(u=>res.json({new:req.body.url}))
            .catch(next)
        } else{
            urlmodel.remove(d[0])
            .then(()=>{
                urlmodel.create({
                    url:req.body.url
                }).then(u=>res.json({old:d[0].url,new:req.body.url}))
                .catch(next)
            }).catch(next);
        }
    }).catch(next);
});


router.get("/",async (req,res,next)=>{
    let url = await urlmodel.find({});
    if(!url)
        return next(new Error("No url found"));
    res.redirect(url[0].url);
});


module.exports = router;
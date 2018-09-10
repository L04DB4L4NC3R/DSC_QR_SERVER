const router = require("express").Router();
const jwt = require("jsonwebtoken");
const urlmodel = require("../schema/schema").urlmodel;
const verify = require("../helpers/verify").verify;



router.get("/admin",(req,res,next)=>{
    res.render("admin");
});

/**
 * @api {post} /admin admin login
 * @apiName admin login
 * @apiGroup admin
 * 
 * @apiParam {string} name username of the admin
 * @apiParam {string} password password of the admin
 * 
 * @apiParamExample {json} response-example
 * {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicm9vdCIsImxldmVsIjoiYWRtaW4iLCJpYXQiOjE1MzY1OTAwNTB9.OuY7qSRUZNrG9AWk_kl0pejhFJg1hJkBleWxPtVwVDs"
}
 */
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
        res.json({
            message:"Wrong ID or password"
        });
    }
});




/**
 * @api {post} /admin/seturl set url
 * @apiName set url
 * @apiGroup admin
 * @apiPermission admin
 * 
 * @apiParam {string} url url to be updated
 * 
 * @apiParamExample {json} response-example
 * {
    "old": "https://www.google.com/",
    "new": "https://www.youtube.com/"
}
 */
router.post("/admin/seturl",verify,(req,res,next)=>{
    urlmodel.find({})
    .then((d)=>{
        if(d.length===0){
            urlmodel.create({
                url:req.body.url
            }).then(u=>res.json({new:req.body.url}))
            .catch(next)
        } else{
            urlmodel.deleteMany({})
            .then(()=>{
                urlmodel.create({
                    url:req.body.url
                }).then(u=>res.json({old:d[0].url,new:req.body.url}))
                .catch(next)
            }).catch(next);
        }
    }).catch(next);
});



/**
 * @api {get} / redirect to url
 * @apiName redirect to url
 * @apiGroup all
 * 
 */
router.get("/",async (req,res,next)=>{
    let url = await urlmodel.find({});
    if(!url)
        return res.json({
            message:"No url in database"
        });
    res.redirect(url[0].url);
});


router.get("/admin/geturl",verify,(req,res,next)=>{
    urlmodel.find({})
    .then((u)=>{
        if(u.length === 0)
            return res.send({url:''});
        res.json({url:u[0].url});
    });
});



router.get("/admin/seturl",(req,res,next)=>{
    res.render("seturl");
});

module.exports = router;
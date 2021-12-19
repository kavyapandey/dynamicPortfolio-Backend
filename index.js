const express = require("express");
const app = express();
const cors = require ('cors');
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
 const bcryptjs =require("bcrypt");
//const url = "mongodb://localhost:27017";
const url = "mongodb+srv://kavya:kavya123@cluster0.ddsyl.mongodb.net?retryWrites=true&w=majority";

 
app.use(cors({
    origin : "*"
}))


app.use(express.json());
app.post("/signin",async function(req,res){
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("dynamic_portfolio")
        let user = await db.collection("users").findOne({username:req.body.username})
        if(user){
        let matchPassword = bcryptjs.compareSync(req.body.password,user.password)
        if(matchPassword){
            res.json({
                message :("Logged in as",user.username),
                status : true
            })
        }else{
           return res.status(404).json({
                message : "Password Incorrect",
                status : false
            })
        }
        }else{
           return res.status(404).json({
                message : "User Not found ! Please register",
                status : false
            })
        }
       await client.close();
    res.json({
        message:"user registered"
        
    })
    } catch (error) {
        console.error();
        res.status(500).json({
            message : "something went wrong"
        })
        
    }
    
}

)
app.post("/register",async function(req,res){
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("dynamic_portfolio")
        let salt =bcryptjs.genSaltSync(10);
        let hash = bcryptjs.hashSync(req.body.password,salt);
        req.body.password=hash;
        let data = await db.collection("users").insertOne(req.body)
       await client.close();
    res.json({
        message:"user registered"
        
    })
    } catch (error) {
        console.error();
        res.status(500).json({
            message : "something went wrong"
        })
        
    }
    
}

)
app.listen(process.env.PORT || 3000, function(){
    console.log("this app is listening in port 3000");
})


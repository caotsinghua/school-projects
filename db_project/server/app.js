const express =require("express")
const bodyParser=require("body-parser")
const cookies =require("cookies")
const cors =require("cors")
const apiRoute=require('./routes/api')
const adminRoute=require('./routes/admin')
let app=express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
//跨域
app.use(cors({
    origin:'*',
    credentials:true,
    allowedHeaders:['Content-Type', 'Authorization','Accept','X-Requested-With']
}));

app.use('/api',apiRoute);
app.use('/admin',adminRoute);
app.listen(3000,err=>{
    if(!err){
        console.log('server running on port 3000')
    }
})
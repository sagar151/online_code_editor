const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const Job=require('./models/Job')
const app=express();
const {addJobToQueue}=require("./jobQueue")
const {generateFile}=require('./generateFile');
// const {executeJS}=require('./executeJS')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())
mongoose.connect('mongodb://localhost/compiler',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
},(err)=>{
    if (err) {
        console.error(err);
    }
    console.log("database connected")
})
app.post("/run",async(req,res)=>{
    const {language="cpp",code}=req.body;
    if (code===undefined) {
        return res.status(400).json({success:false,error:'code is empty'})
    }
    
        const filepath=await generateFile(language,code);
        console.log("filepath indexJs",filepath);
        // const jsoutput=await executeJS(filePath)
        const job=await new Job({language,filepath}).save();
        const jobId=await job["_id"];
        console.log("jobid",job);
        addJobToQueue(jobId);
        res.status(201).json({jobId})
    
   
})
app.get("/status",async(req,res)=>{
    const jobId=req.query.id;
    if(jobId===undefined){
        return res.status(400).json({success:false,error:"missing id query paramiter"})
    }
    const job =await Job.findById(jobId);
    if(job===undefined){
        return res.status(400).json({success:false,error:"job not found"})
    }
    return res.status(200).json({success:true,job})
})

app.listen(8080,()=>{
    console.log('port is 8080');
})
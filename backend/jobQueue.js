const Queue=require("bull")
const Job =require("./models/Job");
const {executeCpp}=require("./executeCpp");
const {executeJS}=require("./executeJS");
const {executePy}=require("./executePy")
// const { model } = require("mongoose");

const jobQueue=new Queue("job-runner-queue");
jobQueue.process(5,async({data})=>{
    const jobId=data.id;
    const Job=Job.findById(jobId);
    try {
        let output;
        Job["startedAt"]=new Date;
        if (Job.language==="cpp") {
            output=await executeCpp(Job.filepath);
        }
        else if (Job.language==="js") {
            output=await executeJS(Job.filepath);
        }
        else {
            output=await executePy(Job.filepath)
        }
        Job["createdAt"]=new Date();
        Job["output"]=output;
        Job["status"]="success";
        await Job.save();
        
    } catch (error) {
        Job["competedAt"]=new Date();
        Job["output"]=JSON.stringify(error);
        Job["status"]="error"
        throw Error(JSON.stringify(error))
    }
})
jobQueue.on("failed",(error)=>{
    console.error(error.data.id,error.failedReason);
});
const addJobToQueue=async(jobId)=>{
    jobQueue.add({
        id:jobId
    })
}
module.exports={
    addJobToQueue,
}
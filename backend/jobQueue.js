const Queue=require("bull")
const Job =require("./models/Job");
const {executeCpp}=require("./executeCpp");
const {executeJS}=require("./executeJS");
const {executePy}=require("./executePy")
// const { model } = require("mongoose");

const jobQueue=new Queue("job-runner-queue");

jobQueue.process(5,async({data})=>{
    const jobId=data.id;
    const job= await Job.findById(jobId);
    console.log("JOb in queue",Job)
    try {

        let output;
        job["startedAt"]=new Date;
        if (job.language==="cpp") {
            output=await executeCpp(job.filepath);
        }
        else if (job.language==="js") {
            output=await executeJS(job.filepath);
        }
        else {
            output=await executePy(job.filepath)
        }
        job["createdAt"]=new Date();
        job["output"]=output;
        job["status"]="success";
        await job.save();
        
    } catch (error) {
        job["competedAt"]=new Date();
        job["output"]=JSON.stringify(error);
        job["status"]="error"
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
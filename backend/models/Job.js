const mongoose=require('mongoose');

const JobSchema=mongoose.Schema({
    language:{
        type:String,
        // required:true,
        enum:["cpp","py","js"],
    },
    filepath:{
        type:String,
        // required:true,
    },
    submitedAt:{
        type:Date,
        default:Date.now,
    },
    startedAt:{
        type:Date,

    },
    compeledAt:{
        type:Date,
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","success","error"],
    },
    output:{
        type:String
    }
})
module.exports=mongoose.model("job",JobSchema)
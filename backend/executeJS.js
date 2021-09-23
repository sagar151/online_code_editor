// const { rejects } = require('assert');
const  {exec}=require('child_process')
const executeJS=(filepath)=>{
 
    return new Promise((resolve,reject)=>{
        exec(
            `node ${filepath}`,(error,stdout,stderr)=>{
                if(error){
                    reject({error,stderr})
                }
                if (stderr) {
                    reject({stderr});
                }
                resolve(stdout)
            }
        )
    })
}
module.exports={
    executeJS,
}
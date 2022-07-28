const { MongoClient, ObjectId } = require('mongodb')
const bcrypt = require('bcrypt');

const url =  process.env.DATABASE_URL;

function compId(body){
    
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {
            console.log("connected");
         
            
            const email= body
            console.log(email)
        
            result.db("database").collection('userdata').findOne({ username: email })
             .then((res) => {
                    console.log(res)
                    resolve(res);
                })

        })
    })


}
module.exports ={compId} ;
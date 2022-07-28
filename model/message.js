const { MongoClient } = require('mongodb')
var { ObjectId } = require('mongodb');

const url =  process.env.DATABASE_URL;
function addMessage(body) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {
            console.log("connected");
            
            const { name, email, number, product,quantity, message, user_id } = body
            result.db("database").collection('message').insertOne({
                name:name,email:email,number:number,
                product:product, quantity:quantity,message:message, user_id:user_id
            })
                .then((res) => {
                    console.log(res);
                    resolve(res);
                })

        })
    })


}



function getMessage() {
    return new Promise((resolve, reject) =>{
        MongoClient.connect(url,(err,result)=>{
            console.log("connected");
            if(err) reject(err);
            else result.db("database").collection('message').find().toArray()
                .then((res)=>{
                   
                    resolve(res);
                })
            }) 
    })
    
   
}
module.exports ={addMessage,getMessage};
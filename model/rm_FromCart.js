const {MongoClient,ObjectId} = require('mongodb')


const url = process.env.DATABASE_URL;


function rmFromCart(c_productID,userId){
    return new Promise((resolve, reject) =>{
        MongoClient.connect(url).then(client=>{
            console.log("from model : "+c_productID,userId)
            return client.db('database').collection('userdata').updateOne(
                    {_id: new ObjectId(userId)},
                    {$pull:{cart:{_id:new ObjectId(c_productID)}}}
                )
        }).then(()=>{
            resolve()
        })
    })
}

module.exports = {rmFromCart}
const {MongoClient,ObjectId} = require('mongodb')

const url =  process.env.DATABASE_URL;

function updateUser_cart(userID,productID,quantity,T_total){
    let quantityPR = quantity
  
    return new Promise((resolve, reject)=>{
        console.log(quantityPR,productID,userID);
        MongoClient.connect(url).then(client=>{
            client.db('database').collection('userdata').updateOne({
                _id: new ObjectId(userID),
                'cart._id': new ObjectId(productID),
            },
            {
                $set: {
                    'cart.$.Quantity': quantityPR,
                    'cart.$.T_price': T_total
                }

            })
            client.db('database').collection('product').findOne({_id: new ObjectId(productID)}).then(product=>{
                console.log(product.Prise)
                resolve(Number(product.Prise));

            })
        })

            
       
    })
}
module.exports = updateUser_cart
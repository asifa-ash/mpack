const { MongoClient, ObjectId } = require('mongodb')
const bcrypt = require('bcrypt');

const url =  process.env.DATABASE_URL;


function getData(body, id) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {
            console.log("connected");
            if (err) reject(err);
            else console.log(body)

            if (id && !body) {
                result.db('database').collection('userdata').findOne({ _id: new ObjectId(id) }).then(data => {
                    resolve(data);
                })
            } else if (!id && !body) {
                result.db('database').collection('userdata').find().toArray().then((users) => {
                    resolve(users);

                })

            } else if (!id && body) {
                const { email, password } = body
                 
                result.db("database").collection('userdata').findOne({ username: email })
                    .then((doc) => {
                        if (doc) {
                            bcrypt.compare(password, doc.password).then((state) => {
                                if (state) {
                                    resolve({ data: doc, status: 200 })
                                    console.log('password is correct');

                                } else {
                                    resolve({ data: null, status: 206 })
                                    console.log("password mismatch");
                                }

                            })

                        } else {
                            resolve({ data: doc, status: 204 })

                        }
                    })
            }

        })
    })


}

function UserCart_add(userId, productId) {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then((result) => {
            
            result.db('database').collection('product').findOne({ _id: new ObjectId(productId) }).then(product => {
                result.db('database').collection('userdata').findOne({_id: new ObjectId(userId),cart:{$elemMatch: {_id: new ObjectId(productId)}}}).then(got=>{
                    console.log(got)
                    if(!got){
                        console.log("Quantity",product.Quantity=1)
                        result.db('database').collection('userdata').updateOne({_id: new ObjectId(userId)},{$push:{cart: product}}).then(()=>{
                            result.db('database').collection('userdata').updateOne({_id: new ObjectId(userId),'cart._id': new ObjectId(productId)},{$set:{'cart.$.T_price':product.Prise}})
                        })

                        resolve({status: 200})
                    }else{

                        // increment product quantity  when the same product add to the cart here $ is indicate index of product in cart
                        result.db('database').collection('userdata').updateOne({_id: new ObjectId(userId),'cart._id': new ObjectId(productId)},{$inc:{'cart.$.Quantity':1}})
                        
                    }
                })

            })
        })

    })
}






function addToOrder( productId) {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {

            if (!err) {
                result.db('database').collection('product').findOne({ _id: new ObjectId(productId) }).then(product => {

                    resolve(product)
                    console.log(product)


                })


            } else {
                console.log(err);
            }



        })
    })

}

function removeProfile(userID) {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(client => {
            console.log("hi",userID);

            return client.db('database').collection('userdata').deleteOne({_id: new ObjectId(userID) })
        }).then(() => {
            resolve()
        })
    })
}

function updateProfile(name1,name2,username,id) {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(client => {
    

            return client.db('database').collection('userdata').updateOne({_id: new ObjectId(id) },{$set:{name1:name1,name2:name2,username:username}})
        }).then(() => {
            resolve()
        })
    })
}



module.exports = { getData, UserCart_add, addToOrder,removeProfile,updateProfile };

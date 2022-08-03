const { MongoClient, ObjectId } = require('mongodb');
const stripe = require('./strip.config');





const url = process.env.DATABASE_URL;



function myOrder(userID, productID, total_price, oneItemID_from_cart, oneProduct) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(client => {
            if (!productID) {
                if (!oneProduct) {
                    client.db('database').collection('userdata').findOne({ _id: new ObjectId(userID) }).then(data => {
                        client.db('database').collection('address').findOne({ userId: userID }).then(address => {
                            let cart = data.cart.map(el => {
                                return {
                                    name: el.Name,
                                    productID: el._id,
                                    quantity: el.Quantity,
                                    price: el.Prise,
                                    total_price: el.T_price,

                                }

                            })

                            let checkout = {
                                userID: data._id,
                                email: data.username,
                                name: `${data.name1} ${data.name2}`,
                                products: cart,
                                Address: address,
                                delivered: false,
                                date: new Date().toLocaleDateString()
                            }
                            client.db('database').collection('checkouts').insertOne(checkout).then(resolve({ url: `/success?_Uid=_${userID}` }))
                        })

                    })

                } else {

                    client.db('database').collection('userdata').findOne({ _id: new ObjectId(userID) }).then(data => {
                        client.db('database').collection('address').findOne({ userId: userID }).then(address => {
                            console.log("oneItem", oneItemID_from_cart);
                            let cart = data.cart.map(el => {
                                if (oneItemID_from_cart == el._id) {
                                    return {
                                        name: el.Name,
                                        productID: el._id,
                                        quantity: el.Quantity,
                                        price: el.Prise,
                                        total_price: el.T_price,

                                    }
                                }

                            })

                            let checkout = {
                                userID: data._id,
                                email: data.username,
                                name: `${data.name1} ${data.name2}`,
                                products: cart,
                                Address: address,
                                delivered: false,
                                date: new Date().toLocaleDateString()
                            }
                            client.db('database').collection('checkouts').insertOne(checkout).then(resolve({ url: `/success?_Uid=_${userID}` }))
                        })

                    })

                }

            } else {
                client.db('database').collection('product').findOne({ _id: new ObjectId(productID) }).then(data => {
                    client.db('database').collection('userdata').findOne({ _id: new ObjectId(userID) }).then(userData => {
                        client.db('database').collection('address').findOne({ userId: userID }).then(address => {

                            let checkout = {
                                userID: userData._id,
                                email: userData.username,
                                name: `${userData.name1} ${userData.name2}`,
                                products: [{
                                    name: data.Name,
                                    productID: data._id,
                                    quantity: 1,
                                    price: data.Prise,
                                    total_price: data.Price,
                                }],
                                Address: address,
                                delivered: false,
                                date: new Date().toLocaleDateString()
                            }
                            client.db('database').collection('checkouts').insertOne(checkout).then(resolve({ url: `/success?_Uid=_${userID}` }))
                        })


                    })
                })
            }
        })
    })
}
function getOrder(userId) {
    console.log(userId)

    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then((client) => {
            client.db('database').collection('userdata').findOne({ _id:new ObjectId(userId) }).then((data) => {
                console.log(data)
                client.db('database').collection('checkouts').find({email: data.username}).toArray().then((checkouts) => {
                    console.log(checkouts)
                    resolve(checkouts)
                })
            })
        }).catch(err => console.log(err));

    })


}
async function onlineCheckouts(userID) {


    let session = await stripe.checkout.sessions.list();
    session.data.forEach((checkouts) => {
        let checkout = {}
        if (checkouts.payment_status == 'paid') {
            stripe.checkout.sessions.listLineItems(checkouts.id, (err, lineItems) => {
                MongoClient.connect(url).then(client => {
                    client.db('database').collection('checkouts').findOne({checkout_id:checkouts.id}).then(chk_res=>{
                        if(!chk_res){
                            client.db('database').collection('address').findOne({userId:userID}).then(address=>{
                                checkout = {
                                    checkout_id:checkouts.id,
                                    userID: userID,
                                    email: checkouts.customer_details.email,
                                    name: checkouts.customer_details.name,
                                    products: lineItems.data.map(item => {
                                        return {
                                            name: item.description,
                                            quantity: item.quantity,
                                            price: (item.amount_total / 100) / item.quantity,
                                            total_price: item.amount_total / 100
                                        }
                                    }),
                                    delivered: false,
                                    Address:address,
                                    date: new Date().toLocaleDateString()
                                }
                                MongoClient.connect(url).then(client => {
                                    client.db('database').collection('checkouts').insertOne(checkout)
                                })
        
                            })
                        }
                        
                    })
                    
                })

               

            })


        }

    })


}



function getOrderAdmin() {


    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then((client) => {
            
                
                client.db('database').collection('checkouts').find().toArray().then((checkouts) => {
                    
                    resolve(checkouts)
                })
            
        }).catch(err => console.log(err));

    })


}

function removeOrder(Id) {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(client => {
            console.log(Id);
            return client.db('database').collection('checkouts').updateOne({ _id:new ObjectId(Id) },{$set:{delivered:true}})
        }).then(() => {
            resolve()
        })
    })
}
module.exports = { myOrder, getOrder, onlineCheckouts,getOrderAdmin,removeOrder }
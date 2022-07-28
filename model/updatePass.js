const { MongoClient } = require('mongodb')
var { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
let saltRound = 10;

const url = process.env.DATABASE_URL;
function updatePass(body) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {
            console.log("connected");

            const { userPass, userID } = body
            console.log(userPass, userID)
            result.db("database").collection("userdata").findOne({ _id: new ObjectId(userID) }).
                then(doc => {
                    //doc.password(hashed) and userPass(no hashed) need to compare
                    bcrypt.compare(userPass, doc.password).then(result_ => {
                        if (result_) {
                            resolve(result_)

                        } else {

                            bcrypt.hash(userPass, saltRound).then((hash, err) => {

                                result.db("database").collection('userdata').updateOne({ _id: new ObjectId(userID) }, { $set: { password: hash } })
                                    .then((res) => {
                                        
                                        resolve(result_);
                                    })
                
                            })


                        }
                    })


                })
            
        })

    })


}

module.exports = { updatePass }

const { MongoClient } = require('mongodb')
const bcrypt = require('bcrypt');
let saltRound = 10;



const url =  process.env.DATABASE_URL;
function getSignData(body) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {
            console.log("connected");
            if (err) reject(err);
            else {
                const { name1, name2, email, password } = body

                bcrypt.hash(password, saltRound).then((hash, err) => {
                    result.db("database").collection('userdata').findOne({ username: email })
                        .then((res) => {
                            if (res) {
                                console.log("already exist")
                                resolve({ status: 409, data: res });
                            } else {
                                result.db("database").collection('userdata').insertOne({ username: email, password: hash, name1: name1, name2: name2,cart:[] })
                                    .then(() => {

                                        console.log(res);
                                        resolve({ status: 200, data: null });
                                    })
                            }

                        })

                })
            }


        })
    })


}

module.exports = getSignData;
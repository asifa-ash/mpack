const { MongoClient } = require('mongodb')
const url = process.env.DATABASE_URL;
function addAddress(body) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, result) => {
            console.log("connected");

            const { firstName, lastName, email, mobileNumber, pincode, address, userId } = body
            result.db("database").collection('address').insertOne({
                firstName: firstName, lastName: lastName, email: email,
                mobileNumber: mobileNumber, pincode: pincode, address: address, userId: userId
            })
                .then((res) => {
                    console.log(res);
                    resolve(res);
                })

        })
    })


}
function getAddress(userID) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, result) => {
            console.log("connected");
            if (err) reject(err);
            else console.log(userID)
            result.db("database").collection('address').findOne({ userId: userID })
                .then((res) => {
                    resolve(res);
                })
        })
    })


}
function removeAddress(userID) {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url).then(client => {
            console.log("hi", userID);
            return client.db('database').collection('address').deleteOne({ userId: userID })
        }).then(() => {
            resolve()
        })
    })
}

module.exports = { addAddress, getAddress, removeAddress };
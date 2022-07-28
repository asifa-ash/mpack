const {MongoClient}= require('mongodb')

    const url= process.env.DATABASE_URL;


function getAdminData(body){
    return new Promise((resolve, reject) =>{
        MongoClient.connect(url,(err,result)=>{
            console.log("connected");
            if(err) reject(err);
            else console.log(body)
            const {email, password} =body
                result.db("database").collection('admindata').findOne({username:email,password:password })
                .then((res)=>{
                    console.log(res);
                    resolve(res);
                })
            })  
    })
    

   
}
module.exports ={getAdminData};

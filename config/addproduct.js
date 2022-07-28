const {MongoClient}= require('mongodb')
var {ObjectId} = require('mongodb');

    const url= process.env.DATABASE_URL;
    function addData(body,fileName){
        return new Promise((resolve, reject) =>{
            MongoClient.connect(url,(err,result)=>{
                console.log("connected");
                if(err) reject(err);
                else console.log(body)
                const {name,prise,size, color,gsm,Quantity,material,offer} = body
                    result.db("database").collection('product').insertOne({Name:name,Prise:prise,size:size,color:color,GSM:gsm,
                        Quantity:Quantity,Material:material,Offer:offer,image:fileName})
                    .then((res)=>{
                        console.log(res);
                        resolve(res);
                    })
                }) 
        })
        
       
    }

    function getProduct(){

        return new Promise((resolve, reject) =>{
            MongoClient.connect(url).then((client)=>{

                    console.log('connect')
                    client.db('database').collection('product').find().toArray().then(result=>{

                        resolve(result)

                    })
        

            }).catch(err=>console.log(err));
            
        })
    
    }

function getOneProduct(body){
    return new Promise((resolve, reject) =>{
        MongoClient.connect(url).then((client)=>{
         
            let {id} = body;
            id = id?id:body;
            console.log(id);

                console.log('connect')
                client.db('database').collection('product').findOne({"_id":new ObjectId(id)}).then(result=>{
                  
                    resolve(result)

                })
    

        }).catch(err=>console.log(err));
        
    })


}



    
    module.exports ={  getOneProduct,addData,getProduct};
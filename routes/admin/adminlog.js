


const { MongoClient } = require('mongodb')

const url = process.env.DATABASE_URL;
var { ObjectId } = require('mongodb');



var express = require('express');
var router = express.Router();
let { getAdminData } = require('../../config/admindata')
const { addData, getOneProduct, getProduct } = require('../../config/addproduct');
const { getData } = require('../../config/userData');
const { getMessage } = require('../../model/message');


const stripe = require('../../config/strip.config');
const {getOrderAdmin,removeOrder} = require('../../config/myOrder')




/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/admin/product')
});



// get admin log in..............................................
router.get('/login', function (req, res, next) {
  res.render('admin/adminlogin');
});




// post login.............................................
router.post('/login', function (req, res, next) {
  getAdminData(req.body).then((data) => {
    if (data) {


      res.redirect('/admin')
    } else {

      res.redirect('/admin/login')
    }
  })
});


// get signup.......................................................................................

router.get('/signup', function (req, res, next) {
  res.render('admin/adminsignup');
});


// get products........................................................................


router.get('/add-product', function (req, res, next) {
  res.render('admin/addProduct');
});




//  post  add product............................................

router.post('/add-product', function (req, res, next) {
  console.log(req.files.image)
  let extname = req.files.image.mimetype
  extname = extname.split('/')[1]

  let path = __dirname + '../../../public/images/' + req.files.image.md5 + '.' + extname
  let fileName = req.files.image.md5 + '.' + extname

  req.files.image.mv(path, (err) => {
    if (!err) {
      console.log("Done");
    } else {
      console.log(err)
    }

  })

  addData(req.body, fileName).then((data) => {
    if (data) {

      res.redirect('/admin/product')
    } else {

      res.redirect('/admin/add-product?status=500')
    }
  })

})


// get show product page............................................


router.get('/product', function (req, res) {
  getProduct().then((data) => {
    res.render('admin/view-product', { data });
    console.log(data)
  })

});



// get edit section................................







// post edit.................................................

router.get('/edit',(req, res) => {
  productID = req.url?req.url.split('?')[1]:null
 
  if(productID){

    getOneProduct(productID).then(data=>{
      res.render('admin/proedit',{data})

    })

  }
})



// update  edited data...........................................................




router.post('/update', (req, res) => {
  console.log(req.body)

  let { id,name, prise, size, color, gsm, quantity, material, offer, image } = req.body;
  console.log(name,prise,size);
  
  MongoClient.connect(url, (err, result) => {

    if (err) console.log(err)
    else {

      result.db("database").collection('product').updateOne({ "_id": new ObjectId(id) }, {
        $set: {
          Name: name, Prise: prise,
          Size: size, color: color, GSM: gsm, Quantity: quantity, Material: material, Offer: offer
        }
      })
        .then(result => {
          res.redirect('/admin/product')


        })

    }

  })
})
// ..............................................................................



// delete product in admin........................................................
router.post('/delete', (req, res) => {
  console.log(req.body);
  let { id } = req.body;
  console.log(id);
  MongoClient.connect(url, (err, result) => {


    result.db("database").collection('product').deleteOne({ "_id": new ObjectId(id) }).then((e) => {
      console.log("Deleted");
      res.redirect('/admin/product');
    })

  })

})

//  get userdata .......................................


router.get('/userData', function (req, res, next) {
  getData().then((arr) => {
    console.log(arr)

    res.render('admin/userdata', { arr });
  })
});


// ...............get view order...................................................
router.get('/view-order', async (req, res) => {

  getOrderAdmin().then(orderData=>{
    console.log(orderData)

    res.render('admin/view-order',{orderData})
  })

});





// get message......................................................................

router.get('/message', (req, res) => {

  getMessage().then(msg => {
    console.log(msg)
    res.render('admin/message', { msg })
  })
});
//  remove order from order....................
router.get('/removeOrder', (req, res) => {
 
let Id=req.url.split('?')[1]
console.log('from order',Id)
  removeOrder(Id).then(() => {
    
    res.redirect('/admin/view-order')
  })
});















module.exports = router;

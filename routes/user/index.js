var express = require('express');
const { getProduct, getOneProduct } = require('../../config/addproduct');
const { user, status } = require('../../config/status');
const { UserCart_add, getData, addToOrder, removeProfile, updateProfile } = require('../../config/userData');
const { rmFromCart } = require('../../model/rm_FromCart');

const { addAddress, getAddress, removeAddress } = require('../../config/addAddress');
const { addMessage } = require('../../model/message');
const { updatePass } = require('../../model/updatePass')
const { myOrder, getOrder, onlineCheckouts } = require('../../config/myOrder');

const updateUser_cart = require('../../model/updateCart_f-user');
const bcrypt = require('bcrypt');
const stripe = require('../../config/strip.config');
const { encode, decode } = require('../../utils/jwt');

var router = express.Router();
let proDetails = {};
let user_address = {};


/* GET home page. */
router.get('/', function (req, res, next) {

  getProduct().then(data => {

    res.render('user/index', { data });
  })
});

// cart................................................................................................
router.get('/add-to-cart/id', (req, res) => {

  let Ids = req.url.split('?')[1];
  let [productId, userId] = Ids.split('%u_id=')

  console.log("product " + productId, "user " + userId);
  if (userId) {
    UserCart_add(userId, productId)
      .then(res.redirect('/'))

  } else {
    res.redirect('/login')
  }



})

// remove cart item from cart.....................................................
router.get('/cart/remove-cart', (req, res) => {
  let [c_ID, userID] = req.url.split('?')[1].split('&')
  console.log(c_ID, userID);
  rmFromCart(c_ID, userID).then(() => {

    res.redirect(`/cart?${userID}`)
  })



})




router.get('/cart', function (req, res, next) {

  let userID = req.url.split('?') ? req.url.split('?')[1] : '';
  getData('', userID).then(data => {
    let Arr = data.cart
    let id = String(data._id).split('"')[0]
    console.log(id);

    if (Arr) {
      Arr.map(item => {
        item.userID = id
      })
    }
    console.log(Arr)

    res.render('user/cart', { Arr });
  })

});





// order section..................................





router.get('/add-to-order/id', (req, res) => {
  let img_id = String(req.url.split('?')[1]);

  addToOrder(img_id).then(data => {
    console.log(data);
    res.render('user/order', { data })


  })

})



router.post('/refresh', (req, res) => {
  getData('', req.body.id).then(data => {
    res.set('application/json')
    res.json(data)
  })


})


// review.......................................................................


// cart item increase................................................................
router.patch('/cart/update_cart', (req, res) => {
  console.log(req.body);
  const { quantity, productID, userID, T_price } = req.body
  updateUser_cart(userID, productID, quantity, T_price).then(data => {
    res.json(data)

  })

})

// get user address..............................................................................

router.post('/user-address',(req, res)=>{
  console.log(req.body);
  addAddress(req.body).then(()=>{
    res.redirect('back');
  })
})



router.patch('/user-address', function (req, res, next) {
  let { Total_P, userID, proId, productID, oneProduct } = req.body;
  proDetails = {
    Total_price: Total_P,
    userID: userID,
    proId: proId,
    oneItemID_from_cart: productID,
  };
  console.log("data from post user:",proDetails);
  encode({ proDetails: proDetails, oneProduct: oneProduct }).then(token => {
    console.log(token)
    res.json(token)

    
  })


})

router.get('/user-address', (req, res) => {
  let token = req.url.split('token=') ? req.url.split('token=')[1] : null
  console.log("whn user : ",req.url);
  decode(token).then(data => {
    getAddress(data.proDetails.userID).then(address => {

      res.render('user/user-address', { proDetails: data.proDetails, address, oneProduct: data.oneProduct })
    })
  })
})























// order success....................................................

router.get('/success', function (req, res, next) {

  let userID = req.url.split('?_Uid=_') ? req.url.split('?_Uid=_')[1] : null
  if (userID) {
    getData('', userID).then(data => {
      if (data) {
        if (req.session.views) {
          req.session.views++
          res.redirect('/')
        } else {
          console.log(userID)
          onlineCheckouts(userID)
          req.session.views = 1
          res.render('user/success')
        }
      }
    })
  } else {
    res.end('something went wrong')
  }

})
// COD success page

// cod...................................
router.post('/cash_On', (req, res) => {
  let { userID, productID, total_price, oneItemID_from_cart, oneProduct } = req.body;
  myOrder(userID, productID, total_price, oneItemID_from_cart, oneProduct).then(url => {
    res.json(url.url);
  })

})



// get message page.........................................................................
router.get('/messages', (req, res, next) => {

  res.render('user/message');
})


router.post('/messages', (req, res) => {
  console.log(req.body)
  addMessage(req.body).then(data => {
    res.redirect('/')
  })
})

// my order......................................
router.get('/myOrder', (req, res, next) => {
  let userID = req.url.split("?") ? req.url.split("?")[1] : null
  if (userID) {

    getOrder(userID).then(orderData => {

      res.render('user/myOrder', { orderData });
    })
  } else {
    res.end('something went wrong please login again')
    setTimeout(() => {
      res.redirect('/?status=205')
    }, 1500)
  }
})



router.get('/cancel', (req, res) => {
  res.end("payment canceled")
})

// payment router

router.post('/create-checkout-session', async (req, res) => {

  let { userID, productID, oneProduct, oneItemID_from_cart } = req.body



  if (!productID) {
    if (!oneProduct) {
      getData('', userID).then(async (userData) => {

        let items = await userData.cart.map(el => {
          console.log(el.Name);
          return {
            price_data: {
              currency: 'inr',
              product_data: {
                name: el.Name
              },
              unit_amount: parseInt(el.Prise + '00'),
            },
            quantity: parseInt(el.Quantity)
          }
        })
        let session = await stripe.checkout.sessions.create({
          line_items: items,
          mode: 'payment',
          success_url: `${process.env.APP_BASE_URL}/success?_Uid=_${userID}`,
          cancel_url: `${process.env.APP_BASE_URL}/cancel`
        })
        res.json(session.url)

      })
    } else {
      getData('', userID).then(async (userData) => {

        let items = await userData.cart.map(el => {
          let id = String(el._id).split('"')
          if (id == oneItemID_from_cart) {
            return {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: el.Name
                },
                unit_amount: parseInt(el.Prise + '00'),
              },
              quantity: parseInt(el.Quantity)
            }
          }

        })
        let session = await stripe.checkout.sessions.create({
          line_items: items,
          mode: 'payment',
          success_url: `${process.env.APP_BASE_URL}/success?_Uid=_${userID}`,
          cancel_url: `${process.env.APP_BASE_URL}/cancel`
        })
        res.json(session.url)

      })
    }



  } else {
    getOneProduct({ id: productID }).then(async (product) => {

      let stripe_product = await stripe.products.create({ name: product.Name })
      let price = Number(product.Prise + "00")

      let stripe_price = await stripe.prices.create({
        product: stripe_product.id,
        unit_amount: price,
        currency: 'inr',
      });


      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: stripe_price.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_BASE_URL}/success?_Uid=_${userID}`,
        cancel_url: `${process.env.APP_BASE_URL}/cancel`

      })
      res.json(session.url)

    })
  }


})

// password reset.........................

router.get('/done_', (req, res) => {
  let userID = req.url.split('u_ID')[1]
  if (req.url.search("200")) {

    res.render('user/passW_reset', { userID })
  } else {
    res.render('user/broadcast')
  }

})
router.put('/done_', (req, res) => {
  const { hashOtp, userOtp, userID } = req.body
  console.log(hashOtp, userOtp)
  bcrypt.compare(userOtp, hashOtp).then(AreU => {
    if (AreU) {
      res.json(`${process.env.APP_BASE_URL}/done_?200u_ID${userID}`)
    }
  })

  // console.log(req.body)
})


// password update...............................
router.post('/update_pass', (req, res) => {
  console.log(req.body)
  updatePass(req.body).then(result => {
    if (!result) {
      res.json({ url: `/login`, res: "Password Successfully reset" })
    } else {
      res.json({ res: "Your already have this password" })
    }

  })

})
router.delete('/remove-address', (req, res) => {
  let { userID ,url} = req.body
  
  removeAddress(userID).then(res.json(url.href))

})


// my profile.........................
router.get('/myProfile/id', (req, res) => {
  console.log("hi", req.url)
  let userId = req.url.split("?")[1]
  console.log(userId)
  getData("", userId).then(profileData => {
    console.log(profileData)
    res.render('user/myProfile', { profileData })
  })
})

// remove profile............................


router.get('/removeProfile/id', (req, res) => {


  let userId = req.url.split("?")[1]
  console.log(userId)
  removeProfile(userId).then(data => {
    res.redirect('/')
  })

})
// edit profile..............................................
router.post('/editProfile', (req, res) => {
  console.log("hello", req.body)
  let { name1, name2, username, id } = req.body
  console.log(name1, name2, username)
  updateProfile(name1, name2, username, id).then(data => {
    res.redirect('/')
  })

})
module.exports = router;

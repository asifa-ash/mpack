var express = require('express');
var router = express.Router();
let { getData } = require('../../config/userData')
let SignData = require('../../config/usersignupData')
let { status, user } = require('../../config/status')
let decode = require('../../config/decode');

const sendOtp = require('../../utils/OTPConfig');
const msg = require('../../utils/forgotPass')
const { compId } = require('../../config/compId');
const bcrypt = require('bcrypt');

const temp = {};




/* GET login page. */
router.get('/', function (req, res, next) {
  res.render('user/login');

});
/* POST login page. */

router.post('/', (req, res) => {
  getData(req.body).then((result) => {
    console.log(result);

    if (result.data) {
      res.redirect(`/?status=${result.status}?id=${result.data._id}`)
    } else {
      res.redirect(`/login?status=${result.status}`)
    }
  })

})


// google access









// get signup page
router.get('/signup', function (req, res, next) {
  res.render('user/signup');
});

router.post('/signup/otp', (req, res) => {
  console.log(req.body.email);
  sendOtp(req.body.email).then(otp => {
    console.log("final", otp);
    res.json(otp);

  })

})
// post signup getData
router.post('/signup', (req, res) => {

  SignData(req.body).then((obj) => {

    if (obj.data) {
      // Conflict
      res.redirect(`/login/signup?status=${obj.status}`)
    } else {
      res.redirect(`/login?status=${obj.status}`)

    }
  })
})


// forgot password..................................................
 router.post('/forgot', (req, res) => {
   let { email } = req.body
   msg(email)


   res.json({url:'/login',res:`please check your email ${email} for reset page`})


 })
// compaire password....
router.post('/compId', (req, res) => {

  let { email } = req.body

  compId(email).then(data => {
    if (data) {

      const { username,_id } = data;
      let userID = String(_id).split(`"`)[0]
      console.log(username,userID)

      sendOtp(username).then(otp => {
       
        bcrypt.hash(otp,10).then(hashOpt=>{

          res.redirect(`/login/otp?${hashOpt}=_${userID}`)
        })

        

      })

    }

  })
    

})
// get resetpassword otp page...................
router.get('/otp', (req, res) => {

  res.render('user/otp')
})




router.get('/forgot', (req, res) => {

  res.render('user/passwordResetForm')
})

// get order page.......................................................













module.exports = router;

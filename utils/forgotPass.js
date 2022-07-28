const reset = require("nodemailer");

 async function msg(mailAddressFromUser){
    const transport= await reset.createTransport({
        host: 'smtp.gmail.com',
        port:587,
        service: 'gmail',
        secure: false,
        auth:{
                user: "asifashahid2@gmail.com",
                pass: 'uitzeknuywctyezz',
        }


        
    })
    transport.sendMail({
        from:"asifashahid2@gmail.com",
        to: mailAddressFromUser,
        subject:"M-PACK Password Reset Request",
        html:`<a href="${process.env.APP_BASE_URL}/login/forgot"><button>Reset Password</button></a>`
    })
    
 }


module.exports = msg








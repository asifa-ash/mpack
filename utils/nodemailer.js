const nodemailer = require('nodemailer');

async function main(otp,user_mail){
    console.log(user_mail)
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: "asifashahid2@gmail.com",
            pass: 'uitzeknuywctyezz',
        }
    
    })
    
    let mailOptions = await transport.sendMail({
        from: '"Fred Foo 👻" "spider_man', // sender address
        to: user_mail, // sender address
        subject: "M-PACK Verification ✔", // Subject line
        text: otp, // plain text body
        html: `<b>Your Verification Code: <h2>${otp}</h2></b>`, // html body
    });
    return mailOptions
}

module.exports = main




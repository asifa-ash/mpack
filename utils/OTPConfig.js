const main = require("./nodemailer");

async function generateOtp() {
    let otp = await String(Math.floor(Math.random() * 1000 + 1000))

    return otp

}

function sendOtp(user_mail) {
    return new Promise((resolve, reject) => {
        let otp = generateOtp()
        otp.then((otpRes) => {
            console.log(otpRes)
            main(otpRes, user_mail).then(()=>{
                resolve(otpRes)
            })
        })
    })
}

module.exports = sendOtp





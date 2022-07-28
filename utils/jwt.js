const sign = require('jwt-encode');
const jwt = require('jwt-decode');

function encode(value,secret) {

    return new Promise((resolve, reject) => {

        let secrets = secret?secret:'hello';
        let token = sign(value,secrets)
        resolve(token)
        
    })
}
function decode(value) {
    return new Promise((resolve, reject) => {
        let token = jwt(value)
        resolve(token)
    })
}

module.exports = {encode,decode};
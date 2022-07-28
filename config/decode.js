const jwt = require('jwt-decode');

 function hai(car) {
  return new Promise((resolve, reject) => {
    const decoded = jwt(car);
    if (decoded) {
      resolve(decoded);
    } else {
        reject(new Error('Invalid token'));
    }




  })
}

module.exports = hai;
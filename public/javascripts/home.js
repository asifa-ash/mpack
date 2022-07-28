window.addEventListener('load', function () {
    let logoutValue = document.querySelector('#logout')
    let accName = document.querySelector('#acc')
    let MYProfile = document.querySelector('.MYProfile')
    let myOrder= document.querySelector('#myOrder')
    

    let menuLogout = document.querySelector("#menuLogout")
    let currentUserState;
    let status_code;
    let url = location.search.split('?');
    console.log(url)

   
   

    if (url.length == 3) {
        let id = location.search.split("?")[2].split('=')[1]
        
        document.cookie = `id=${id}`
        localStorage.setItem("id",id)
        status_code = location.search.split("?")[1].split('=')[1];
        console.log(status_code)
    } else if (url.length == 2) {
        status_code = location.search.split('=')[1]
        console.log(status_code);

    }



    

    if (status_code == 200 || status_code == 205) {
        localStorage.setItem("status", status_code)
     
        stateChecker(status_code)

    } else {
        currentUserState = localStorage.getItem("status");

        stateChecker(currentUserState)


    }


   

    function stateChecker(state) {
        
        if (state == 205) {
            accName.innerHTML = 'Account'
            menuLogout.innerHTML = 'Sign In'
            logoutValue.innerHTML = 'Sign In'
            MYProfile.innerHTML=""
            myOrder.innerHTML=""
            localStorage.removeItem('id')
            // for desktop
            logoutValue.parentElement.setAttribute('href', '/login')
            // for menu(mobile)
            menuLogout.setAttribute('href', '/login')

        } else if (state == 200) {
            // for (mobile)
            let id = localStorage.getItem('id')
            myOrder.parentNode.href = `/myOrder?${id}`
            menuLogout.innerHTML = 'Log Out'
            // for desktop
            logoutValue.innerHTML = 'Log Out'
            
       
        } else if (!state) {
            accName.innerHTML = 'Account'
            localStorage.removeItem('id')
            menuLogout.innerHTML = 'Sign In'
            logoutValue.innerHTML = 'Sign In'
            MYProfile.innerHTML=""
            myOrder.innerHTML=""
            
            logoutValue.parentElement.setAttribute('href', '/login')
            menuLogout.setAttribute('href', '/login')

        }

    }

})
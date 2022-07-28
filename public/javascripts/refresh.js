window.addEventListener('load', function () {
    let account = document.querySelector('#acc');
    let status = localStorage.getItem('status');
    let cartCount = document.querySelector("#cart")
    let menuList = document.querySelector('#UserMedia')
   
    
    if (status == 200) {

        let cookies = document.cookie.split(';')
        let arrOf_Id = cookies.filter((el) => { return el.includes("id") });
        let id = arrOf_Id[0]?arrOf_Id[0].split('=')[1]:false
        
        if (id) {
            fetch('/refresh', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) }).then((res) => {
                return res.json()
            }).then(res => {
                
                account.innerHTML = res.name1 + " " + res.name2;
                menuList.innerText  = `${res.name1}`
                cartCount.dataset.count = res.cart.length,
                cartCount.parentNode.href = `/cart?${localStorage.getItem('id')}`
              
            })
        } else {
            let id_loc = localStorage.getItem('id')
            fetch('/refresh', { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id_loc }) }).then((res) => {
                return res.json()
            }).then(res => {
                menuList.innerHTML = `${res.name1}&nbsp;${res.name2}`
                account.innerHTML = res.name1 + " " + res.name2;
                
                cartCount.dataset.count = res.cart.length;
            })
            
        }



    } else if (status == 205 || !status) {

        account.innerHTML = "Account";
        menuList.innerHTML = "Account"
        cartCount.dataset.count = 0;

    };

});




const searchBar = document.querySelector('#search')

//adding event to the searchBar


searchBar.addEventListener('input', e => {

    //taking 'tbody' elements from table's child-nodes

    


    // taking all 'input' elements from 'tbody' by calling 'input' element ID 

    let inputTitle = document.querySelectorAll('#name');
    console.log("name value :",inputTitle)

    //looping all 'input' elements to get there values inside it

    inputTitle.forEach(el => {
       

        console.log(e.target.value)

        let found = el.innerHTML.toLowerCase().includes(e.target.value.toLowerCase())
        console.log(found)

        //hiding element using display none if the value the does not matches the searching input value
        console.log(el.parentNode.parentNode.parentNode)
        el.parentNode.parentNode.parentNode.classList.toggle('d-none', !found)


    })
})

//login validation
document.querySelector('#signup').addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const [email, password] = data

    let lth = password[1].length
    if (lth <= 2) {
        alert('Password must be at least 3 characters')

    } else if (!email[1].includes('.')) {
        alert('Please enter a valid email')
    } else {
        e.target.submit()
    }
});







//sign up validation 
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const [name1, name2, email, password] = data

    let lth = password[1].length
    if (lth <= 2) {
        alert('Password must be at least 6 characters')

    } else if (!email[1].includes('.')) {
        alert('Please enter a valid email')
    } else {
        e.target.submit()
    }
});






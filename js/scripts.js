// Scripts

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

//form logic
var name;
var email;
var money;
var dues;
var clientArr = [];
var clients = $("#clients")
var update = $("#update")
clientArrStorage = JSON.parse(localStorage.getItem("listaClientes"));
if(clientArrStorage != null){
    clientArr = clientArrStorage
}


//function to select a word in an index from a string
function selectWord(str, index) {
    var strArr = str.split(" ");
    var selectedWord = strArr[index];
    return selectedWord;
};

//create class clients
class Client{
    constructor(){
        this.name = name;
        this.email = email;
    }
};

//client register & due calc
function registerAndCalc(){
    name = $("#name").val();
    email = $("#email").val();
    money = $("#money").val();
    dues = $("#dues");
    currency = $("#currency");

    
    function getCurrencyValue(val) {
        let valorDivisa = 0;
        $.ajax({
            method: "GET",
            url: "https://www.dolarsi.com/api/api.php?type=valoresprincipales",
            dataType: "json",
            success: function(data) {
                valorDivisa = data[val].casa.venta;
                valorDivisa = parseFloat(valorDivisa.replace(/,/g, "."));
                alert(`Hola ${name} el total a pagar por tu préstamo de seria de ${totalMoney}${currencySymbol} en ${numberOfDues} cuotas de ${dueFee}${currencySymbol}. El monto pesificado es de ${totalMoney * valorDivisa}ARS`)
            }
        })
    }

    //due & interest calc
    let interest = dues.find(":selected").val();
    let currencyType = currency.find(":selected").val();
    let currencySymbol = currency.find(":selected").text();
    let numberOfDues = parseInt(selectWord(dues.find(":selected").text(), 0));
    let totalMoney = money*interest;
    let dueFee = Math.round(totalMoney/numberOfDues*100)/100;
    

    //name & email validation
    let emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  

    if (email.match(emailFormat)){
        if( name == null || name.length == 0 || /^\s+$/.test(name) ) {
            alert("Nombre ingresado invalido!")
        }
        else{
            if(currencyType == 1){
                getCurrencyValue(1)
                console.log(`Email ${email} enviado con el resumen`) 
            }
            else{
                alert(`Hola ${name} el total a pagar por tu préstamo de seria de ${totalMoney} en ${numberOfDues} cuotas de ${dueFee}`)
                console.log(`Email ${email} enviado con el resumen`)
            }

            //push valid clients to clientArr
            if (clientArr.find(clientArr => clientArr.email == email)){
                console.log("Cliente registrado previamente")
            }
            else{
                clientArr.push(new Client());
                console.log(clientArr)
                localStorage.clear();
                localStorage.setItem("listaClientes", JSON.stringify(clientArr));
            }
        }
    }
    else{
        alert("Email invalido!")
    }
}

$("#button").on("click", () => {
    registerAndCalc();
});
$("#formID").on("keypress", function (e) {
    if(e.which == 13){
        registerAndCalc();
    }
});

//show client list
$("#showAdmin").click(() => { 
    $("#adminPanel").toggleClass("show");
});
$("#closeAdminPanel").click(() => { 
    $("#adminPanel").toggleClass("show");
});

//refresh client list
update.click(()=>{
    clients.html("")
    clientArr.forEach(client => {
        clients.append(`
        <li class="list-group-item">Nombre: ${client.name} <br> Email: ${client.email}</li>
        `);
    });
})
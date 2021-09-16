// Scripts

window.addEventListener('DOMContentLoaded', () => {

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

//Form Logic
var clients = $("#clients")
var update = $("#update")
clientArrStorage = JSON.parse(localStorage.getItem("listaClientes"));
if(clientArrStorage != null){
    clientArr = clientArrStorage
}

//Function to select a word in an index from a string
function selectWord(str, index) {
    var strArr = str.split(" ");
    var selectedWord = strArr[index];
    return selectedWord;
};

//Create class clients
class Client{
    constructor(name, email){
        this.name = name;
        this.email = email;
    }
};

class CriptumBank{
    constructor(){
        this.name = $("#name").val();
        this.email = $("#email").val();
        this.money = parseInt($("#money").val());
        this.clientArr = [];
        this.interest = parseFloat($("#dues").val());
        this.numberOfDues = parseInt(selectWord($("#dues").find(":selected").text(), 0));
        this.currencyType = $("#currency").val();
        this.currencySymbol = $("#currency").text();
        this.emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
    }

    getCurrencyValue(val) {
        let valorDivisa = 0;
        $.ajax({
            method: "GET",
            url: "https://www.dolarsi.com/api/api.php?type=valoresprincipales",
            dataType: "json",
            success: function(data) {
                valorDivisa = data[val].casa.venta;
                valorDivisa = parseFloat(valorDivisa.replace(/,/g, "."));
                localStorage.setItem("valorDolar", valorDivisa);
            }
        }).done(() => {
            valorDivisa = localStorage.getItem("valorDolar");
            alert(`Hola ${this.name} el total a pagar por tu préstamo de seria de ${this.totalMoney}${this.currencySymbol} en ${this.numberOfDues} cuotas de ${this.dueFee}${this.currencySymbol}. El monto pesificado es de ${this.totalMoney * this.valorDivisa}ARS`)
        })
    }

    validateEmail(){
        if (this.email.match(this.emailFormat)){


            let totalMoney = Math.round(this.money*this.interest*100)/100;
            let dueFee = Math.round(totalMoney/this.numberOfDues*100)/100;

            if( this.name == null || this.name.length == 0 || /^\s+$/.test(this.name) ) {
                alert("Nombre ingresado invalido!")
            }
            else{
                if(this.currencyType == 1){
                    this.getCurrencyValue(1)
                    console.log(`Email ${this.email} enviado con el resumen`) 
                }
                else{
                    alert(`Hola ${this.name} el total a pagar por tu préstamo de seria de ${totalMoney} en ${this.numberOfDues} cuotas de ${dueFee}`)
                    console.log(`Email ${this.email} enviado con el resumen`)
                }
    
                //push valid clients to clientArr
                if (this.clientArr.find(client => client.email == email)){
                    console.log("Cliente registrado previamente")
                }
                else{
                    this.clientArr.push(new Client(this.name, this.email));
                    console.log(this.clientArr)
                    localStorage.clear();
                    localStorage.setItem("listaClientes", JSON.stringify(this.clientArr));
                }
            }
        }
        else{
            alert("Email invalido!")
        }
    }
}


$("#button").on("click", () => {
    const criptumBank = new CriptumBank();
    criptumBank.validateEmail();
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
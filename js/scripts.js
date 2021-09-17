// Scripts

window.addEventListener('DOMContentLoaded', () => {

    // Activate Bootstrap scrollspy on the main nav element
    $('body').scrollspy({ target: '#mainNav', offset: 74, })

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            console.log("asd")
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
        this.currencySymbol = $("#currency").find(":selected").text();
        this.emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
    }

    getCurrencyValue(val) {
        $.ajax({
            method: "GET",
            url: "https://www.dolarsi.com/api/api.php?type=valoresprincipales",
            dataType: "json",
            context:this,
            success: function(data) {
                let valorDivisa = data[val].casa.venta;
                valorDivisa = parseFloat(valorDivisa.replace(/,/g, "."));
                let totalMoney = Math.round(this.money*this.interest*100)/100;
                let dueFee = Math.round(totalMoney/this.numberOfDues*100)/100;
                let toModal = `Hola ${this.name} el total a pagar por tu préstamo de seria de ${totalMoney}${this.currencySymbol} en ${this.numberOfDues} cuotas de ${dueFee}${this.currencySymbol}. El monto pesificado es de ${totalMoney * valorDivisa}ARS`
                this.printInModal(toModal)
            }
        })
    }

    validateEmail(){
        if (this.email.match(this.emailFormat)){


            let totalMoney = Math.round(this.money*this.interest*100)/100;
            let dueFee = Math.round(totalMoney/this.numberOfDues*100)/100;

            if( this.name == null || this.name.length == 0 || /^\s+$/.test(this.name) ) {
                let toModal = "Nombre ingresado invalido!"
                this.printInModal(toModal)
            }
            else if(Number.isNaN(this.money)){
                let toModal = "Debes ingresar una cantidad de dinero valida!"
                this.printInModal(toModal)
            }
            else{
                if(this.currencyType == 1){
                    this.getCurrencyValue(1)
                    console.log(`Email ${this.email} enviado con el resumen`) 
                }
                else{
                    let toModal = `Hola ${this.name} el total a pagar por tu préstamo de seria de ${totalMoney}${this.currencySymbol} en ${this.numberOfDues} cuotas de ${dueFee}${this.currencySymbol}`
                    this.printInModal(toModal)
                    console.log(`Email ${this.email} enviado con el resumen`)
                }
    
                //push valid clients to clientArr
                if (this.clientArr.find(client => client.email == email)){
                    console.log("Cliente registrado previamente")
                }
                else{
                    this.clientArr.push(new Client(this.name, this.email));
                    localStorage.clear();
                    localStorage.setItem("listaClientes", JSON.stringify(this.clientArr));
                }
            }
        }
        else{
            let toModal = "Email invalido!"
            this.printInModal(toModal)
        }
    }

    printInModal(modalString) {
        $("#modal-body").html(modalString)
    }
}


$("#button").on("click", () => {
    const criptumBank = new CriptumBank();
    criptumBank.validateEmail();
});
$("#formID").on("keypress", function (e) {
    if(e.which == 13){
        const criptumBank = new CriptumBank();
        criptumBank.validateEmail();
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
        clients.append(`<li class="list-group-item">Nombre: ${client.name} <br> Email: ${client.email}</li>`);
    });
})
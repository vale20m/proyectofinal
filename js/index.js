document.addEventListener("DOMContentLoaded", function(){

    if(localStorage.getItem("user")!=1){
        window.location.replace('login.html');
    }

    const cerrarSesion = document.querySelector("#boton-login");

    if(localStorage.getItem("user")==1){
        cerrarSesion.innerHTML = "Cerrar sesión";
        cerrarSesion.addEventListener("click", function(){
            localStorage.setItem("user", 0);
            cerrarSesion.href = "index.html";
        });
    }

    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

});
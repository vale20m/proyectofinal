// Función para mostrar el nombre del usuario, el cierre de sesion y el redireccionar al login (si no ha iniciado sesión)

document.addEventListener("DOMContentLoaded", function(){
    
    const botonLogin = document.querySelector("#boton-login");
    const perfil = document.querySelector("#perfil");

    if(localStorage.getItem("email") == undefined){

        perfil.removeAttribute("href");
        for (let a = 0; a <= 1; a++){
            setTimeout( () => perfil.innerHTML = "Redireccionando", 1200*a);
            for (let b = 0; b <= 2; b++){
                setTimeout( () => perfil.innerHTML += ".", 300 + 300*b + 1200*a);
            }
        }
        setTimeout( () => window.location.replace('login.html'), 2400);

    } else {

        perfil.innerHTML = localStorage.getItem("email");
        botonLogin.innerHTML = "Cerrar sesión";
        botonLogin.addEventListener("click", function(){
            localStorage.removeItem("email");
            botonLogin.href = "index.html";
        });

    }

});
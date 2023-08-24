// Función para mostrar el nombre del usuario, el cierre de sesion y el redireccionar al login (si no ha iniciado sesión)

document.addEventListener("DOMContentLoaded", function(){
    
    const botonLogin = document.querySelector("#boton-login");
    const perfil = document.querySelector("#perfil");

    if(localStorage.getItem("email") == undefined){

        perfil.innerHTML = "Redireccionando...";
        perfil.removeAttribute("href");
        setTimeout( () => window.location.replace('login.html'), 2000);

    } else {

        perfil.innerHTML = localStorage.getItem("email");
        botonLogin.innerHTML = "Cerrar sesión";
        botonLogin.addEventListener("click", function(){
            localStorage.removeItem("email");
            botonLogin.href = "index.html";
        });

    }

});
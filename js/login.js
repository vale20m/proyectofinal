// Función para redirigir al usuario a la página principal luego de iniciar sesión

const email = document.getElementById("email");
const password = document.getElementById("password");
const enviar = document.getElementById("enviar");

enviar.addEventListener("click", function(){
    if (email.value != "" && password.value != ""){
        window.location.href="index.html";
    }
});

// Función para mostrar y ocultar contraseña

const botonMostrar = document.querySelector("#mostrar");

botonMostrar.addEventListener("change", function(){
    if (botonMostrar.checked){
        password.type = "text";
        mostrar = true;
    } else {
        password.type = "password";
        mostrar = false;
    }
});
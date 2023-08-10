// Función para redirigir al usuario a la página principal luego de iniciar sesión

const email = document.getElementById("email");
const password = document.getElementById("password");
const boton = document.getElementById("boton");

boton.addEventListener("click", function(){
    window.location.href="index.html";
});
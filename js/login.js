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

// Función para guardar el "user" y el email del usuario

const formulario = document.querySelector("#formulario");
const email = document.querySelector("#email");

formulario.addEventListener('submit', function(){
    localStorage.setItem("email", email.value);
});
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

// Función para guardar el "user"

const formulario = document.querySelector("#formulario");

formulario.addEventListener('submit', function(){
    localStorage.setItem("user", 1);
});
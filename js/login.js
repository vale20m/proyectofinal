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
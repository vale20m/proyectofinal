const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// Función para mostrar el nombre del usuario, el cierre de sesion y el redireccionar al login (si no ha iniciado sesión)

document.addEventListener("DOMContentLoaded", function(){
    
  // CONSTANTES PARA ENTREGA 4 FUNCIONALIDAD 2 (MENU DESPLEGABLE)

  const botonLogin = document.querySelector("#boton-login");
  const perfil = document.querySelector("#perfil");
  const options = document.querySelector("#profile-options");
  const userDropdown = document.querySelector("#userDropdown");

  if(localStorage.getItem("email") == undefined){

      perfil.innerHTML = "Redireccionando en 3...";
      for (let a = 2; a >= 1; a--){
          setTimeout( () => perfil.innerHTML = "Redireccionando en " + a + "...", 2000/a);
      }
      setTimeout( () => window.location.replace('login.html'), 3000);

      // OCULTAMOS LOS ELEMENTOS DEL MENU DESPLEGABLE Y LE QUITAMOS LA CLASE (PARA RETIRAR LA FLECHA)

      options.style.display = "none";
      userDropdown.classList.remove("dropdown-toggle");

  } else {

      perfil.innerHTML = localStorage.getItem("email");
      botonLogin.addEventListener("click", function(){
          localStorage.removeItem("email");
          botonLogin.href = "index.html";
      });

      // LE AGREGAMOS LA CLASE AL MENU DESPLEGABLE

      userDropdown.classList.add("dropdown-toggle");

  }

  // CAMBIAR ENTRE MODO CLARO Y MODO OSCURO

  const switchMode = document.querySelector("#switchMode");
  const whiteItems1 = document.getElementsByClassName("shadow");
  const whiteItems2 = document.getElementsByClassName("card");

  switchMode.addEventListener("click", function(){
    
    if (localStorage.getItem("screenMode") == undefined || localStorage.getItem("screenMode") == "light"){

      localStorage.setItem("screenMode", "dark");
      document.body.classList.add("bg-dark", "text-white");
      switchMode.innerHTML = "Modo día";
      for (const item of whiteItems1) {
        item.classList.add("text-dark");
      }
      for (const item of whiteItems2) {
        item.classList.add("text-dark");
      }

    } else {

      localStorage.setItem("screenMode", "light");
      document.body.classList.remove("bg-dark", "text-white");
      switchMode.innerHTML = "Modo noche";
      for (const item of whiteItems1) {
        item.classList.remove("text-dark");
      }
      for (const item of whiteItems2) {
        item.classList.add("text-dark");
      }

    }

  });

});
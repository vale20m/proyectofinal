// CONSTANTES PARA EL FUNCIONAMIENTO DE TODO EL CODIGO (URL Y CONTENEDORES DE HTML)

const URL_USER = "https://japceibal.github.io/emercado-api/user_cart/25801.json"

const cartItems = document.querySelector("#cartItems");

const cartControls = document.querySelector("#cartControls");

// FUNCION QUE CALCULA EL SUBTOTAL DEL PRODUCTO EN EL CARRITO, MULTIPLICANDO SU
// PRECIO POR LACANTIDAD, Y AGREGANDO LA MONEDA AL COMIENZO (DEVOLVIENDO UN SITRING)

function calculateSubtotal(string, num1, num2){
    const x = num1 * num2
    const subtotal = string + " " + x;
    return subtotal;
}

function showCart(array){

    // SECCIÓN QUE FUNCIONA COMO "TÍTULO" DE LA TABLA DEL CARRITO
    cartItems.innerHTML += 
    `<div class="row">
        <div class="col-md-3 d-md-block d-none"></div>
        <div class="col-md-3 d-md-block d-none">Nombre</div>
        <div class="col-md-2 d-md-block d-none">Costo</div>
        <div class="col-md-2 d-md-block d-none">Cantidad</div>
        <div class="col-md-2 d-md-block d-none">Subtotal</div>
    </div>`
    for (const item of array) {

      // CREAMOS UNA SECCION DE LA TABLA DONDE AGREGAREMOS LOS ELEMENTOS EXTRAIDOS DEL JSON Y DEL LOCAL STORAGE

      const div = document.createElement("div");
      div.innerHTML =
      `<div class="list-group-item border rounded">
        <div class="row mx-auto">
          <div class="col-md-2 col-sm-4 offset-sm-0 col-5 offset-1 my-auto"><img id="cartItemImage" class="img-thumbnail my-auto" src="${item.image}"></div>
          <h4 class="col-lg-2 col-md-3 col-sm-4 col-6 my-auto mx-auto">${item.name}</h4>
          <h4 class="col-md-2 col-sm-4 d-sm-block d-none my-auto">${item.currency} ${item.unitCost}</h4>
          <h4 class="d-md-none col-sm-3 offset-sm-0 col-5 offset-1 my-md-auto mt-sm-3 mt-3">Cantidad: </h4><div class="col-md-2 col-sm-3 col-6 my-md-auto mt-3 mt-2"><input type="number" class="form-control w-75" value="${item.count}" min="1"></div>
          <h4 class="d-md-none col-sm-3 offset-sm-0 col-5 offset-1 my-md-auto mt-sm-3 mt-2">Subtotal: </h4><h4 id="subtotal" class="col-md-2 col-sm-3 col-6 my-md-auto mt-2">${calculateSubtotal(item.currency, item.unitCost, item.count)}</h4>
        </div>
        <button type="button" id="closeButton" class="close btn position-absolute top-0 end-0" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>`;

      // AGREGAMOS UN ADD EVENT LISTENER QUE SE ACTIVA CUANTO SE HACE CLICK EN EL BOTON "CERRAR"
      // DE UN ITEM DEL CARRITO, ELIMINANDOLO DEL LOCAL STORAGE

      const closeButton = div.querySelector("#closeButton");

      closeButton.addEventListener("click", function(){
          div.innerHTML = "";
          deleteCartProducts(item.id);
      });

      // ANIDAMOS UN ADD EVENT LISTENER AL ELEMENTO "INPUT", EL CUAL EJECUTA UNA FUNCION
      // QUE MODIFICA EL SUBTOTAL DEL PRODUCTO CADA VEZ QUE SE MODIFICA EL VALOR DE DICHO INPUT.

      const inputCount = div.querySelector("input");
      inputCount.addEventListener("input", function(){

        const newCount = inputCount.value;
        if (newCount < 0){
          inputCount.value = 0;
          return;
        }
        const subtotalContainer = div.querySelector("#subtotal");
        subtotalContainer.textContent = calculateSubtotal(item.currency, item.unitCost, newCount);
        
        // TAMBIEN MODIFICAMOS LA CANTIDAD DEL ARTICULO Y LO ACTUALIZAMOS EN EL LOCAL STORAGE

        for (let i = 0; i < localItems.length; i++){
          if (localItems[i].id == item.id && localItems[i].username == localStorage.getItem("email")){
            localItems[i].count = newCount;
          }
        }
        localStorage.setItem("cartItems", JSON.stringify(localItems));
      });

      // AGREGAMOS EL ELEMENTO A HTML
      cartItems.appendChild(div);
    }

    cartControls.innerHTML =
    `<div class="col-lg-6 col-md-8 col-10 mx-sm-5 mx-4">
    <h2>Tipo de envío</h2>
    <form id="checkoutForm">
      <div class="mb-3">
        <label for="tipoEnvio" class="form-label">Tipo de Envío:</label>
        <select id="tipoEnvio" class="form-select">
          <option value="envioRapido">Premium 2 a 5 dias (15%)</option>
          <option value="envioEstandar">Express 5 a 8 dias (7%)</option>
          <option value="envioExpress">Standard 12 a 15 dias (5%)</option>
        </select>
      </div>
      <h2>Dirección de envío</h2>
      <div class="mb-3">
        <label for="calle" class="form-label">Calle:</label>
        <input type="text" class="form-control" id="calle" name="calle">
      </div>
      <div class="mb-3">
        <label for="numero" class="form-label">Número:</label>
        <input type="text" class="form-control" id="numero" name="numero">
      </div>
      <div class="mb-3">
        <label for="esquina" class="form-label">Esquina:</label>
        <input type="text" class="form-control" id="esquina" name="esquina">
      </div>
      <button type="submit" class="btn btn-primary">Realizar Compra</button>
    </form>
  </div>`

}

// ARREGLO QUE CONTENDRÁ TODOS LOS ELEMENTOS DEL CARRITO
let cartArray = [];

// CREAMOS UN ARRAY QUE CARGA LOS ELEMENTOS DEL LOCAL STORAGE
let localItems = loadCartItems();

async function getCart(url) {
  try {
    let response = await fetch(url);
    let responseContents = await response.json();

    // Reemplazamos los elementos en el arreglo cartArray con los nuevos elementos del servidor
    cartArray = responseContents.articles;

    if (localItems){
      // Agregamos los elementos del almacenamiento local al arreglo cartArray
      for (let i = 0; i < localItems.length; i++){
        if (localStorage.getItem("email") == localItems[i].username){
          cartArray.push(localItems[i]);
        }
      }
    }

    // LLAMAMOS A LA FUNCION PARA MOSTRAR LOS ELEMENTOS DEL CARRITO
    if (cartArray && cartArray != []){
      showCart(cartArray);
    } else {
      cartItems.innerHTML = `<h1 class="mt-5">Actualmente no hay productos en el carrito</h1>`
    }

  } catch (error) {
    console.log("HTTP ERROR: " + error.message);
  }
}

// FUNCION QUE TOMA LOS ELEMENTOS DEL LOCAL STORAGE

getCart(URL_USER);

function loadCartItems() {
    const productsJSON = localStorage.getItem("cartItems");

    if (productsJSON) {
        const products = JSON.parse(productsJSON);
        return products;
    }
}

// FUNCION QUE ELIMINA UN ITEM DEL LOCAL STORAGE

function deleteCartProducts(id){
  let array = JSON.parse(localStorage.getItem("cartItems"));
  for (let i = 0; i < array.length; i++){
      if (array[i].id == id && array[i].username == localStorage.getItem("email")){
        array.splice(i, 1);
        localStorage.setItem("cartItems", JSON.stringify(array));
        return;
      }
  }
}







document.addEventListener('DOMContentLoaded', function () {
  const creditCard = document.getElementById('creditCard');
  const bankTransfer = document.getElementById('bankTransfer');
  const expirationDateField = document.getElementById('expirationDate');
  const creditCardFields = [document.getElementById('creditCardNumber'), document.getElementById('cvv'), expirationDateField];
  const bankTransferFields = [document.getElementById('accountNumber')];

  function enableFields(fields) {
    fields.forEach(function (field) {
      field.removeAttribute('disabled');
      field.style.backgroundColor = 'white';
    });
  }

  function disableFields(fields) {
    fields.forEach(function (field) {
      field.setAttribute('disabled', true);
      field.style.backgroundColor = '#e0e0e0';
    });
  }

  function validateNumberInput(field) {
    field.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    });
  }

  function validateExpirationDate() {
    const currentDate = new Date();
    const input = expirationDateField.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (input.length === 4) {
      const month = parseInt(input.substr(0, 2));
      const year = parseInt('20' + input.substr(2, 2));
      if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && year > currentDate.getFullYear()) {
        const formattedMonth = ('0' + month).slice(-2);
        expirationDateField.value = `${formattedMonth}/${year.toString().slice(-2)}`;
        return true;
      }
    }
    return false;
  }

  creditCardFields.forEach(validateNumberInput);
  bankTransferFields.forEach(validateNumberInput);

  expirationDateField.addEventListener('input', function () {
    if (validateExpirationDate()) {
      const input = expirationDateField.value.split('/');
      const year = parseInt('20' + input[1]);
      const month = parseInt(input[0]);
      if (year === currentDate.getFullYear() && month > currentDate.getMonth() + 1) {
        // La fecha no puede ser mayor que 12 meses a partir de la fecha actual
        expirationDateField.value = '';
        alert('La fecha de vencimiento no puede ser mayor de 12 meses a partir de la fecha actual.');
      }
    }
  });

  creditCard.addEventListener('change', function () {
    if (creditCard.checked) {
      enableFields(creditCardFields);
      disableFields(bankTransferFields);
    }
  });

  bankTransfer.addEventListener('change', function () {
    if (bankTransfer.checked) {
      enableFields(bankTransferFields);
      disableFields(creditCardFields);
    }
  });

  document.querySelector('form').addEventListener('submit', function (event) {
    if (creditCard.checked && !validateExpirationDate()) {
      event.preventDefault();
      alert('La fecha de vencimiento no es válida.');
    }
  });
});

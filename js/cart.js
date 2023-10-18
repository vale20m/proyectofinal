// CONSTANTES PARA EL FUNCIONAMIENTO DE TODO EL CODIGO (URL Y CONTENEDORES DE HTML)

const URL_USER = "https://japceibal.github.io/emercado-api/user_cart/25801.json"

// API que tiene el valor de las divisas actualizado

const URL_CURRENCIES = "https://cotizaciones-brou-v2-e449.fly.dev/currency/latest";

const cartItems = document.querySelector("#cartItems");

const cartControls = document.querySelector("#cartControls");

// FUNCION QUE CALCULA EL SUBTOTAL DEL PRODUCTO EN EL CARRITO, MULTIPLICANDO SU
// PRECIO POR LACANTIDAD, Y AGREGANDO LA MONEDA AL COMIENZO (DEVOLVIENDO UN SITRING)

function calculateSubtotal(string, num1, num2){
    const x = num1 * num2
    const subtotal = string + " " + x;
    return subtotal;
}

// Constantes para que el costo de la compra se actualice

const cartSubtotal = document.querySelector("#cartSubtotal");

const cartTotal = document.querySelector("#cartTotal");

const shipCost = document.querySelector("#shipCost");

// Función que calcula el subtotal de la compra

function calculateCartSubtotal(array){

  let cartSubtotal = 0;

  for (const product of array) {

    if (product.currency == "UYU"){

      cartSubtotal += Math.round((product.unitCost * product.count) / currencyValues.USD.sell);

    } else {

      cartSubtotal += product.unitCost * product.count;

    }

  }

  return cartSubtotal;

}

// Función que calcula el costo de envío de la compra

const shipType = document.querySelector("#shipType");

function calculateShipCost(num){

  if (shipType.value == "premium"){

    return Math.round(num * 0.15);

  } else if (shipType.value == "express"){

    return Math.round(num * 0.07);

  } else {

    return Math.round(num * 0.05);

  }

}

function updateQuantities(array){

  cartSubtotal.innerHTML = "USD " + calculateCartSubtotal(array);
  
  shipCost.innerHTML = "USD " + calculateShipCost(calculateCartSubtotal(array));

  cartTotal.innerHTML = "USD " + (calculateCartSubtotal(array) + calculateShipCost(calculateCartSubtotal(array)));
  
}


function showCart(array){

  // Agregamos un if para que las opciones de compra no se muestren si no hay items en el carrito
  if (array.length < 1){
    cartControls.classList.add("d-none");
  }

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

      deleteCartProducts(item.id, cartArray);
        
    });

    // ANIDAMOS UN ADD EVENT LISTENER AL ELEMENTO "INPUT", EL CUAL EJECUTA UNA FUNCION
    // QUE MODIFICA EL SUBTOTAL DEL PRODUCTO CADA VEZ QUE SE MODIFICA EL VALOR DE DICHO INPUT.

    const inputCount = div.querySelector("input");

    inputCount.addEventListener("input", function(){

      let change = false;

      const newCount = inputCount.value;
      if (newCount < 0){
        inputCount.value = 0;
        return;
      }

      const subtotalContainer = div.querySelector("#subtotal");
      subtotalContainer.textContent = calculateSubtotal(item.currency, item.unitCost, newCount);
      
      // TAMBIEN MODIFICAMOS LA CANTIDAD DEL ARTICULO Y LO ACTUALIZAMOS EN EL LOCAL STORAGE
      
      for (let i = 0; i < array.length-1; i++){
        if (array[i+1].id == item.id && array[i+1].username == localStorage.getItem("email")){
            array[i+1].count = newCount;
            change = true;
          }
      }

      if (!change){
        array[0].count = newCount;
      }

      localStorage.setItem("cartItems", JSON.stringify(array));

      // Modificamos el valor del subtotal, el costo de envío y el total del carrito
    
      updateQuantities(array);

    });

    // AGREGAMOS EL ELEMENTO A HTML
    cartItems.appendChild(div);
  }

  updateQuantities(array);

}

// Arreglo que contendrá todos los elementos del carrito

let cartArray = [];

// CREAMOS UN ARRAY QUE CARGA LOS ELEMENTOS DEL LOCAL STORAGE

let localItems = loadCartItems();

// Variable que contendra los distintos cambios de varias monedas a peso uruguayo

let currencyValues;

async function getCart(url1, url2) {
  try {
    let responseItems = await fetch(url1);
    let responseContentsItems = await responseItems.json();

    // Reemplazamos los elementos en el arreglo cartArray con los nuevos elementos del servidor
    cartArray = responseContentsItems.articles;

    cartArray[0].username = localStorage.getItem("email");

    if (localItems){
      // Agregamos los elementos del almacenamiento local al arreglo cartArray
      for (let i = 0; i < localItems.length; i++){
        if (localStorage.getItem("email") == localItems[i].username && localItems[i].id != cartArray[0].id){
          cartArray.push(localItems[i]);
        }
      }
    }

    localStorage.setItem("cartItems", JSON.stringify(cartArray));

    // Realizamos un segundo fetch para traer los cambios de otras monedas a peso uruguayo

    let responseCurrencies = await fetch(url2);
    let responseContentsCurrencies = await responseCurrencies.json();

    currencyValues = responseContentsCurrencies.rates;

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

getCart(URL_USER, URL_CURRENCIES);

function loadCartItems() {
    const productsJSON = localStorage.getItem("cartItems");

    if (productsJSON) {
        const products = JSON.parse(productsJSON);
        return products;
    }
}

// FUNCION QUE ELIMINA UN ITEM DEL LOCAL STORAGE

function deleteCartProducts(id, array){
  for (let i = 0; i < array.length; i++){
    if (array[i].id == id && array[i].username == localStorage.getItem("email")){
      array.splice(i, 1);
      updateQuantities(array);
      localStorage.setItem("cartItems", JSON.stringify(array));
      return;
    }
  }
}

shipType.addEventListener("change", () => updateQuantities(cartArray));


// Entrega 6 - Funcionamiento del form

document.addEventListener('DOMContentLoaded', function () {

  // Guardamos en constantes los elementos de HTML que necesitamos para el funcionamiento del form

  const creditCard = document.getElementById('creditCard');
  const bankTransfer = document.getElementById('bankTransfer');
  const expirationDateField = document.getElementById('expirationDate');
  const creditCardFields = [document.getElementById('creditCardNumber'), document.getElementById('cvv'), expirationDateField];
  const bankTransferFields = [document.getElementById('accountNumber')];

  // Función que actualiza el texto según la forma de pago elegida

  function updateSelectionText() {
    if (creditCard.checked) {
      selectionText.textContent = 'Tarjeta de crédito';
    } else if (bankTransfer.checked) {
      selectionText.textContent = 'Transferencia bancaria';
    } else {
      selectionText.textContent = 'No ha seleccionado';
    }
  }
  creditCard.addEventListener('change', updateSelectionText);
  bankTransfer.addEventListener('change', updateSelectionText);

  // Funciones que activa los campos de una opcion y desactiva los de la otra, según cual este seleccionada.

  function enableFields(fields){
    for (const field of fields){
      field.disabled = false;
      field.required = true;
    }
  }

  function disableFields(fields){
    for (const field of fields){
      field.disabled = true;
      field.required = false;
    }
  }

  // Función que verifica el contenido de los campos de la opción "tarjeta de crédito"

  function validateNumberInput(field) {
    field.addEventListener('input', function () {

      // Primero, eliminamos los caracteres no numéricos de los campos

      let value = this.value.replace(/\D/g, '');
      const input = expirationDateField.value.replace(/\D/g, ''); 
      
      if (field.id == 'creditCardNumber') {
        // Limitar el campo a 16 dígitos
        if (value.length > 16) {
          value = value.slice(0, 16);
        }
        field.value = value;
      }

      if (field.id == 'cvv') {
        // Limitar el campo a 3 dígitos
        if (value.length > 3) {
          value = value.slice(0, 3);
        }
        field.value = value;
      }

      if (field.id == 'expirationDate') {
        // Limitar el campo a 4 dígitos
        if (value.length > 4) {
          value = value.slice(0, 4);
        }
        field.value = value;
      }
    });
  }

  // LLamamos a la función anterior con cada campo del form

  for (const element of creditCardFields) {
    validateNumberInput(element);
  }

  for (const element of bankTransferFields) {
    validateNumberInput(element);
  }

  // Agregamos un addEventListener a cada radio button, ejecutandose cuando es seleccionado, y haciendo que sus campos se habiliten (y deshabilitando los del otro radio button)

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



  // Agrega un evento al botón de confirmación de compra

  const confirmPurchaseButton = document.getElementById('confirmPurchase');
  confirmPurchaseButton.addEventListener('click', function () {

    // Realiza las validaciones antes de confirmar la compra
    if (validatePurchase()) {
      // Simula una compra exitosa

      const successBanner = document.getElementById('successBanner');
      successBanner.style.display = 'block';

      setTimeout(function () {
        successBanner.style.display = 'none';
        const checkoutForm = document.getElementById('checkoutForm');
        checkoutForm.submit();
      
      }, 4000);
    }
  });

  // Función que realiza las validaciones del método de pago, devolviendo true en caso de que no haya errores

  function validatePurchase() {
    const shipType = document.getElementById('shipType');
    const calle = document.getElementById('calle');
    const numero = document.getElementById('numero');
    const esquina = document.getElementById('esquina');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const selectionText = document.getElementById('selectionText');
   
    // Limpia mensajes de error
    // for (const element of document.querySelectorAll('.error-message')) {
    //   element.innerHTML = "";
    // }

    // Verifica todas las validaciones aquí
    let isValid = true;

    // Observamos el contenido de cada uno de los inputs de calle, numero, esquina, tipo de envio, junto con forma de pago para asegurarnos de que ninguno este vacío
    // En caso de que alguno este vacío, mostramos un mensaje de error, y lo borramos en caso de que no lo este.
   
   if (calle.value == '') {
      document.getElementById('calle-error').textContent = 'Ingresa una calle';
      isValid = false;
    } else {
      document.getElementById('calle-error').textContent = "";
    }

    if (numero.value == '') {
      document.getElementById('numero-error').textContent = 'Ingresa un numero';
      isValid = false;
    } else {
      document.getElementById('numero-error').textContent = "";
    }

    if (esquina.value == '') {
      document.getElementById('esquina-error').textContent = 'Ingresa una esquina';
      isValid = false;
    } else {
      document.getElementById('esquina-error').textContent = "";
    }

    if (shipType.value == '0') {
      alert('Debes seleccionar un tipo de envío.');
      isValid = false;
    }

    if (selectionText.textContent == 'No ha seleccionado') {
      document.getElementById('selectionText-error').textContent = 'Debe seleccionar una forma de pago';
      isValid = false;
    } else {

      // También observamos cada uno de los campos de la forma de pago en caso de que se haya seleccionado alguna.

      // Observamos los campos del radio button "tarjeta de crédito"

      document.getElementById('selectionText-error').textContent = '';
      if (selectionText.textContent == 'Tarjeta de crédito') {
        for (const element of creditCardFields) {
          if (element.id == "creditCardNumber" && element.value.length < 16){
            document.getElementById('selectionText-error').innerHTML += 'El número de tarjeta está incompleto<br>';
            isValid = false;
          } else if (element.id == "cvv" && element.value.length < 3){
            document.getElementById('selectionText-error').innerHTML += 'El código de seguridad está incompleto<br>';
            isValid = false;
          } else if (element.id == "expirationDate" && element.value.length < 4){
            document.getElementById('selectionText-error').innerHTML += 'La fecha de vencimiento está incompleta';
            isValid = false;
          }
        }
      }
      

      // Observamos los campos del radio button "transferencia bancaria"

      else {
        console.log(bankTransferFields);
        for (const element of bankTransferFields){
          if (element.id == "accountNumber" && element.value == ""){
            document.getElementById('selectionText-error').innerHTML += 'Ingrese un número de cuenta válido';
            isValid = false;
          }
        }
      }

    }
      return isValid; 
    }
});
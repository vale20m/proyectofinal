// CONSTANTES PARA EL FUNCIONAMIENTO DE TODO EL CODIGO (URL Y CONTENEDORES DE HTML)

const URL_USER = "https://japceibal.github.io/emercado-api/user_cart/25801.json"

const cartTitle = document.querySelector("#cartTitle");

const cartItems = document.querySelector("#cartItems");

// FUNCION QUE CALCULA EL SUBTOTAL DEL PRODUCTO EN EL CARRITO, MULTIPLICANDO SU
// PRECIO POR LACANTIDAD, Y AGREGANDO LA MONEDA AL COMIENZO (DEVOLVIENDO UN SITRING)

function calculateSubtotal(string, num1, num2){
    const x = num1 * num2
    const subtotal = string + " " + x;
    return subtotal;
}

function showCart(array){

    // SECCIÓN QUE FUNCIONA COMO "TÍTULO" DE LA TABLA DEL CARRITO
    cartTitle.innerHTML = 
    `<tr>
        <th scope="col"></th>
        <th scope="col">Nombre</th>
        <th scope="col">Costo</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Subtotal</th>
    </tr>`
    for (const item of array) {

        // CREAMOS UNA SECCION DE LA TABLA DONDE AGREGAREMOS LOS ELEMENTOS EXTRAIDOS DEL JSON Y DEL LOCAL STORAGE

        const row = document.createElement("tr");
        row.innerHTML =
        `<td id="cartItemImage"><img class="img-thumbnail" src="${item.image}"></th>
        <td>${item.name}</td>
        <td>${item.currency} ${item.unitCost}</td>
        <td class="w-25"><input type="number" class="w-100 form-control" value="${item.count}" min="1"></td>
        <td id="subtotal">${calculateSubtotal(item.currency, item.unitCost, item.count)}</td>`;

        // ANIDAMOS UN ADD EVENT LISTENER AL ELEMENTO "INPUT", EL CUAL EJECUTA UNA FUNCION
        // QUE MODIFICA EL SUBTOTAL DEL PRODUCTO CADA VEZ QUE SE MODIFICA EL VALOR DE DICHO INPUT.

        const inputCount = row.querySelector("input");
        inputCount.addEventListener("input", function(){

            const newCount = inputCount.value;
            const subtotalContainer = row.querySelector("#subtotal");
            subtotalContainer.textContent = calculateSubtotal(item.currency, item.unitCost, newCount);
        
        });

        // AGREGAMOS EL ELEMENTO A HTML

        cartItems.appendChild(row);
    }
}

// ARREGLO QUE CONTENDRÁ TODOS LOS ELEMENTOS DEL CARRITO
let cartArray = [];

// CREAMOS UN ARRAY QUE CARGA LOS ELEMENTOS DEL LOCAL STORAGE
let localCartItems = loadCartItems();

async function getCart(url) {
  try {
    let response = await fetch(url);
    let responseContents = await response.json();

    // Reemplazamos los elementos en el arreglo cartArray con los nuevos elementos del servidor
    cartArray = responseContents.articles;

    if (localCartItems) {
      // Agregamos los elementos del almacenamiento local al arreglo cartArray
      cartArray = cartArray.concat(localCartItems);
    }

    // LLAMAMOS A LA FUNCION PARA MOSTRAR LOS ELEMENTOS DEL CARRITO
    showCart(cartArray);

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

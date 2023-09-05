/* Entrega 3: Para acceder correctamente a la informacion del producto seleccionado, guardamos su ID en una
   variable y la anidamos al resto de la URL */

const ProductNum = localStorage.getItem("productID");

const CAT_PRODUCTOS = "https://japceibal.github.io/emercado-api/products/" + ProductNum + ".json";

// "Traemos" utilizando el DOM el div de id "infoProduct" para colocar la información en él

const container = document.getElementById("infoProduct");

function showData(product) {
  // El for itera sobre las imágenes del producto
  container.innerHTML += `<div class="container"><h1 class="px-5 my-4 text-uppercase">${product.name}</h1> <hr>
  <p class="fs-3 shadow p-3 mb-3 mt-4 bg-body rounded fst-italic">${product.description}<p>
  <h2 class="shadow p-3 my-3 bg-body rounded">Precio: ${product.currency} ${product.cost}</h2>
  <h2 class="shadow p-3 mb-5 bg-body rounded">Ventas: ${product.soldCount} </h2>
  <p class="fs-4">Imágenes meramente ilustrativas: </p> <br>`;
  container.innerHTML += `<div class="container">`;
  for (let i = 0; i < product.images.length; i++){
    container.innerHTML += `<img class="w-50 border border-5 border-white shadow-sm p-3 mb-1 bg-body rounded" src="${product.images[i]}">`;
  }
  container.innerHTML += `</div></div>`;
}


async function tomarProductos (url){
  let response = await fetch(url);
  if (response.ok){
    let responseContents = await response.json();
    showData(responseContents);
  } else {
    alert("HTTP ERROR: " + response.status);
  }
}

tomarProductos(CAT_PRODUCTOS);

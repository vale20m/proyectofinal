/* Entrega 3: Para acceder correctamente a la informacion del producto seleccionado, guardamos su ID en una
   variable y la anidamos al resto de la URL */

const ProductNum = localStorage.getItem("productID");

const CAT_PRODUCTOS = "https://japceibal.github.io/emercado-api/products/" + ProductNum + ".json";

// "Traemos" utilizando el DOM el div de id "infoProduct" para colocar la información en él

const container = document.getElementById("infoProduct");



function showData(product) {
  // El for itera sobre las imágenes del producto
  container.innerHTML += `<h1 class="shadow p-3 mb-3 mt-3 bg-body rounded">${product.name}</h1> <h1 class="shadow p-3 mb-3 bg-body rounded">Costo: ${product.currency} ${product.cost}</h1> <h1 class="shadow p-3 mb-3 bg-body rounded">Vendidos: ${product.soldCount} </h1>
  <p class="fs-2 shadow p-3 mb-5 bg-body rounded">${product.description}<p> <br>`;
  container.innerHTML += `<div class="d-flex justify-content-around">`;
  for (let i = 0; i < product.images.length; i++){
    container.innerHTML += `<img class="img-thumbnail" src="${product.images[i]}">`;
  }
  container.innerHTML += `</div>`;
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

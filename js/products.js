/* Guardamos el valor de la categoría a la que ingresa el usuario
(establecida en el localStorage) y la incluimos en la URL de la API.
También definimos un "acceso" (container) a la ubicacion en la que guardaremos
los elementos extraidos de la API */

let CategoryNum = localStorage.getItem("catID");

let DATA_PRODUCTOS = "https://japceibal.github.io/emercado-api/cats_products/" + CategoryNum + ".json";

const container = document.getElementById("info");


/* Establecemos la estructura con la que se van a incluir los productos de la
API en el documento HTML */


function showData(dataArray) {
  // El for itera sobre los elementos del array
  container.innerHTML = "";
  for (const item of dataArray) {
    let imagen = item.image;
    container.innerHTML +=  `
    <h3> ${item.name}s</h3>
    <table border="25" class="auto-table list-group">
        <tr>
            <td width="40%"><img src="${imagen}" alt="${item.name}" width="100%" class="img-thumbnail"></td> 
            <td width="20%"> <h4>Costo</h4> ${item.currency}  -  ${item.cost}</td>
            <td width="50%"><h4>Info: </h4>${item.description}</td>
            <td width="20%" class = "cambio1"><small class= "text-muted" >Vendidos: ${item.soldCount}</small></td>
        </tr>
    </table>`;
  }
}

let arregloProductos = [];

function guardarProductos(array){
  for (const producto of array) {
    arregloProductos.push(producto);
  }
}

// Realizamos la llamada a través del fetch para obtener la información de la API

// Creamos una variable para guardar los productos

async function tomarDatos (url){
  let response = await fetch(url);
  if (response.ok){
    let responseContents = await response.json();

    // Agregamos los productos al arreglo "arregloProductos" la funcion "guardarProductos";
    guardarProductos(responseContents.products);

    showData(responseContents.products);
  } else {
    alert("HTTP ERROR: " + response.status);
  }
}

tomarDatos(DATA_PRODUCTOS);
console.log(arregloProductos);

// Desarrollamos el código para filtrar los productos

// Botones de orden (ascendente, descendente y por cantidad):

const botonOrdenDesc = document.querySelector("#sortDesc");
const botonOrdenAsc = document.querySelector("#sortAsc");
const botonOrdenVentas = document.querySelector("#sortByRel");

botonOrdenDesc.addEventListener("click", function(){
  const productosOrdenDesc = arregloProductos.sort((producto1, producto2) => producto2.cost - producto1.cost);
  showData(productosOrdenDesc);
});

botonOrdenAsc.addEventListener("click", function(){
  const productosOrdenAsc = arregloProductos.sort((producto1, producto2) => producto1.cost - producto2.cost);
  showData(productosOrdenAsc);
});

botonOrdenVentas.addEventListener("click", function(){
  const productosOrdenVentas = arregloProductos.sort((producto1, producto2) => producto2.soldCount - producto1.soldCount);
  showData(productosOrdenVentas);
});

// Casillas de cantidad (a elección):

const precioMin = document.querySelector("#rangeFilterPriceMin");
const precioMax = document.querySelector("#rangeFilterPriceMax");

// Boton para filtrar y limpiar busqueda (en relacion a las casillas anteriores):

const filtrar = document.querySelector("#rangeFilterPrice");
const limpiar = document.querySelector("#clearRangeFilter");

filtrar.addEventListener("click", function(){
  const productosFiltrados = arregloProductos.filter((producto) => (producto.cost >= precioMin.value && producto.cost <= precioMax.value));
  showData(productosFiltrados);
});

limpiar.addEventListener("click", function(){
  precioMax.value = "";
  precioMin.value = "";
  showData(arregloProductos);
});
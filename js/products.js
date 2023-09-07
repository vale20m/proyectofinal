/* Guardamos el valor de la categoría a la que ingresa el usuario
(establecida en el localStorage) y la incluimos en la URL de la API.
También definimos un "acceso" (container) a la ubicacion en la que guardaremos
los elementos extraidos de la API */

let CategoryNum = localStorage.getItem("catID");

let DATA_PRODUCTOS = "https://japceibal.github.io/emercado-api/cats_products/" + CategoryNum + ".json";

const container = document.getElementById("info");

/* Entrega 3: Función para redireccionar al usuario a "product-info.html" una vez
   seleccione un producto */

function selectProduct(productID){
  localStorage.setItem("productID", productID);
  window.location = "product-info.html";
}

/* Establecemos la estructura con la que se van a incluir los productos de la
API en el documento HTML */

/* Para la entrega 3 agregamos una funcion "onclick" a la tabla que muestra cada producto,
   que ejecuta la funcion "selectProduct" */

function showData(dataArray) {
  // El for itera sobre los elementos del array
  container.innerHTML = "";
  for (const item of dataArray) {
    let imagen = item.image;
    container.innerHTML +=  `
    <h3>${item.name}</h3>
    <table border="25" class="auto-table list-group" onclick="selectProduct(${item.id})">
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

let precioMayor = 0;
let precioMenor = Infinity;

function cambiarPrecio(producto){
    if(precioMayor < producto.cost){
      precioMayor = producto.cost;
    }
    if(precioMenor > producto.cost){
      precioMenor = producto.cost;
    }
}

function guardarProductos(array){
  for (const producto of array){
    cambiarPrecio(producto);
    arregloProductos.push(producto);
    console.log(precioMayor);
    console.log(precioMenor);
  }
}

// Realizamos la llamada a través del fetch para obtener la información de la API

// Creamos una variable para guardar los productos

const categoriaConteiner = document.querySelector(".lead");

async function tomarDatos (url){
  let response = await fetch(url);
  if (response.ok){
    let responseContents = await response.json();

    // Agregamos los productos al arreglo "arregloProductos" la funcion "guardarProductos";
    guardarProductos(responseContents.products);

    showData(responseContents.products);

    const categoria = responseContents.catName;
    categoriaConteiner.innerHTML += `Aqui podes ver todos nuestros  <u>${categoria}</u>`
  } else {
    alert("HTTP ERROR: " + response.status);
  }
}

tomarDatos(DATA_PRODUCTOS);

let arregloFiltrado = arregloProductos;

// Desarrollamos el código para filtrar los productos

// Botones de orden (ascendente, descendente y por cantidad):

const botonOrdenDesc = document.querySelector("#sortDesc");
const botonOrdenAsc = document.querySelector("#sortAsc");
const botonOrdenVentas = document.querySelector("#sortByRel");

botonOrdenDesc.addEventListener("click", function(){
  arregloFiltrado = arregloFiltrado.sort((producto1, producto2) => producto2.cost - producto1.cost);
  showData(arregloFiltrado);
});

botonOrdenAsc.addEventListener("click", function(){
  arregloFiltrado = arregloFiltrado.sort((producto1, producto2) => producto1.cost - producto2.cost);
  showData(arregloFiltrado);
});

botonOrdenVentas.addEventListener("click", function(){
  arregloFiltrado = arregloFiltrado.sort((producto1, producto2) => producto2.soldCount - producto1.soldCount);
  showData(arregloFiltrado);
});

// Casillas de cantidad (a elección):

const precioMin = document.querySelector("#rangeFilterPriceMin");
const precioMax = document.querySelector("#rangeFilterPriceMax");

// Boton para filtrar y limpiar busqueda (en relacion a las casillas anteriores):

const filtrar = document.querySelector("#rangeFilterPrice");
const limpiar = document.querySelector("#clearRangeFilter");

filtrar.addEventListener("click", function(){
  if (precioMin.value <= precioMayor && precioMin.value >= 0 && precioMax.value == ""){
    arregloFiltrado = arregloProductos.filter((producto) => (producto.cost >= precioMin.value));
  } else
  if (precioMax.value >= precioMenor && precioMin.value == ""){
    arregloFiltrado = arregloProductos.filter((producto) => (producto.cost <= precioMax.value));
  } else
  if (precioMax.value >= precioMin.value && precioMax.value >= precioMenor && precioMin.value <= precioMayor && precioMin.value >= 0){
    arregloFiltrado = arregloProductos.filter((producto) => (producto.cost >= precioMin.value && producto.cost <= precioMax.value));
  }
  showData(arregloFiltrado);
});

limpiar.addEventListener("click", function(){
  precioMax.value = "";
  precioMin.value = "";
  showData(arregloProductos);
  arregloFiltrado = arregloProductos;
});

// Agregamos las funciones para la barra de busqueda

const barraBuscar = document.querySelector("#barraBuscar");

// El evento "input" se activa cuando se modifica el valor de la barra de busqueda

barraBuscar.addEventListener("input", function(){
  arregloFiltrado = arregloFiltrado.filter((producto) => (producto.name.toLowerCase().includes(barraBuscar.value.toLowerCase()) || producto.description.toLowerCase().includes(barraBuscar.value.toLowerCase())));
  showData(arregloFiltrado);
});
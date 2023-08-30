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


// Realizamos la llamada a través del fetch para obtener la información de la API

// Creamos una variable para guardar los productos

let arregloProductos = [];

async function tomarDatos (url){
  let response = await fetch(url);
  if (response.ok){
    let responseContents = await response.json();

    // Agregamos los productos al arreglo "arregloProductos" mediante un "for of"
    for (const product of responseContents.products) {
      arregloProductos.push(product);
    }

    showData(responseContents.products);
  } else {
    alert("HTTP ERROR: " + response.status);
  }
}

tomarDatos(DATA_PRODUCTOS);

/*

const DATA_AUTOS = "https://japceibal.github.io/emercado-api/cats_products/101.json";

const container = document.getElementById("infoAutos"); // "Traemos" utilizando el DOM el div de id "container" para colocar la información en él

//tomarDatos(DATA_AUTOS);

*/

// Desarrollamos el código para filtrar los productos

// Botones de orden (ascendente, descendente y por cantidad):

const botonOrdenAsc = document.querySelector("#sortAsc");
const botonOrdenDesc = document.querySelector("#sortDesc");
const botonOrdenVentas = document.querySelector("#sortByCount");

botonOrdenAsc.addEventListener("click", function(){
  productosOrden = arregloProductos.sort((a, b) => a.name.localCompare(b.name));
  showData(productosOrden);
});

// Casillas de cantidad (a elección):

const cantMin = document.querySelector("#rangeFilterCountMin");
const cantMax = document.querySelector("#rangeFilterCountMax");

// Boton para filtrar y limpiar busqueda (en relacion a las casillas anteriores):

const filtrar = document.querySelector("#rangeFilterCount");
const limpiar = document.querySelector("#clearRangeFilter");


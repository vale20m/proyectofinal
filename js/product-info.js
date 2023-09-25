/* Entrega 3: Para acceder correctamente a la informacion del producto seleccionado, guardamos su ID en una
   variable y la anidamos al resto de la URL */

const ProductNum = localStorage.getItem("productID");

const CAT_PRODUCTOS = "https://japceibal.github.io/emercado-api/products/" + ProductNum + ".json";

// "Traemos" utilizando el DOM el div de id "infoProduct" para colocar la información en él

const container = document.getElementById("infoProduct");

const relatedProducts = document.getElementById("relatedProducts");

function showData(product) {
  container.innerHTML += `<div class="container"><h1 class="px-5 my-4 text-uppercase">${product.name}</h1> <hr>
  <p class="fs-3 shadow p-3 mb-3 mt-4 bg-body rounded fst-italic">${product.description}<p>
  <h2 class="shadow p-3 my-3 bg-body rounded">Precio: ${product.currency} ${product.cost}</h2>
  <h2 class="shadow p-3 mb-5 bg-body rounded">Ventas: ${product.soldCount} </h2>
  <p class="fs-4">Imágenes meramente ilustrativas: </p> <br>`;
  // El for itera sobre las imágenes del producto
  for (let i = 0; i < product.images.length; i++){
    container.innerHTML += `<img class="w-50 border border-5 border-white shadow-sm p-3 mb-1 bg-body rounded" src="${product.images[i]}">`;
  }
  container.innerHTML += `</div>`

  // LLAMAMOS A LA FUNCION PARA MOSTRAR LOS PRODUCTOS RELACIONADOS

  showRelatedProducts(product);

}

// FUNCION PARA MOSTRAR LOS PRODUCTOS RELACIONADOS

function showRelatedProducts(product){
  
  relatedProducts.innerHTML += `<h1>Productos relacionados: </h1>`;
  
  // MOSTRAMOS LOS PRODUCTOS RELACIONADOS CON EL PRODUCTO ACTUAL
  
  for (const related of product.relatedProducts) {

    relatedProducts.innerHTML += `<div class="col-sm-6 mt-3"><div class="card" onclick="getRelatedProduct(${related.id})">
    <img src="${related.image}" class="card-img-top">
    <div class="card-body">
    <h2 class="card-title px-3 fst-italic">${related.name}</h2>
    </div></div></div>`;

  }

}

// FUNCION PARA MOSTRAR UNO DE LOS PRODUCTOS RELACIONADOS AL SELECCIONARLO

function getRelatedProduct(productID){
  localStorage.setItem("productID", productID);
  window.location = "product-info.html";
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


// CÓDIGO EN RELACIÓN A LOS COMENTARIOS DE LOS PRODUCTOS



// Obtener elementos del formulario
const commentText = document.getElementById("opinion"); // Obtiene el elemento con el id "opinion"
const commentScore = document.getElementById("puntuacion"); // Obtiene el elemento con el id "puntuacion"
const enviarButton = document.getElementById("enviar"); // Obtiene el elemento con el id "enviar"
const contenedor1 = document.getElementById("contenedor1"); // Obtiene el elemento con el id "contenedor1"

// Obtener el correo del usuario de localStorage (si existe)
const correoUsuario = localStorage.getItem("email"); // Obtiene el valor del correo del usuario desde el almacenamiento local

// Obtener el ID del producto de localStorage (si existe)
const productID = localStorage.getItem("productID"); // Obtiene el valor del ID del producto desde el almacenamiento local


// Funcion para crear las estrellas

function mostrarEstrellas(puntuacion) {
  // Crea un contenedor para las estrellas
  const estrellasContainer = document.createElement("span");

  // Recorre las estrellas
  for (let i = 1; i <= 5; i++) {
    // Crea una estrella individual
    const estrella = document.createElement("span");

    // Aplica clases CSS para mostrar una estrella
    estrella.classList.add("fa", "fa-star");

    // Agrega la clase CSS "text-warning" si la estrella es parte de la puntuación
    if (i <= puntuacion) {
      estrella.classList.add("text-warning");
    }

    // Agrega la estrella al contenedor
    estrellasContainer.appendChild(estrella);
  }

  // Devuelve el contenedor de estrellas
  return estrellasContainer;
}



// Funcion para establecer el estilo de los comentarios



function setComments(comentario, bool){
  if (bool){
    // Crea elementos HTML para mostrar los comentarios en la página
    const listItem = document.createElement("li"); // Elemento de lista
    listItem.classList.add("list-group-item"); // Aplica una clase CSS al elemento

    // Crea elementos para mostrar la puntuación en forma de estrellas
    const estrellasContainer = mostrarEstrellas(comentario.puntuacion);// Contenedor de estrellas

    // Crea un elemento para mostrar el nombre de usuario en negritas
    const usuarioElement = document.createElement("span");
    usuarioElement.classList.add("fw-bold");
    usuarioElement.textContent = comentario.usuario;

    // Agrega el nombre de usuario, la fecha y las estrellas al elemento de lista
    const comentarioTexto = ` - ${comentario.fecha} - `;
    listItem.appendChild(usuarioElement);
    listItem.innerHTML += comentarioTexto;
    listItem.appendChild(estrellasContainer);
    // Agrega un salto de línea después de las estrellas
    listItem.appendChild(document.createElement("br"));

    // Crea un elemento para mostrar el comentario en estilo gris claro
    const comentarioElement = document.createElement("span");
    comentarioElement.classList.add("fw-light");
    comentarioElement.textContent = comentario.texto;

    // Agrega el contenido del comentario al elemento de lista
    listItem.appendChild(comentarioElement);

    // Agrega el elemento de lista al contenedor en la página
    contenedor1.appendChild(listItem);
  }
}




// Función para cargar comentarios desde una URL asociada al ID del producto
async function ComentariosURL(productID) {
  // Construye la URL para obtener los comentarios del producto
  const comentariosURL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

  try {
    const response = await fetch(comentariosURL); // Realiza una solicitud de red para obtener los comentarios

    const comentarios = await response.json(); // Convierte la respuesta en un objeto JSON

    if (comentarios && comentarios.length > 0) {
      // Convierte los comentarios en un formato deseado
      const comentariosConvertidos = comentarios.map(comentario => ({
        usuario: comentario.user,
        fecha: comentario.dateTime,
        puntuacion: comentario.score,
        texto: comentario.description
      }));

      comentariosConvertidos.forEach((comentario) => {
        setComments(comentario, true);
      });

    }

  } catch (error) {
    console.error("Error:", error); // Registra un error en la consola y muestra una alerta
    alert("Error al cargar los comentarios.");
  }
  // Llama a la función para cargar los comentarios al cargar la página
  cargarComentariosDesdeLocalStorage();
}
// Llama a la función para cargar los comentarios desde la URL al cargar la página
ComentariosURL(productID);




// Agregar evento click al botón "Agregar"

enviarButton.addEventListener("click", function () {
  
  // Obtener la fecha y hora actual en un formato específico
  const fecha = obtenerFechaActual();

  // Obtener el valor de la puntuación del comentario
  const puntuacion = parseInt(commentScore.value);

  // Crear un nuevo elemento de lista para mostrar el nuevo comentario
  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item");

  // Crear elementos para mostrar la puntuación en forma de estrellas
  const estrellasContainer = mostrarEstrellas(puntuacion);

  // Crear un elemento para mostrar el nombre de usuario en negritas (correo del usuario)
  const usuarioElement = document.createElement("span");
  usuarioElement.classList.add("fw-bold");
  usuarioElement.textContent = correoUsuario;

  // Agregar el correo del usuario, la fecha y las estrellas al elemento de lista
  const comentario = ` - ${fecha} - `;
  listItem.appendChild(usuarioElement);
  listItem.innerHTML += comentario;
  listItem.appendChild(estrellasContainer);
  // Agregar un salto de línea después de las estrellas
  listItem.appendChild(document.createElement("br"));

  // Crear un elemento para mostrar el texto del comentario en gris claro
  const comentarioElement = document.createElement("span");
  comentarioElement.classList.add("fw-light", "text-break");
  comentarioElement.textContent = commentText.value;

  // Agregar el contenido del comentario al elemento de lista
  listItem.appendChild(comentarioElement);

  // Agregar el elemento de lista al contenedor en la página
  contenedor1.appendChild(listItem);

  // Limpiar el campo de comentario y puntuación después de agregar el comentario
  commentText.value = "";
  commentScore.value = 1;
  
  // Guardar el comentario en localStorage
  guardarComentarioEnJSON({
    usuario: correoUsuario,
    fecha,
    puntuacion,
    texto: comentarioElement.textContent,
    productID: ProductNum
  });

});





// Función para guardar un comentario en formato JSON en localStorage
function guardarComentarioEnJSON(comentario) {
  let comentariosJSON = localStorage.getItem("comentarios");

  if (!comentariosJSON) {
    comentariosJSON = "[]";
  }

  const comentarios = JSON.parse(comentariosJSON);
  comentarios.push(comentario);

  localStorage.setItem("comentarios", JSON.stringify(comentarios));
}




// Función para cargar comentarios desde LocalStorage
function cargarComentariosDesdeLocalStorage() {
  const comentariosJSON = localStorage.getItem("comentarios");

  if (comentariosJSON) {
    const comentarios = JSON.parse(comentariosJSON);

    comentarios.forEach((comentario) => {
      setComments(comentario, comentario.productID == ProductNum);
    });

  }
}




// Función para obtener la fecha actual en un formato específico
function obtenerFechaActual() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");
  const hora = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const segundos = fecha.getSeconds().toString().padStart(2, "0");

  return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
}
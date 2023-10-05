/* Entrega 3: Para acceder correctamente a la informacion del producto seleccionado, guardamos su ID en una
   variable y la anidamos al resto de la URL */

const ProductNum = localStorage.getItem("productID");

const CAT_PRODUCTOS = "https://japceibal.github.io/emercado-api/products/" + ProductNum + ".json";

// "Traemos" utilizando el DOM el div de id "infoProduct" para colocar la información en él

const container = document.getElementById("infoProduct");

const relatedProducts = document.getElementById("relatedProducts");

function showData(product) {
  container.innerHTML += `
  <div class="row col-lg-11 col-12 mx-auto"><h1 class=" my-3 text-uppercase col-lg-7">${product.name}</h1>
  <div class="col-lg-1 my-auto"><img src="../img/heart.PNG" id="wishlist"></div>
  <button id="buyProduct" type="button" class="btn btn-primary fs-3 col-lg-4 my-auto">Comprar</button></div> <hr>
  <p class="fs-3 shadow p-3 mb-3 mt-4 bg-body rounded fst-italic">${product.description}<p>
  <h2 class="shadow p-3 my-3 bg-body rounded">Precio: ${product.currency} ${product.cost}</h2>
  <h2 class="shadow p-3 mb-5 bg-body rounded">Ventas: ${product.soldCount} </h2>
  <p class="fs-4">Imágenes meramente ilustrativas: </p> <br>`;

  // Carrusel de imágenes
  const carouselInner = document.querySelector("#productImageCarousel .carousel-inner");

  for (let i = 0; i < product.images.length; i++) {
    const isActive = i === 0 ? 'active' : '';
    carouselInner.innerHTML += `
      <div class="carousel-item ${isActive}">
        <img class="d-block w-100 mx-auto" id="productPictures" src="${product.images[i]}" alt="Imagen ${i + 1}">
      </div>`;
  }

  // LLAMAMOS A LA FUNCION PARA MOSTRAR LOS PRODUCTOS RELACIONADOS

  showRelatedProducts(product);

}


// FUNCION PARA MOSTRAR LOS PRODUCTOS RELACIONADOS

function showRelatedProducts(product){
  
  // MOSTRAMOS LOS PRODUCTOS RELACIONADOS CON EL PRODUCTO ACTUAL
  
  for (const related of product.relatedProducts) {

    relatedProducts.innerHTML += `<div class="col-sm-6 mt-3"><div class="card" onclick="getRelatedProduct(${related.id})">
    <img src="${related.image}" class="card-img-top">
    <div class="card-body">
    <h2 class="card-title mx-3 fst-italic">${related.name}</h2>
    </div></div></div>`;

  }

}

// FUNCION PARA MOSTRAR UNO DE LOS PRODUCTOS RELACIONADOS AL SELECCIONARLO

function getRelatedProduct(productID){
  localStorage.setItem("productID", productID);
  window.location = "product-info.html";
}

// FUNCION PARA CAMBIAR EL COLOR DE FONDO

function changeBackground(){

  const whiteItems1 = document.getElementsByClassName("shadow");
  const whiteItems2 = document.getElementsByClassName("card");

  if (localStorage.getItem("screenMode") == "light"){
  
    document.body.classList.remove("bg-dark", "text-white");
    switchMode.innerHTML = "Modo noche";

    for (const item of whiteItems1) {
      item.classList.remove("text-dark");
    }
    for (const item of whiteItems2) {
      item.classList.remove("text-dark");
    }

  }
  
  if (localStorage.getItem("screenMode") == "dark"){

    document.body.classList.add("bg-dark", "text-white");
    switchMode.innerHTML = "Modo día";

    for (const item of whiteItems1) {
      item.classList.add("text-dark");
    }
    for (const item of whiteItems2) {
      item.classList.add("text-dark");
    }

  }
}


async function tomarProductos (url){
  let response = await fetch(url);
  if (response.ok){
    let responseContents = await response.json();
    showData(responseContents);
    changeBackground();

    // GUARDAMOS EL BOTON DE COMPRAR EN UNA VARIABLE

    const buyProduct = document.querySelector("#buyProduct");

    // ANIDAMOS UN ADD EVENT LISTENER AL MISMO QUE SE ACTIVA CUANDO RECIBE UN CLICK

    buyProduct.addEventListener("click", function(){
      saveProductProperties({
        name: responseContents.name,
        unitCost: responseContents.cost,
        currency: responseContents.currency,
        image: responseContents.images[0],
        count: 1,
        id: responseContents.id
      });
      // Agregar una alerta después de agregar el producto al carrito
  alert("El producto se ha agregado al carrito.");
    });

    const wishlistButton = document.querySelector("#wishlist");

    loadHeartButton(wishlistButton, responseContents.id);

    wishlistButton.addEventListener("click", function(){
      if (wishlistButton.src == "http://127.0.0.1:5500/img/heart.PNG"){
        wishlistButton.src = "../img/colored-heart.PNG";
        saveWishlistProducts({
          name: responseContents.name,
          cost: responseContents.cost,
          currency: responseContents.currency,
          image: responseContents.images[0],
          id: responseContents.id
        });
      } else {
        wishlistButton.src = "../img/heart.PNG";
        deleteWishlistProduct(responseContents.id);
      }
    });

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
    const listItem = document.createElement("div"); // Elemento de lista
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

      // Ordena los comentarios de más viejos a más nuevos por fecha
      comentariosConvertidos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

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

// ENTREGA 5: FUNCIONALIDAD PARA GUARDAR PROPIEDADES DEL PRODUCTO SELECCIONADO EN EL LOCAL STORAGE

function saveProductProperties(product) {
  let productsJSON = localStorage.getItem("cartItems");

  if (!productsJSON) {
    productsJSON = "[]";
  }
  const products = JSON.parse(productsJSON);

  for (i = 0; i < products.length; i++){
    if (products[i].id == product.id){
      return;
    }
  }

  products.push(product);

  localStorage.setItem("cartItems", JSON.stringify(products));
}

// FUNCION QUE CARGA EL BOTON DE CORAZON CORRECTO

function loadHeartButton(button, id){
  let productsJSON = localStorage.getItem("wishlistItems");

  if (!productsJSON){
    button.src = "../img/heart.PNG";
    return;
  }

  const products = JSON.parse(productsJSON);

  for (i = 0; i < products.length; i++){
    if (products[i].id == id){
      button.src = "../img/colored-heart.PNG";
      return;
    }
  }

  button.src = "../img/heart.PNG";

}

// FUNCION QUE GUARDA UN ELEMENTO EN LA WISHLIST CUANDO SE PRESIONA EL CORAZON (SI NO ESTA AGREGADO)

function saveWishlistProducts(product) {
  let productsJSON = localStorage.getItem("wishlistItems");

  if (!productsJSON) {
    productsJSON = "[]";
  }
  const products = JSON.parse(productsJSON);

  for (i = 0; i < products.length; i++){
    if (products[i].id == product.id){
      return;
    }
  }

  products.push(product);

  localStorage.setItem("wishlistItems", JSON.stringify(products));
}

// FUNCION QUE ELIMINA UN ELEMENTO DEL LOCAL STORAGE CUANDO PRESIONA EL CORAZON (SI ESTABA EN LA WISHLIST)

function deleteWishlistProduct(id){
  let productsJSON = localStorage.getItem("wishlistItems");

  if (!productsJSON){
    return;
  }

  const products = JSON.parse(productsJSON);

  for (i = 0; i < products.length; i++){
    if (products[i].id == id){
      products.splice(i, 1);
      localStorage.setItem("wishlistItems", JSON.stringify(products));
      return;
    }
  }

}
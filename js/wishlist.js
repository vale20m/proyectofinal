

const wishlistItems = document.querySelector("#wishlistItems");

const localItems = JSON.parse(localStorage.getItem("wishlistItems")); 

function showWishlistedItems(array){

    wishlistItems.innerHTML = 
    `<h2 class="mb-4">Actualmente, tienes los siguientes productos en tu lista de deseados:</h2>`

    for (const product of array) {
        wishlistItems.innerHTML +=
        `<div class="row my-1 mx-2 border rounded position-relative">
            <div class="col-md-5">
                <img class="col-md-10 offset-md-0 col-10 offset-1 mt-2 mb-1 border rounded img-thumbnail" src="${product.image}">
                <button type="button" class="close btn col-1 position-absolute top-0 end-0" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="col-md-4 offset-md-0 col-11 offset-1 my-auto py-1 fs-4">${product.name}</div>
            <div class="col-md-3 offset-md-0 col-11 offset-1 my-auto py-1 fs-4">Precio: ${product.currency} ${product.cost}</div>
            </div>`
    }

}

function setItems(array){
    console.log(array);
    if (!array || array.length == 0){
        wishlistItems.innerHTML = `<h1 class="mt-5">Actualmente no hay productos en la lista de deseados</h1>`;
    } else {
        showWishlistedItems(array);
    }
}

setItems(localItems);
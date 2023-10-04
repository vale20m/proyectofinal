

const wishlistItems = document.querySelector("#wishlistItems");

const localItems = JSON.parse(localStorage.getItem("wishlistItems")); 

function showWishlistedItems(array){

    wishlistItems.innerHTML = 
    `<h2>Actualmente, tienes los siguientes productos en tu lista de deseados:</h2>`

    for (const product of array) {
        wishlistItems.innerHTML +=
        `<div class="row">
            <div class="col-4"><img src="${product.image}"></div>
            <div class="col-4">${product.name}</div>
            <div class="col-4">Precio: ${product.currency} ${product.cost}</div>
        </div>`
    }

}

function setItems(array){
    if (!array){
        wishlistItems.innerHTML = `<h1>Actualmente no hay productos en la lista de deseados</h1>`;
    } else {
        showWishlistedItems(array);
    }
}

setItems(localItems);
const wishlistItems = document.querySelector("#wishlistItems");

const localItems = JSON.parse(localStorage.getItem("wishlistItems")); 

function showWishlistedItems(array){

    wishlistItems.innerHTML = 
    `<h1 class="mt-3 mb-5 mx-auto">Actualmente, tienes los siguientes productos en tu lista de deseados:</h1>`

    for (const product of array) {
        
        const div = document.createElement("div");
        div.innerHTML =
        
        `<div class="w-75 mx-auto list-group-item list-group-item-action cursor-active border rounded">
            <div class="row my-1 mx-2 position-relative" onclick="showProduct(${product.id})">
                <img class="col-md-5 offset-md-0 col-10 offset-1 mt-2 mb-1 img-thumbnail" src="${product.image}">
                <div class="col-md-4 offset-md-0 col-11 offset-1 my-auto py-1 fs-4">${product.name}</div>
                <div class="col-md-3 offset-md-0 col-11 offset-1 my-auto py-1 fs-4">Precio: ${product.currency} ${product.cost}</div>
            </div>
            <button type="button" id="closeButton" class="close btn position-absolute top-0 end-0" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>`;

        const closeButton = div.querySelector("#closeButton");

        closeButton.addEventListener("click", function(){
            div.innerHTML = "";
            let newItems = [];
            deleteItems(newItems, product.id);
        });

        wishlistItems.appendChild(div);
    }

}

function showProduct(productID){
    localStorage.setItem("productID", productID);
    window.location = "product-info.html";
}

function setItems(array){
    if (!array || array.length == 0){
        wishlistItems.innerHTML = `<h1 class="mt-3 mx-auto">Actualmente no hay productos en la lista de deseados</h1>`;
    } else {
        showWishlistedItems(array);
    }
}

setItems(localItems);

function deleteItems(array, id){
    array = JSON.parse(localStorage.getItem("wishlistItems"));
    for (let i = 0; i < array.length; i++){
        if (array[i].id == id){
            array.splice(i, 1);
            localStorage.setItem("wishlistItems", JSON.stringify(array));
            if (array.length == 0){
                wishlistItems.innerHTML = `<h1 class="mt-3 mx-auto">Actualmente no hay productos en la lista de deseados</h1>`
            }
        }
    }
}
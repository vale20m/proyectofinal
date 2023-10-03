//

const URL_USER = "https://japceibal.github.io/emercado-api/user_cart/25801.json"

const cartTitle = document.querySelector("#cartTitle");

const cartItems = document.querySelector("#cartItems");

function calculateSubtotal(string, num1, num2){
    const x = num1 * num2
    const subtotal = string + " " + x;
    return subtotal;
}

let cartArray = [];

function showCart(array){
    cartTitle.innerHTML = 
    `<tr>
        <th scope="col"></th>
        <th scope="col">Nombre</th>
        <th scope="col">Costo</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Subtotal</th>
    </tr>`
    for (const item of array) {
        cartArray.push(item);
        cartItems.innerHTML +=
        `<tr>
            <td id="cartItemImage"><img class="img-thumbnail" src="${item.image}"></th>
            <td>${item.name}</td>
            <td>${item.currency} ${item.unitCost}</td>
            <td class="w-25"><input type="number" class="w-50 form-control" value="${item.count}" min="1"></td>
            <td>${calculateSubtotal(item.currency, item.unitCost, item.count)}</td>
        </tr>`
    }
}

async function getCart(url){
    try {
        let response = await fetch(url);
        let responseContents = await response.json();
        showCart(responseContents.articles);
    } catch (error) {
        console.log("HTTP ERROR: " + error.message);
    }
}

getCart(URL_USER);
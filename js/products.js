const DATA_AUTOS = "https://japceibal.github.io/emercado-api/cats_products/101.json";

const container = document.getElementById("infoAutos"); // "Traemos" utilizando el DOM el div de id "container" para colocar la información en él



function showData(dataArray) {
  // El for itera sobre los elementos del array
  for (const item of dataArray) {
    let imagen = item.image;
    container.innerHTML += `<img src="${imagen}" alt="imagen de auto"><p>${item.name} Costo: ${item.currency} ${item.cost} Vendidos: ${item.soldCount} </p>
    ${item.description} <br>`; 
  }
}


async function tomarDatosAutos (url){
  let response = await fetch(url);
  if (response.ok){
    let responseContents = await response.json();
    showData(responseContents.products);
  } else {
    alert("HTTP ERROR: " + response.status);
  }
}

tomarDatosAutos(DATA_AUTOS);

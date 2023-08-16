const DATA_AUTOS = "https://japceibal.github.io/emercado-api/cats_products/101.json";

const container = document.getElementById("infoAutos"); // "Traemos" utilizando el DOM el div de id "container" para colocar la información en él



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

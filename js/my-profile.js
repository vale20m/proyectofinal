document.addEventListener("DOMContentLoaded", function () {
    
  // Obtenemos el correo electrónico del `localStorage`

  const emailTemp = localStorage.getItem("email");

  // Guardamos en constantes los elementos del HTML

  const emailInput = document.getElementById("email");
  const nameInput = document.getElementById("name");
  const secondNameInput = document.getElementById("secondName");
  const lastNameInput = document.getElementById("lastName");
  const secondLastNameInput = document.getElementById("secondLastName");
  const phoneInput = document.getElementById("phone");

  // Verificamos que el usuario este logueado

  if (emailTemp) {

    // Rellena automáticamente el campo de correo con el valor del `localStorage` (el correo actual).

    emailInput.value = emailTemp;

    // En caso de que el usuario ya los haya llenado e ingrese nuevamente, se cargan los datos anteriores

    const userProfile = JSON.parse(localStorage.getItem(emailTemp));

    if (userProfile) {

      // Se rellenan los campos

      nameInput.value = userProfile.name;
      secondNameInput.value = userProfile.secondName;
      lastNameInput.value = userProfile.lastName;
      secondLastNameInput.value = userProfile.secondLastName;
      phoneInput.value = userProfile.phone;

      // Cargamos la imagen de perfil si existe.

      if (userProfile.profileImage) {
        const defaultProfileImage = document.getElementById("shownPicture");
        defaultProfileImage.src = userProfile.profileImage;
      }
    }
  }
  
  // Obtener el formulario del perfil

  const profileForm = document.getElementById("perfil-form");

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const userEmail = emailInput.value;

    if (userEmail) {

      if (emailTemp === userEmail) {

        // Si el correo de la cuenta actual coincide con el input, guardar los cambios en el `localStorage`

        if (nameInput.value && lastNameInput.value) {
          const userProfile = {
            name: nameInput.value,
            secondName: secondNameInput.value,
            lastName: lastNameInput.value,
            secondLastName: secondLastNameInput.value,
            phone: phoneInput.value,
            
            // Traemos la imagen del HTML y la guardamos

            profileImage: document.getElementById("shownPicture").src
          };

          // Guardar los datos del perfil en el `localStorage` utilizando el correo como clave

          localStorage.setItem(userEmail, JSON.stringify(userProfile));

          // Le damos un feedback al usuario sobre la situación

          const message = document.createElement("div");
          message.innerHTML =
          `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
            Datos del perfil actualizados exitosamente.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;

          document.body.appendChild(message);

        } else {

          const message = document.createElement("div");
          message.innerHTML =
          `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
          Por favor, complete los campos obligatorios.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`;

          document.body.appendChild(message);

        }

      } else {

        const message = document.createElement("div");
        message.innerHTML =
        `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
        El correo ingresado no coincide con el correo almacenado. Debe registrarse nuevamente.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

        document.body.appendChild(message);
      
      }

    } else {

      const message = document.createElement("div");
      message.innerHTML =
      `<div class="text-center alert alert-warning alert-dismissible fade show" role="alert">
      Por favor, complete el campo de correo.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;

      document.body.appendChild(message);

    }
  });

  // Obtenemos el campo de selección de imagen

  const profileImageInput = document.getElementById("profileImage");

  profileImageInput.addEventListener("change", function (e) {
    
    const selectedImage = e.target.files[0];

    if (selectedImage) {

      const reader = new FileReader();
      reader.onload = function (event) {
        const defaultProfileImage = document.getElementById("shownPicture");
        defaultProfileImage.src = event.target.result;
      };
      reader.readAsDataURL(selectedImage);

    }

  });

});
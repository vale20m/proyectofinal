document.addEventListener("DOMContentLoaded", function () {
    // Obtener el correo electrónico del `localStorage`.
    const Emailtemp = localStorage.getItem("email");
  
    // Verificar si el usuario está logueado.
    if (Emailtemp) {
      // Rellenar automáticamente el campo de correo con el valor del `localStorage`.
      const emailInput = document.getElementById("email");
      emailInput.value = Emailtemp;
  
      // Cargar los datos del perfil si existen en el `localStorage`.
      const storedProfileData = localStorage.getItem(Emailtemp);
      if (storedProfileData) {
        const userProfile = JSON.parse(storedProfileData);
        // Rellenar los campos del perfil con los datos recuperados.
        const nombreInput = document.getElementById("nombre");
        const segundoNombreInput = document.getElementById("segundo-nombre");
        const apellidoInput = document.getElementById("apellido");
        const segundoApellidoInput = document.getElementById("segundo-apellido");
        const telefonoInput = document.getElementById("telefono");
  
        nombreInput.value = userProfile.nombre;
        segundoNombreInput.value = userProfile.segundoNombre;
        apellidoInput.value = userProfile.apellido;
        segundoApellidoInput.value = userProfile.segundoApellido;
        telefonoInput.value = userProfile.telefono;
  
        // Cargar la imagen de perfil si existe.
        if (userProfile.profileImage) {
          const perfilImagedefecto = document.getElementById("imagen-Muestra");
          perfilImagedefecto.src = userProfile.profileImage;
        }
      }
    }
    
    // Obtener el formulario del perfil.
    const perfilForm = document.getElementById("perfil-form");
  
    perfilForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const emailInput = document.getElementById("email");
      const userEmail = emailInput.value;
  
      if (userEmail) {
        // Verificar si el correo en el `localStorage` coincide con el correo ingresado.
        const Emailtemp = localStorage.getItem("email");
  
        if (Emailtemp === userEmail) {
          // Los correos coinciden, guardar los datos del perfil en el `localStorage`.
          const nombreInput = document.getElementById("nombre");
          const segundoNombreInput = document.getElementById("segundo-nombre");
          const apellidoInput = document.getElementById("apellido");
          const segundoApellidoInput = document.getElementById("segundo-apellido");
          const telefonoInput = document.getElementById("telefono");
  
          if (nombreInput.value && apellidoInput.value) {
            const userProfile = {
              nombre: nombreInput.value,
              segundoNombre: segundoNombreInput.value,
              apellido: apellidoInput.value,
              segundoApellido: segundoApellidoInput.value,
              telefono: telefonoInput.value,
              // Convertir la imagen a base64 y guardarla.
              profileImage: document.getElementById("imagen-Muestra").src,
            };
  
            // Guardar los datos del perfil en el `localStorage` utilizando el correo como clave.
            localStorage.setItem(userEmail, JSON.stringify(userProfile));
  
            alert("Datos del perfil actualizados exitosamente.");
          } else {
            alert("Por favor, complete los campos obligatorios.");
          }
        } else {
          alert("El correo ingresado no coincide con el correo almacenado. Debe registrarse nuevamente.");
        }
      } else {
        alert("Por favor, complete el campo de correo.");
      }
    });
  
    // Obtener el campo de selección de imagen.
    const profileImageInput = document.getElementById("perfil-image");
  
    profileImageInput.addEventListener("change", function (e) {
      const selectedImage = e.target.files[0];
      if (selectedImage) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const perfilImagedefecto = document.getElementById("imagen-Muestra");
          perfilImagedefecto.src = event.target.result;
        };
        reader.readAsDataURL(selectedImage);
      }
    });
  });
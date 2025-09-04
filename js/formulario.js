const emailElement = document.getElementById("email");
const nameElement= document.getElementById("nombre");
const apellidoElement= document.getElementById("apellido");
const direccionElement= document.getElementById("direccion");
const ciudadElement= document.getElementById("ciudad");
const provinciaElement= document.getElementById("provincia");
const mensajeErrorCodigoPostal = document.getElementById("mensaje_error_codigoPostal");
const mensajeErrorElement = document.getElementById("mensaje_error");
const paisesElement = document.getElementById("pais");
const validacionEmail = /^[\w-]+@[\w-]+\.[a-z]{2,4}$/i;
const validacionCodigoPostal = /^\d+$/;
const codigoPostalElement = document.getElementById("postal-code");
const enviarElement = document.getElementById("btn_send_form");
const valorVacio="";

nameElement.addEventListener("input",bloquearEnviar());
apellidoElement.addEventListener("input",bloquearEnviar())
direccionElement.addEventListener("input",bloquearEnviar())
ciudadElement.addEventListener("input",bloquearEnviar())
provinciaElement.addEventListener("input",bloquearEnviar())

codigoPostalElement.addEventListener("input", () => {
  if (!validacionCodigoPostal.test(codigoPostalElement.value)) {
    mensajeErrorCodigoPostal.innerText = "Codigo Postal Invalido";
    mensajeErrorCodigoPostal.classList.add("text-red-500");
  }
  else {
    mensajeErrorCodigoPostal.classList.remove("text-red-500");
    mensajeErrorCodigoPostal.innerText = "";
  }
  bloquearEnviar();
})



emailElement.addEventListener("input", () => {
  if (!validacionEmail.test(emailElement.value)) {
    mensajeErrorElement.innerText = "Email Invalido"
    mensajeErrorElement.classList.add("text-red-500");
  }
  else {
    mensajeErrorElement.classList.remove("text-red-500");
    mensajeErrorElement.innerText = ""
  }
  bloquearEnviar();
})


async function cargaPais() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name")
    const result = await res.json();
    const paisesNombres = result.map((pais) => pais.name.common).sort()
    paisesNombres.forEach((e) => {
      paisesElement.innerHTML += `<option value="${e}" >${e}</option>`;
    })
  } catch (error) {
    console.error(error)
  }
}
cargaPais();

function bloquearEnviar (){
  if((emailElement.value, codigoPostalElement.value, nameElement.value, apellidoElement.value, provinciaElement.value, direccionElement.value, ciudadElement.value) === ""){
    enviarElement.classList.remove("hover:bg-[var(--primary-color)]")
    enviarElement.classList.remove("hover:text-white")
    enviarElement.disabled = true;
    enviarElement.title = "Rellena el los campos del formulario para enviar."
  }
  else{
    enviarElement.classList.add("hover:bg-[var(--primary-color)]")
    enviarElement.classList.add("hover:text-white")
    enviarElement.disabled=false;
    enviarElement.title = ""
  }
}

enviarElement.addEventListener("click", () => {
  Swal.fire({
    title: 'Enviado',
    text: 'En breve nos contactaremos con usted',
    icon: 'success',
    confirmButtonText: 'OK'
  })
})

bloquearEnviar();
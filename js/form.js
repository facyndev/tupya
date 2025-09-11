const fieldsElements = Array.from(document.querySelectorAll('input'))
const emailErrorMessageElement = document.getElementById('error_message_email');
const zipCodeErrorMessageElement = document.getElementById('error_message_zipCode');
const contactFormElement = document.getElementById('contact_form');
const btnSendFormElement = document.getElementById('btn_send_form');
const countryElement = document.getElementById('country');

const regularExpressions = {
  email: /^[\w-]+@[\w-]+\.[a-z]{2,4}$/i,
  zipCode: /^\d+$/
}

// Mediante una API de Paises, obtenemos una lista que posteriormente se carga en un SELECT MENU
async function loadCountries() {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name")
    const result = await res.json();
    const countriesName = result.map((country) => country.name.common).sort()
    countriesName.forEach((e) => {
      countryElement.innerHTML += `<option value="${e}" >${e}</option>`;
    })
  } catch (error) {
    console.error(error)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadCountries();
})

fieldsElements.forEach((el) => {
  el.addEventListener('input', (e) => {
    const isEmail = e.target.getAttribute('name') === 'email';
    const isZipCode = e.target.getAttribute('name') === 'zip_code' 

    checkSend(fieldsElements, isEmail, isZipCode)
  })
})

let invalidField = false; 

function checkSend(fields, isEmail, isZipCode) {
  // Verificamos si encontramos algun campo vacio
  const emptyField = fields.some((el) => el.value == "");
  const emailField = fields.find((el) => el.getAttribute("name") === 'email');
  const zipCodeField = fields.find((el) => el.getAttribute("name") === 'zip_code');

  // Verificamos que el email cumpla con la exresion
  if(!regularExpressions.email.test(emailField.value)) {
    if(isEmail) {
      emailErrorMessageElement.innerText = "El correo electrónico no es válido" 
    }
    invalidField = true;
  } else {
    if(isEmail) {
      emailErrorMessageElement.innerText = "";
    }
    invalidField = false;
  }

  // Verificamos que el codigo postal cumpla con la expresion
  if(!regularExpressions.zipCode.test(zipCodeField.value)) {
    if(isZipCode) {
      zipCodeErrorMessageElement.innerText = "El codigo postal no es válido" 
    }
    invalidField = true;
  } else {
    if(isZipCode) {
      zipCodeErrorMessageElement.innerText = "";
    }
    invalidField = false;
  }

  if(invalidField || emptyField) {
    btnSendFormElement.disabled = true;
    btnSendFormElement.title = "Debes rellenar todos los campos."
  } else {
    btnSendFormElement.disabled = false;
    btnSendFormElement.title = ""
  }
}

contactFormElement.addEventListener("submit", (e) => {
  e.preventDefault();

  Swal.fire({
    title: 'Enviado',
    text: '¡Su mensaje ha sido enviado correctamente! En breve nos contactaremos con usted',
    icon: 'success',
    confirmButtonText: 'OK'
  })
})



  const emailElement= document.getElementById("email");
  const mensajeErrorCodigoPostal= document.getElementById("mensaje_error_codigoPostal");
  const mensajeErrorElement= document.getElementById("mensaje_error");
  const paisesElement= document.getElementById("country");
  const validacionEmail= /^[\w-]+@[\w-]+\.[a-z]{2,4}$/i;
  const validacionCodigoPostal= /^\d+$/;
  const codigoPostalElement= document.getElementById("postal-code");

  codigoPostalElement.addEventListener("input",()=>{
    if(!validacionCodigoPostal.test(codigoPostalElement.value)){
        mensajeErrorCodigoPostal.innerText="Codigo Postal Invalido";
        mensajeErrorCodigoPostal.classList.add("text-red-400");
    }
    else{
        mensajeErrorCodigoPostal.classList.remove("text-red-400");
        mensajeErrorCodigoPostal.innerText="";
    }
  })



  emailElement.addEventListener("input",()=>{
    if (!validacionEmail.test(emailElement.value)){
      mensajeErrorElement.innerText="Email Invalido"
      mensajeErrorElement.classList.add("text-red-400");
    }
    else{
      mensajeErrorElement.classList.remove("text-red-400");
      mensajeErrorElement.innerText=""
    }
  })
  

async function cargaPais(){
  try {
    const res= await fetch("https://restcountries.com/v3.1/all?fields=name")
    const result= await res.json();
    const paisesNombres= result.map((pais) => pais.name.common).sort()
    paisesNombres.forEach((e)=>{
      paisesElement.innerHTML+=`<option value="${e}" >${e}</option>`;
    })
  } catch (error) {
    console.error(error)
  }
    }
cargaPais();
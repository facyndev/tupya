import { amountOrders } from "./orders.js";
const htmlElement = document.getElementsByTagName("html")[0];
const btnThemeElements = document.querySelectorAll("#btn_theme");
const iconDarkElements = document.querySelectorAll("#icon_dark");
const iconLightElements = document.querySelectorAll("#icon_light");
const btnMenu = document.getElementById("btn_menu");
const mobileMenu = document.getElementById("mobile_menu");
const btnMenuClose = document.getElementById("btn_menu_close");
const amountOrdersElements = document.querySelectorAll('#amount_orders');

// Botones para menu hamburgesa
btnMenu.addEventListener("click", () => {
  mobileMenu.classList.toggle("translate-x-full");
});
btnMenuClose.addEventListener("click", () => {
  mobileMenu.classList.toggle("translate-x-full");
})

// Cuando el contenido de nuestra pagina termine de cargar, ejecutamos lo que este dentro.
window.addEventListener("DOMContentLoaded", () => {
  changeTheme();

  // Actualizar la cantidad de pedidos en el boton del carrito
  amountOrdersElements.forEach((el) => {
    el.textContent = amountOrders();
  })
});

// Cambiar el tema mediante el boton
btnThemeElements.forEach(el => {
  el.addEventListener("click", () => {
    const themeModeItem = localStorage.getItem("theme");
    // En caso de no tener el item, lo creamos en el LocalStorage y añadimos el atributo a la etiqueta HTML
    if (!themeModeItem) {
      localStorage.setItem("theme", "dark");
      htmlElement.setAttribute("data-theme", "dark");
    } else {
      localStorage.removeItem("theme");
      htmlElement.removeAttribute("data-theme");
    }

    changeTheme();
  })
})

function changeTheme() {
  const themeModeItem = localStorage.getItem("theme");
  if (themeModeItem && themeModeItem === "dark") {
    htmlElement.setAttribute("data-theme", "dark");
    iconLightElements.forEach((el) => {
      el.classList.remove("opacity-0", "invisible")
      el.classList.add("opacity-100", "visible");
    })
    iconDarkElements.forEach((el) => {
      el.classList.add("opacity-0", "invisible");
      el.classList.remove("opacity-100", "visible");
    })
  } else {
    htmlElement.removeAttribute("data-theme");
    iconDarkElements.forEach((el) => {
      el.classList.remove("opacity-0", "invisible");
      el.classList.add("opacity-100", "visible");
    })
    iconLightElements.forEach((el) => {
      ;
      el.classList.add("opacity-0", "invisible");
      el.classList.remove("opacity-100", "visible");
    })
  }
}

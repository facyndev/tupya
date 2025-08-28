const htmlElement = document.getElementsByTagName("html")[0];
const btnThemeElement = document.getElementById("btn_theme");
const iconDarkElement = document.getElementById("icon_dark");
const iconLightElement = document.getElementById("icon_light");

// Cuando el contenido de nuestra pagina termine de cargar, ejecutamos lo que este dentro.
window.addEventListener("DOMContentLoaded", () => {
  changeTheme();
});

// Cambiar el tema mediante el boton
btnThemeElement.addEventListener("click", () => {
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
});

function changeTheme() {
  const themeModeItem = localStorage.getItem("theme");
  if (themeModeItem && themeModeItem === "dark") {
    htmlElement.setAttribute("data-theme", "dark");
    iconLightElement.classList.remove("opacity-0", "invisible");
    iconLightElement.classList.add("opacity-100", "visible");
    iconDarkElement.classList.add("opacity-0", "invisible");
    iconDarkElement.classList.remove("opacity-100", "visible");
  } else {
    htmlElement.removeAttribute("data-theme");
    iconDarkElement.classList.remove("opacity-0", "invisible");
    iconDarkElement.classList.add("opacity-100", "visible");
    iconLightElement.classList.add("opacity-0", "invisible");
    iconLightElement.classList.remove("opacity-100", "visible");
  }
}

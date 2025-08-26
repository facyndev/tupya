const htmlElement = document.getElementsByTagName("html")[0];
const btnTheme = document.getElementById('btnTheme');

// Cuando el contenido de nuestra pagina termine de cargar, ejecutamos lo que este dentro.
window.addEventListener('DOMContentLoaded', () => {
    const themeModeItem = localStorage.getItem('theme');
    if(themeModeItem && themeModeItem === 'dark') {
        htmlElement.setAttribute("data-theme", "dark");
    } else {
        htmlElement.removeAttribute("data-theme");
    }
})

// Cambiar el tema mediante el boton
btnTheme.addEventListener('click', () => {
    const themeModeItem = localStorage.getItem('theme');
    // En caso de no tener el item, lo creamos en el LocalStorage y añadimos el atributo a la etiqueta HTML
    if(!themeModeItem) {
        localStorage.setItem('theme', 'dark');
        htmlElement.setAttribute("data-theme", "dark");
    } else {
        localStorage.removeItem('theme')
        htmlElement.removeAttribute("data-theme");
    }
})
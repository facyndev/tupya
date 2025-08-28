// Filtrado de los pedidos
const pageUrl = new URL(window.location);
const params = new URLSearchParams(window.location.search);
const filterParams = params.get("filter");

// Obtenemos todos los botones que coincidan con la ID.
const filterButtonsElements = document.querySelectorAll("#filterButton");

filterButtonsElements.forEach((el) => {
  // A cada elemento la añadimos un evento
  el.addEventListener("click", (e) => {
    const filterType = e.currentTarget.attributes["data-filter"];
    const actualValues = params.getAll("filter");

    if (actualValues.includes(filterType.value)) {
      params.delete("filter", filterType.value);
    } else {
      params.append("filter", filterType.value);
    }

    updateFilters();
  });
});

function updateFilters() {
  const actualValues = params.getAll("filter");

  // Indicamos los nuevos parametros de busqueda a nuestra URL
  pageUrl.search = params.toString();

  // Creamos la url que posteriormente sera que la reemplza
  const newUrl = `${pageUrl.pathname}?${params.toString()}${pageUrl.hash}`;

  // Reemplazamos la URL actua con los nuevos parametros de busqueda
  history.replaceState(null, "", newUrl);

  filterButtonsElements.forEach((el) => {
    if (actualValues.includes(el.attributes["data-filter"].value)) {
      el.classList.remove("bg-[var(--bg-color-secondary)]");
      el.classList.add("bg-[var(--primary-color)]", "text-white");
    } else {
      el.classList.add("bg-[var(--bg-color-secondary)]");
      el.classList.remove("bg-[var(--primary-color)]", "text-white");
    }
  });
}

// Cuando termine de cargar todo el contenido de la pagina, actualiza los filtros
window.addEventListener("DOMContentLoaded", () => {
  updateFilters();
});

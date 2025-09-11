import { loadOrders } from "./orders.js";

// Filtrado de los pedidos
const pageUrl = new URL(window.location);
const params = new URLSearchParams(window.location.search);

// Obtenemos todos los botones que coincidan con la ID.
const filterButtonsElements = document.querySelectorAll("#filterButton");

filterButtonsElements.forEach((el) => {
  // A cada elemento la añadimos un evento
  el.addEventListener("click", (e) => {
    const filterType = e.currentTarget.getAttribute("data-filter");
    params.getAll("filter").includes(filterType)
      ? params.delete("filter", filterType)
      : params.append("filter", filterType);

    updateFilters();
  });
});

function updateFilters() {
  const actualValues = params.getAll("filter");

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

  const filterParams = params.getAll("filter");
  loadOrders(filterParams);
}

// Cuando termine de cargar todo el contenido de la pagina, actualiza los filtros
window.addEventListener("DOMContentLoaded", () => {
  updateFilters();
});

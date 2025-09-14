const pageUrl = new URL(window.location);
const pageParams = new URLSearchParams(window.location.search);

// Devuelve un array categorizado por tipo de filtro que junto a este contiene su array de valores correspondientes
function updateParamsList() {
  let paramsList = [];
  pageParams.entries().forEach(entry => {
    // Vericar si ya existe este tipo de filtro en el array de parametros de busqueda
    const typeFound = paramsList.find(p => p["type"].toString().includes(entry[0]))
    if (!typeFound) {
      paramsList.push({
        type: entry[0], values: [entry[1].toLowerCase()]
      })
    } else {
      typeFound.values.push(entry[1].toLowerCase())
    }
  });

  return paramsList;
}

// Devuelve la lista filtrada dependiendo los parametros de busqueda de la URL
export default function updateFilters(listToFilter, paramToAdd, isMultiple) {
  if (paramToAdd) {
    const getParams = pageParams.getAll(paramToAdd.type.toString());
    /**
     * Si el parametro es de multiple filtros hacemos que se puede añadir y eliminar
     * De lo contrario hacemos que solo cambie su valor
     */
    if (isMultiple) {
      if (getParams.includes(paramToAdd.value.toString())) {
        pageParams.delete(paramToAdd.type.toString(), paramToAdd.value.toString())
      } else {
        pageParams.append(paramToAdd.type.toString(), paramToAdd.value.toString());
      }
    } else {
      pageParams.set(paramToAdd.type.toString(), paramToAdd.value.toString())
    }
  }

  const paramsList = updateParamsList();
  updateHTMLElements(paramsList);

  // Actualizacion de parametros de busqueda y de la URL
  const newUrl = `${pageUrl.pathname}?${pageParams.toString()}`;
  history.replaceState(null, '', newUrl);

  // Filtrado
  let filtered = listToFilter;
  paramsList.forEach(({ type, values }) => {
    filtered = filtered.filter(item => values.some(value => item[type].toLowerCase().includes(value.toLowerCase())))
  })

  return paramsList.length > 0 ? filtered : listToFilter;
}

// Actualiza los estilos o contenidos de los elementos HTML de tipo filtros.
function updateHTMLElements(paramsList) {
  const btnFilterElements = document.querySelectorAll("[data-filter]");
  btnFilterElements.forEach((el) => {
    const filterType = el.getAttribute("data-filter-type");
    const filterValue = el.getAttribute("data-filter-value");
    const filterTypeFound = paramsList.find(param => param["type"] === filterType)
    /**
     * Si la longitud del array de valores del parametro de busqueda es 1,
     * significa que es un parametro simple y no multiple.
     * En ese caso, al tratarse de un input de busqueda lo que se actualiza
     * no es el estilo sino su valor para que al recargar la pagina
     * quede reflejado en pantalla.
    */
    if (filterTypeFound !== undefined && filterTypeFound?.values.length === 1 && (el?.type === 'text' || el?.type === 'search')) {
      el.value = filterTypeFound.values[0];
    } else if (filterTypeFound !== undefined && filterTypeFound?.values.includes(filterValue.toLowerCase())) {
      el.setAttribute("data-filter-active", "true")
    } else {
      el.setAttribute("data-filter-active", "false")
    }
  })
}

window.addEventListener('load', () => {
  const paramsList = updateParamsList();

  updateHTMLElements(paramsList);
})

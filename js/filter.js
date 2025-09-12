const pageUrl = new URL(window.location);
const pageParams = new URLSearchParams(window.location.search);

export default function updateFilters(listToFilter, param) {
  /**
   * Si la funcion recibe el parametro param realizamos la logica de filtrado,
   * de lo contrario, devolvemos su lista original
   */
  if(param) {
    // Actualizacion de parametros de busqueda y de la URL
    const getParamsFirst = pageParams.getAll(param.type.toString());
    if (getParamsFirst.includes(param.value.toString())) {
      pageParams.delete(param.type.toString(), param.value.toString())
    } else {
      pageParams.append(param.type.toString(), param.value.toString());
    }
    const newUrl = `${pageUrl.pathname}?${pageParams.toString()}`;
    history.replaceState(null, '', newUrl);
  
    // Creacion de lista de parametros para tener un filtrado dinamico
    const getParamsSecond = pageParams.getAll(param.type.toString());
    const paramsList = []
    pageParams.entries().forEach((param) => {
      paramsList.push({
        type: param[0],
        value: param[1]
      })
    })
  
    // Actualizacion de botones que coincidan con filtros
    const btnFilterElements = document.querySelectorAll("#btn_filter");
    btnFilterElements.forEach((el) => {
      const filterValue = el.getAttribute("data-filter-value");
      if(getParamsSecond.includes(filterValue)) {
        el.setAttribute("data-filter-active", "true")
      } else {
        el.setAttribute("data-filter-active", "false")
      }
    })
  
    // Filtrado
    const filtered = listToFilter.filter((item) => paramsList.some(({ type, value }) => item[type].toString().toLowerCase() === value.toString().toLowerCase()))
    
    return getParamsSecond.length !== 0 ? filtered : listToFilter;
  } else {
    return listToFilter;
  }
}

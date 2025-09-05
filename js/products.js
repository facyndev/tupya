const productsListElement = document.getElementById("products_list");
const searchInputElement = document.getElementById("search_product");
const filterElements = document.querySelectorAll('input[filter]');
const btnEraserElement = document.getElementById('btn_eraser');

const pageUrl = new URL(window.location);
const params = new URLSearchParams(window.location.search);

window.addEventListener("DOMContentLoaded", () => {
  productsListElement.innerHTML = '<p class="text-center text-xl font-medium text-[var(--text-color-secondary)]">Cargando...</p>';

  getFoods()
    .then((foods) => {
      updateFilters(foods)

      // Filtrador de busqueda
      searchInputElement.addEventListener("input", (e) => {
        params.set("search", e.currentTarget.value);
        updateFilters(foods);
      });

      // Borrar contenido del input con un boton
      btnEraserElement.addEventListener('click', () => {
      params.set('search', '');
      updateFilters(foods)
    }) 

      // Filtrador por categorias y regiones
      filterElements.forEach((el) => {
        el.addEventListener('click', (e) => {
          const currentElement = e.currentTarget;
          const filterType = currentElement.getAttribute("data-filter-type");
          const filterValue = currentElement.getAttribute("data-filter-value");
          !params.getAll(filterType).includes(filterValue) ? params.append(filterType, filterValue) : params.delete(filterType, filterValue);

          updateFilters(foods)
        })
      })

    })
    .catch((e) => []);
});

async function getFoods() {
  try {
    let foods = [];
    
    // Generamos 10 comidas random
    for (let i = 0; i < 10; i++) {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const { meals } = await res.json(); 
      foods.push(meals[0]);
    }

    return foods;
  } catch (err) {
    return [];
  }
}

function updateFilters(foods) {
  pageUrl.search = params.toString()

  const search = params.get('search') ?? "";
  const categories = params.getAll('category');
  const areas = params.getAll('area');

  // Reemplazar URL
  history.replaceState(null, "", pageUrl.search);

  // Mantener el HTML actualizado
  searchInputElement.value = search;
  filterElements.forEach((el) => {
    if (categories.includes(el.getAttribute('data-filter-value'))) {
      el.checked = true;
    }
  })

  // Comidas filtradas
  const filteredFoods = foods.filter((food) => {
    /**
     * Para cada filtro se verifica si su contenido existe, de lo contrario devuelve un estado en true para que continue con el siguiente.
     * Es decir, si el filtro esta activo (tiene contenido) realizamos su logica correspondiente, de lo contrario devolvemos verdadero.
     * Por ultimo hacemos un logica de los 3, donde 3 verdaderos signifca que el elemento del array es quien se filtrara.
     */
    const matchSearch = search ? food.strMeal.toLowerCase().includes(search.toLowerCase()) : true;
    const matchCategory = categories.length ? categories.includes(food.strCategory.toLowerCase()) : true;
    const matchArea = areas.length ? areas.includes(food.strArea.toLowerCase()) : true;

    return matchSearch && matchCategory && matchArea;
  });

  if (filteredFoods.length === 0) {
    productsListElement.innerHTML =
      `<p class="text-center text-xl font-medium text-[var(--text-color-secondary)]">Upps! No encontramos "${search}" en nuestras comidas.</p>`;
  } else {
    // Limpiamos el HTML para que cuando haya un nuevo filtro no se superponga con el anterior
    productsListElement.innerHTML = "";

    filteredFoods.map((meal) => {
      // Desestructuramos a product y cambiamos el nombre de la clave
      const {
        idMeal: id,
        strMeal: title,
        strInstructions: description,
        strMealThumb: image,
      } = meal;

      // Filtrar solo las claves del objecto que sean ingredientes
      const ingredients = Object.entries(meal)
        .filter((key) => key[0].includes("strIngredient") && key[1] != "")
        .map((ingredient) => ingredient[1]);

      // Hacemos uso de encodeURIComponent para que los ingredientes que tengan espacio puedan ser obtenidos correctamente como imagen. Por ejemplo: Basmati Rice -> Basmati%20Rice
      productsListElement.innerHTML += `
        <div class="w-full flex justify-between gap-4 max-tablet:flex-col">
            <a class="w-full flex items-start gap-4" href="./product.html?id=${id}" target="_blank">
                <img class="w-32 h-32 object-fit rounded-2xl" src="${image}" alt="${title}">
                <div class="h-full flex flex-col justify-between items-start">
                  <div class="flex flex-col gap-1">        
                      <h3 class="text-xl text-[var(--text-color)] hover:underline">${title}</h3>
                      <p class="text-base text-[var(--text-color-secondary)] w-150 line-clamp-2">${description}</p>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap max-mobile:hidden">
                      ${ingredients
                          .map(
                            (ingredient) => ingredient ? 
                              `<img src="https://www.themealdb.com/images/ingredients/${encodeURIComponent(
                                ingredient
                              )}.png" class="rounded-xl grayscale" alt="${ingredient}" width="24" height="24" title="${ingredient}"/>` : ''
                          )
                          .join("")}
                  </div>
                </div>
            </a>
            <button 
                class="rounded-xl h-32 bg-[var(--low-tone-color)] px-10 text-white hover:cursor-pointer max-tablet:h-fit"
              >
                <iconify-icon
                      class="text-[var(--primary-color)]" icon="line-md:plus" 
                      width="30" 
                      height="30"
                    >
                    </iconify-icon>
            </button>
        </div>
        `;
    });
  }
}

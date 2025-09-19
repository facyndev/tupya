import { updateButtons } from './orders.js';
import updateFilters from './filter.js';
const productsListElement = document.getElementById("products_list");
const searchInputElement = document.getElementById("search_product");
const btnEraserElement = document.getElementById('btn_eraser');

window.addEventListener("load", () => {
  productsListElement.innerHTML = '<p class="text-center text-xl font-medium text-[var(--text-color-secondary)]">Cargando...</p>';
  document.title = 'Cargando... | TupYa';

  getFoods()
    .then((foods) => {
      document.title = 'Comidas | TupYa';

      const filteredFoods = updateFilters(foods)
      loadFoods(filteredFoods)

      // Cuando tenemos los productos, podremos añadirles los ventos a los botones.
      updateButtons()

      // Filtrar por buscador
      searchInputElement.addEventListener('input', (e) => {
        const currentElement = e.target;
        const filterType = currentElement.getAttribute('data-filter-type');
        const filterValue = currentElement.value;

        const filteredFoods = updateFilters(foods, { type: filterType, value: filterValue }, false)
        loadFoods(filteredFoods)
        updateButtons()
      })

      btnEraserElement.addEventListener('click', (e) => {
        const filterType = searchInputElement.getAttribute('data-filter-type')
        searchInputElement.value = "";
        const filterValue = searchInputElement.value;

        const filteredFoods = updateFilters(foods, { type: filterType, value: filterValue }, false)
        loadFoods(filteredFoods)
        updateButtons()
      })

      // Filtrar por categorias y areas
      const filterButtonsElements = document.querySelectorAll('[data-filter]')
      filterButtonsElements.forEach((el) => {
        el.addEventListener('click', (e) => {
          const currentElement = e.currentTarget;
          const filterType = currentElement.getAttribute('data-filter-type');
          const filterValue = currentElement.getAttribute('data-filter-value');

          const filteredFoods = updateFilters(foods, { type: filterType, value: filterValue }, true)
          loadFoods(filteredFoods)
          updateButtons()
        })
      })
    })
    .catch(() => []);
});

// Esta funcion genera 10 comidas random que se llaman desde una api, una vez cargadas las 10 comidas, se las guarda en el localstorage y las devuelve en un array
async function getFoods() {
  const foodsItem = localStorage.getItem('foods')
  try {
    let foods = [];

    if (foodsItem !== null) {
      const { foods: foodsList } = JSON.parse(foodsItem)
      foods = foodsList;
    } else {
      // Generamos 10 comidas random
      for (let i = 0; i < 10; i++) {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const { meals } = await res.json();
        foods.push(meals[0]);
      }

      const foodsObj = {
        foods: foods
      }

      localStorage.setItem('foods', JSON.stringify(foodsObj))
    }

    return foods;
  } catch (err) {
    return [];
  }
}

function loadFoods(foods) {
  // Limpiamos el HTML para que cuando haya un nuevo filtro no se superponga con el anterior
  productsListElement.innerHTML = "";

  foods.map((meal) => {
    const { idMeal: id, strMeal: title, strInstructions: description, strCategory: category, strMealThumb: image } = meal;

    // Filtrar solo las claves del objecto que sean ingredientes
    const ingredients = Object.entries(meal)
      .filter((key) => key[0].includes("strIngredient") && key[1] != "")
      .map((ingredient) => ingredient[1]);


    // Hacemos uso de encodeURIComponent para que los ingredientes que tengan espacio puedan ser obtenidos correctamente como imagen. Por ejemplo: Basmati Rice -> Basmati%20Rice
    productsListElement.innerHTML +=
      `
      <div class="w-full flex justify-between gap-4 max-tablet:flex-col">
        <a class="w-full flex items-start gap-4" href="./comida.html?id=${id}" target="_blank">
          <div class="w-32 h-32 rounded-2xl overflow-hidden relative flex-none bg-[url(${image + '/small'})] bg-center bg-cover">
             <span class="absolute top-0 left-0 p-1 text-xs bg-[var(--low-tone-color)] text-black w-fit rounded-br-xl">${category}</span>
          </div>
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
              ingredient + '-small'
            )}.png" class="rounded-xl grayscale" alt="${ingredient} loading=" lazy" decondig="async" width="24"
                height="24" title="${ingredient}" />` : ''
        )
        .join("")}
            </div>
          </div>
        </a>
        <button data-id="${id}"
          class="min-w-32 h-32 max-w-full flex-none flex items-center gap-2 justify-center bg-[var(--low-tone-color)] px-10 text-white rounded-xl text-[var(--primary-color)] hover:cursor-pointer max-tablet:h-12"
          id="btn_add_product">
          <iconify-icon icon="line-md:plus" width="30" height="30">
          </iconify-icon>
        </button>
      </div>
    `;
  });
}

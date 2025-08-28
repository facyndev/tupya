const productsListElement = document.getElementById("products_list");
const searchInputElement = document.getElementById("search_product");
const params = new URLSearchParams(window.location.search);

searchInputElement.addEventListener("input", (e) => {
  params.set("search", e.currentTarget.value);
  updateSearch(params.get("search"));
});

let foods = [];

async function getFoods() {
  try {
    const res = await fetch("../mock/products.json");
    const { meals } = await res.json();
    foods = meals;
  } catch (err) {
    foods = [];
    console.error("Error cargando foods", err);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await getFoods();

  updateSearch(params.get("search") ?? "");
});

async function updateSearch(search) {
  // Si search existe, entonces reemplazamos
  history.replaceState(null, "", `?search=${params.get("search") ?? ""}`);

  const filteredFoods =
    search != ""
      ? foods.filter((food) =>
          food.strMeal.toLowerCase().includes(search.toLowerCase())
        )
      : foods;

  if (filteredFoods.length === 0) {
    productsListElement.innerHTML =
      '<p class="text-center text-base text-[var(--text-color-secondary)] mt-[30%]">Upps! No encontramos la comida que estas buscando.</p>';
  } else {
    // Limpiamos el HTML para que cuando haya un nuevo filtro no se superponga con el anterior
    productsListElement.innerHTML = "";

    filteredFoods.map((meal) => {
      // Desestructuramos a product y cambiamos el nombre de la clave
      const {
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
                <div class="w-full flex justify-between">
                    <div class="w-full flex items-start gap-4">
                        <img class="w-32 h-32 object-fit rounded-2xl" src="${image}" alt="${title}">
                        <div class="h-full flex flex-col justify-between items-start">
                        <div class="flex flex-col gap-1">        
                            <h3 class="text-xl text-[var(--text-color)]">${title}</h3>
                            <p class="text-base text-[var(--text-color-secondary)] w-150 line-clamp-2">${description}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            ${ingredients
                              .map(
                                (ingredient) =>
                                  `<img src="https://www.themealdb.com/images/ingredients/${encodeURIComponent(
                                    ingredient
                                  )}.png" class="rounded-xl grayscale" alt="${ingredient}" width="24" height="24" title="${ingredient}"/>`
                              )
                              .join("")}
                        </div>
                        </div>
                    </div>
                    <button class="rounded-xl bg-[var(--low-tone-color)] px-10 text-white hover:cursor-pointer"><iconify-icon
                        class="text-[var(--primary-color)]" icon="line-md:plus" width="30" height="30"></iconify-icon><button>
                </div>
        `;
    });
  }
}

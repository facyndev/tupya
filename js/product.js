const productDetailsElement = document.getElementById('product_details');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

window.addEventListener('DOMContentLoaded', () => {
    productDetailsElement.innerHTML = '<p class="w-full mx-auto text-center text-xl font-medium text-[var(--text-color-secondary)]">Cargando...</p>'
    document.title = "Cargando... | TupYa";

    getFood(Number(id))
        .then((food) => {
            const { strMeal: title, strInstructions: description, strMealThumb: image, strCategory: category, strTags: tags, strYoutube: youtubeVideo } = food[0]
            const ingredients = Object.entries(food[0])
                .filter((key) => key[0].includes("strIngredient") && key[1] != "")
                .map((ingredient) => ingredient[1]);

            document.title = `${title} | TupYa`
            productDetailsElement.innerHTML = `
                <div class="flex gap-2 tablet:h-[calc(100vh-95px)] sticky tablet:top-4 max-tablet:static max-tablet:flex-col-reverse">
                    <div class="flex flex-col gap-2 w-16 overflow-y-auto max-tablet:flex-row max-tablet:w-full max-tablet:h-16 max-tablet:overflow-x-auto">
                        ${ingredients.map((ingredient) => ingredient ? `<img src="https://www.themealdb.com/images/ingredients/${encodeURI(ingredient + '-small')}.png" class="w-full h-auto max-tablet:w-fit" alt="${ingredient}" title="${ingredient}">` : '').join("")}
                    </div>
                    <div class="flex-1">
                        <img class="w-full h-full rounded-xl object-cover object-center" src="${image}" alt="${title}">
                    </div>
                </div>

                <div class="flex flex-col gap-4 flex-1">
                    <span class="text-base px-6 py-2 bg-[var(--low-tone-color)] text-black w-fit rounded-full">${category}</span>
                    <h1 class="text-5xl text-[var(--text-color)]">${title}</h1>
                    <p class="text-sm text-[var(--text-color)]">
                    ${tags !== null ? tags.split(",").map((tag) => `<span class="inline">${tag}</span>`).join(" &bull; ") : ''}
                    </p>
                    <button
                    class="flex items-center justify-center gap-2 w-full bg-[var(--primary-color)] p-4 text-white text-lg cursor-pointer rounded-full">
                    <iconify-icon class="text-white" icon="line-md:plus" width="30" height="30">
                    </iconify-icon>
                        Pedir "${title}"
                    </button>
                    <div class="h-[1px] w-full bg-[var(--borders-color)]"></div>
                    <p class="text-[var(--text-color-secondary)] text-md mb-12">${description}</p>
                    <h3 class="text-2xl font-medium text-[var(--text-color)]">Mira la receta completa</h3>

                    <iframe class="w-full rounded-xl" width="560" height="315" src="https://www.youtube.com/embed/${youtubeVideo.split("?v=")[1]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                `
        })
        .catch((e) => console.log(e))
})

export function getFood(id) {
    return new Promise(async (resolve, reject) => {
        // Verificamos que la ID sea un valor numerico
        if (typeof id != "number") reject("La ID debe ser un valor numerico.")
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        if (response.ok) {
            const { meals } = await response.json();
            resolve(meals)
        } else {
            reject("Ocurrio un error al obtener la comida.")
        }
    })

}

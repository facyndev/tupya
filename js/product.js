const productDetailsElement = document.getElementById('product_details');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

window.addEventListener('DOMContentLoaded', () => {
    getFood(id)
        .then((food) => {
            productDetailsElement.innerHTML = ''
        })
        .catch((e) => console.log(e))
})

function getFood(id) {
    return new Promise(async (resolve, reject) => {
        if(typeof id != Number) reject("La ID debe ser un valor numerico.")
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)  
        if(response.ok) {
            const { meals } = await response.json();
            resolve(meals)
        } else {
            reject("Ocurrio un error al obtener la comida.")
        }
    })

}

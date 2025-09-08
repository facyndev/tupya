import { getFood } from "./product.js";

// Funcion para añadir los eventos a los botones
export function updateButtons() {
    const btnFoodElements = Array.from(document.querySelectorAll("#btn_add_product"))
    btnFoodElements.forEach((el) => {
        el.addEventListener('click', (e) => {
            // Obtenemos la ID del elemento al cual se le hizo click a traves de su atributo
            const currentId = e.currentTarget.getAttribute('data-id');
            getFood(Number(currentId))
                .then((foods) => {
                    const food = foods[0];
                    // todo: hacer logica para agregar productos al carrito
                });
        })
    })
}




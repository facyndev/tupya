import { getFood } from "./product.js";

// Funcion para añadir los eventos a los botones
export function updateButtons() {
    const btnAddProductButtons = Array.from(document.querySelectorAll("#btn_add_product"))
    const newOrderMessageElement = document.getElementById('newOrder_message')

    btnAddProductButtons.forEach((el) => {
        el.addEventListener('click', (e) => {
            // Obtenemos la ID del elemento al cual se le hizo click a traves de su atributo
            const currentId = e.currentTarget.getAttribute('data-id');

            // Obtenemos el contenido HTML del boton
            const beforeHTML = el.outerHTML;
            el.textContent = 'Cargando...'

            newOrder(currentId, el, newOrderMessageElement, beforeHTML)
        })
    })
}

// Funcion para crear un nuevo pedido de una comida
function newOrder(currentId, btnAddProductElement, newOrderMessageElement, beforeHTML) {
    getFood(Number(currentId))
        .then((food) => {
            /**
             * La funcion getFood hace uso de la API la cual al obtener una comida a traves
             * de su ID devuelve un array con un unico elemento, lo que nos obligar a tener que 
             * seleccionar su indice.
            */
            const { idMeal: id, strMeal: title } = food[0];

            const getOrders = JSON.parse(localStorage.getItem('orders'));
            const newOrderObject = {
                "id": id,
                "title": title,
                "amount": 1
            }

            if (getOrders) {
                // Verificar si hay un pedido existente con la comida que se esta intentando añadir
                const orderExist = getOrders.orders.find((order) => order.id.toString() === newOrderObject.id.toString())
                if (orderExist) {
                    /**
                     * En este caso decimos que si ya se encuentra una orden realizada previamente con la comida
                     * que se esta intentando añadir, lo que hacemos es agregarle +1 en la cantidad del pedido.
                    */
                    orderExist.amount += 1;

                    // Y volvemos a cambiar el contenido del item para que guarde el nuevo valor de "amount"
                    localStorage.setItem('orders', JSON.stringify({ "orders": [...getOrders.orders] }))
                } else {
                    localStorage.setItem('orders', JSON.stringify({ "orders": [...getOrders.orders, newOrderObject] }))
                };
            } else {
                localStorage.setItem('orders', JSON.stringify({ "orders": [newOrderObject] }));
            }

            console.log(beforeHTML)
            btnAddProductElement.innerHTML = '<iconify-icon icon="mingcute:check-fill" width="24" height="24"></iconify-icon> Pedido completado';
            if(newOrderMessageElement) {
                newOrderMessageElement.classList.remove('text-red-500');
                newOrderMessageElement.classList.add('text-green-500');
                newOrderMessageElement.textContent = `Tu nuevo pedido de "${title}" fue procesado correctamente.`
            }

            // Pasado 5 segundos, volvemos el contenido del boton a como era anteriomente y ademas borramos el contenido del mensaje de alerta
            setTimeout(() => {
                btnAddProductElement.innerHTML = beforeHTML;
                if(newOrderMessageElement) {
                    newOrderMessageElement.textContent = ''
                }
            }, 5000)
        })
        .catch((e) => {
            console.error("Ocurrio un error: ", e)
            if(newOrderMessageElement) {
                newOrderMessageElement.classList.remove("text-green-500");
                newOrderMessageElement.classList.add("text-red-500");
                newOrderMessageElement.textContent = 'Ocurrio un error al agregar la comida. Intente de nuevo mas tarde.'
            }
        })
}







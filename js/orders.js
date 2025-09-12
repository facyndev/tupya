import updateFilters from "./filter.js";
import { getFood } from "./product.js";
// Funcion para añadir los eventos a los botones
export function updateButtons() {
  const btnAddProductButtons = Array.from(
    document.querySelectorAll("#btn_add_product")
  );
  const newOrderMessageElement = document.getElementById("newOrder_message");

  btnAddProductButtons.forEach((el) => {
    el.addEventListener("click", (e) => {
      // Obtenemos la ID del elemento al cual se le hizo click a traves de su atributo
      const currentId = e.currentTarget.getAttribute("data-id");

      // Guardamos el contenido actual del boton para posteriomente restaurarlo
      const beforeHTMLContent = el.innerHTML;
      el.textContent = "Cargando...";

      newOrder(currentId, el, newOrderMessageElement, beforeHTMLContent);
    });
  });
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders"))?.orders || [];
}

// Funcion para crear un nuevo pedido de una comida
function newOrder(currentId, btnAddProductElement, newOrderMessageElement, beforeHTMLContent) {
  getFood(Number(currentId))
    .then((food) => {
      /**
       * La funcion getFood hace uso de la API la cual al obtener una comida a traves
       * de su ID devuelve un array con un unico elemento, lo que nos obligar a tener que
       * seleccionar su indice.
       */
      const { idMeal: id, strMeal: title, strMealThumb: image } = food[0];

      const getOrders = JSON.parse(localStorage.getItem("orders"));
      const newOrderObject = {
        id: id,
        title: title,
        date: new Date(),
        status: "in_process",
        image: image,
        amount: 1,
      };

      if (getOrders) {
        // Verificar si hay un pedido existente con la comida que se esta intentando añadir
        const orderExist = getOrders.orders.find(
          (order) => order.id.toString() === newOrderObject.id.toString()
        );
        if (orderExist) {
          /**
           * En este caso decimos que si ya se encuentra una orden realizada previamente con la comida
           * que se esta intentando añadir, lo que hacemos es agregarle +1 en la cantidad del pedido.
           */
          orderExist.amount += 1;

          // Y volvemos a cambiar el contenido del item para que guarde el nuevo valor de "amount"
          localStorage.setItem(
            "orders",
            JSON.stringify({ orders: [...getOrders.orders] })
          );
        } else {
          localStorage.setItem(
            "orders",
            JSON.stringify({ orders: [...getOrders.orders, newOrderObject] })
          );
        }
      } else {
        localStorage.setItem(
          "orders",
          JSON.stringify({ orders: [newOrderObject] })
        );
      }

      btnAddProductElement.innerHTML =
        '<iconify-icon icon="mingcute:check-fill" width="24" height="24"></iconify-icon> Pedido completado';
      if (newOrderMessageElement) {
        newOrderMessageElement.classList.remove("text-red-500");
        newOrderMessageElement.classList.add("text-green-500");
        newOrderMessageElement.textContent = `Tu nuevo pedido de "${title}" fue procesado correctamente.`;
      }

      // Pasado 5 segundos, volvemos el contenido del boton a como era anteriomente y ademas borramos el contenido del mensaje de alerta
      setTimeout(() => {
        // Aca mismo es donde restauramos el contenido del boton el cual habiamos previamente almacenado en la linea 14
        btnAddProductElement.innerHTML = beforeHTMLContent;
        if (newOrderMessageElement) {
          newOrderMessageElement.textContent = "";
        }
      }, 5000);

      changeOrderStatus();
    })
    .catch((e) => {
      console.error("Ocurrio un error: ", e);
      if (newOrderMessageElement) {
        newOrderMessageElement.classList.remove("text-green-500");
        newOrderMessageElement.classList.add("text-red-500");
        newOrderMessageElement.textContent =
          "Ocurrio un error al agregar la comida. Intente de nuevo mas tarde.";
      }
    });
}

export function loadOrders(orders) {
  const ordersListElement = document.getElementById("orders_list");

  const getStatus = (status) => {
    let actualStatus = null;
    let className = "";
    switch (status) {
      case "in_process":
        actualStatus = "En proceso";
        className = "text-[var(--text-color-secondary)]";
        break;
      case "delivered":
        actualStatus = "Entregado";
        className = "text-[var(--text-color-success)]";
        break;
      case "canceled":
        actualStatus = "Cancelado";
        className = "text-[var(--text-color-canceled)]";
        break;
    }
    return {
      actualStatus,
      className,
    };
  };
  if (orders.length != 0) {
    // Borramos el contenido anterior para que no se superponga cuando se cambie de estado el pedido
    ordersListElement.innerHTML = '';

    orders.forEach((order) => {
      const { actualStatus, className } = getStatus(order.status);
      ordersListElement.innerHTML += `
            <div class="w-full flex items-center justify-between p-3 max-mobile:flex-col">
                <div class="flex items-stretch gap-2 h-12">
                    <img class="rounded-xl" src="${order.image}" alt="${order.title
        }" />
                    <div class="flex flex-col justify-between">
                    <h3 class="text-base">${order.title} x${order.amount
        } &bull; <span class="text-xs text-[var(--text-color-secondary)]">${new Date(
          order.date
        ).toLocaleString("es-AR")}</span></h3>
                    <span class="text-sm ${className}">${actualStatus}</span>
                    </div>
                </div>
                <button
                    id="btn_canceled"
                    data-id="${order.id}"
                    class="h-12 cursor-pointer py-3 px-4 rounded-xl text-[var(--primary-color)] bg-[var(--low-tone-color)] transition-all hover:bg-[var(--primary-color)] hover:text-[var(--text-color)]"
                    >
                    Cancelar
                </button>
            </div>
            `;
    });
  } else {
    ordersListElement.innerHTML = '<p class="w-full mx-auto text-center text-xl font-medium text-[var(--text-color-secondary)]">No se ha encontrado ningun pedido.</p>';
  }

  const btnCancelElements = document.querySelectorAll("#btn_canceled");
  btnCancelElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      const currentId = e.currentTarget.getAttribute("data-id");
      const orders = getOrders();
      const orderExist = orders?.find(
        (order) => order.id.toString() === currentId.toString()
      );
      if (orderExist && orderExist.status !== "delivered" && orderExist.status !== "canceled") {
        orderExist.status = "canceled";
        localStorage.setItem("orders", JSON.stringify({ "orders": orders }));
      }
      loadOrders(getOrders());
    });
  });
  const deliverFilter = orders.filter(
    (element) => element.status === "delivered"
  );
  const canceledFilter = orders.filter(
    (element) => element.status === "canceled"
  );
  btnCancelElements.forEach((e) => {
    const buttonId = e.getAttribute("data-id");
    const isDelivered = deliverFilter.some(
      (element) => `${element.id}` === buttonId
    );
    const isCanceled = canceledFilter.some(
      (element) => `${element.id}` === buttonId
    );
    if (isDelivered || isCanceled) {
      e.disabled = true;
      e.classList.add("hover:cursor-not-allowed");
      e.classList.add("opacity-[35%]");
      e.classList.remove("hover:bg-[var(--primary-color)]");
      e.classList.remove("hover:text-[var(--text-color)]");
    } else {
      e.disabled = false;
      e.classList.remove("hover:cursor-not-allowed");
      e.classList.remove("opacity-[35%]");
      e.classList.add("hover:bg-[var(--primary-color)]");
      e.classList.add("hover:text-[var(--text-color)]");
    }
  });
}

// Esta funcion cambia el estado de un pedido en proceso a entregado
function changeOrderStatus() {
  setTimeout(() => {
    const getOrders = JSON.parse(localStorage.getItem("orders"));
    if (getOrders) {
      getOrders.orders.forEach((order) => {
        if (order.status === "in_process") {
          order.status = "delivered";
          localStorage.setItem("orders", JSON.stringify(getOrders));
          loadOrders([]);
        }
      });
    }
  }, 15000);
}

// Funcion para obtener la cantidad de pedidos realizados
export function amountOrders() {
  const getOrders = JSON.parse(localStorage.getItem("orders"));
  return getOrders?.orders.length || 0;
}

// Si la pagina se encuentra en la ruta pedidos, entionces podemos ejecutar la funcion
if (location.pathname.endsWith("pedidos.html")) {
  const filteredOrders = updateFilters(getOrders());

  loadOrders(filteredOrders);

  const filterButtonsElements = document.querySelectorAll('#btn_filter')
  filterButtonsElements.forEach((el) => {
    el.addEventListener('click', (e) => {
      const currentElement = e.currentTarget;
      const filterType = currentElement.getAttribute('data-filter-type');
      const filterValue = currentElement.getAttribute('data-filter-value');

      const filteredOrders = updateFilters(getOrders(), { type: filterType, value: filterValue })
      loadOrders(filteredOrders)
    })
  })

  changeOrderStatus();
}

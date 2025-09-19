<div style="text-align: center;">
  <img src="https://facyndev.github.io/tupya/assets/images/LogoTUP.webp" alt="LOGO" width="200" height="200">
</div>

## ¿Qué es?

**TupYa** es un proyecto práctico de universidad (UTN). 

## ¿De que trata?

**TupYa** es una tienda de comida en linea que te permite realizar multiples pedidos.
Tiene 4 paginas que consisten en: **inicio**, **lista de comidas**, **visualizacion en detalle de una comida** y **lista de pedidos**.

El proyecto obtiene información de [TheMealDB](https://www.themealdb.com) la cual es una API gratuita con gran cantidad de comidas/recetas con sus respectivos ingredientes e imagenes.

## Tecnologías utilizadas

- `HTML` - `CSS & TailwindCSS` - `JavaScript`: Uso general en el proyecto.
- [`SweetAlert`](https://sweetalert2.github.io/): Alertas tras un envio existoso del formulario de contacto que se encuentra en la pagina de **Inicio**.

## Funcionalidades implementadas

- Peticion a [API de comidas](https://www.themealdb.com) (Todas estas comidas se encuentran listadas en la pagina **comidas**)
- Peticion a [API de paises](https://restcountries.com/) (En la pagina de **inicio** se encuentra el formulario de contacto donde se muestra la carga de todos los paises en el menu de seleccion)
- Almacenado de datos en el **localStorage** (Listado de comidas, listado de pedidos y tema)
- Filtrado en tiempo real con **searchParams** (parametros de busqueda) en la URL para persistencia de filtros al recargar.
- Tema oscuro/claro con persistencia.
- Formulario de contacto con validación en tiempo real mediante el uso de expresiones regulares (para el correo electronico y codigo postal) y campos vacios.

## Capturas de Pantalla

<img src="https://i.ibb.co/N6jf2TWy/Captura-Pedidos.png" alt="Captura-Pedidos" border="0">
<img src="https://i.ibb.co/xqgP3mH6/Captura-Pedidos-Oscuro.png" alt="Captura-Pedidos-Oscuro" border="0">
<img src="https://i.ibb.co/qF4WY8Kg/Captura-Prod.png" alt="Captura-Prod" border="0">
<img src="https://i.ibb.co/svj5Ng4X/Captura-Prod-Oscuro.png" alt="Captura-Prod-Oscuro" border="0">

## Integrantes

[Facundo Grieco](https://github.com/facyndev) - [Ezequiel Hansen](https://github.com/Ezequiel-Hansen) - [Manuel Sedoff](https://github.com/M4nu3lS) - [Derian Alaba](https://github.com/deriannnnN)








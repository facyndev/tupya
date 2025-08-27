fetch("www.themealdb.com/api/json/v1/1/random.php")
    .then(async (response) => await response.json())
    .then((products) => products)
    .catch((e) => {
        console.error(e.message)
    })
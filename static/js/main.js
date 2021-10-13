import FilmAPI from '/static/js/filmAPI.js'
import Carousel from '/static/js/carousel.js'
import Modal from '/static/js/modal.js'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
async function displayBestFilm(filmAPI) {
    await filmAPI.getBestFilm();
    let bestFilmDiv = document.getElementById('bestFilm');

    let div = document.createElement('div');
    div.classList.add("film-details")

    let title = document.createElement('h3')
    title.setAttribute('class', 'filmTitle')
    title.textContent += filmAPI.bestFilm.title;
    div.appendChild(title);

    let button = document.createElement("button");
    button.addEventListener("click", function (event) {
        window.location = "";
    });

    button.textContent += "Watch now !";
    div.appendChild(button);

    let filmDetail = await filmAPI.fetchFilm(filmAPI.bestFilm.url)
    console.log(filmDetail);
    const abstract = document.createElement('p');
    abstract.setAttribute('id', 'abstractBestFilm')
    abstract.textContent += filmDetail.description;
    div.appendChild(abstract);

    bestFilmDiv.appendChild(div)

    const img = document.createElement('img');
    img.setAttribute('class', 'filmImg')
    img.setAttribute('src', filmAPI.bestFilm.image_url);
    bestFilmDiv.appendChild(img);
}

async function getAllFilms(filmAPI) {

    await displayBestFilm(filmAPI)
    await filmAPI.getGenres();
    await filmAPI.getFilms('best');
    let i;
    for (i = 0; i < 3; i++) {
        let found = false;
        while (!found) {
            let randint = getRandomInt(0, filmAPI.genres.length)
            let selectedGenre = filmAPI.genres[randint]
            await filmAPI.getFilms(selectedGenre);
            filmAPI.genres = filmAPI.genres.filter(genre => genre != selectedGenre)
            if (filmAPI.filmsByGenre[selectedGenre].length >= 7) {
                found = true
            }
            else {
                delete filmAPI.filmsByGenre[selectedGenre];
            }
        }
    }
    return filmAPI.filmsByGenre
}
let filmAPI = new FilmAPI();
let modal = new Modal();
let filmsByGenre = await getAllFilms(filmAPI)
Object.keys(filmsByGenre).forEach(genre => {
    new Carousel(filmsByGenre[genre], genre, modal, filmAPI)
});
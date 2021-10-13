
export default class Modal {
    constructor() {
        this.modal = document.getElementById("film-detail-modal");
        this.btn = document.getElementById("myBtn");
        this.span = document.getElementsByClassName("close")[0];
        this.span.onclick = () => {
            this.hide()
        }
        window.onclick = (event) => {
            if (event.target == this.modal) {
                this.hide()
            }
        }
    }

    async display(url_film_details, FilmAPI) {
        const filmDetails = await FilmAPI.fetchFilm(url_film_details);
        console.log(filmDetails)
        this.displayDetailsFilm(filmDetails)
        this.modal.style.display = "block";
    }

    hide() {
        this.modal.style.display = "none";
    }

    displayDetailsFilm(filmDetails) {
        const modal = document.getElementById('modalDetails');

        document.getElementById("title").textContent = filmDetails.title;
        modal.querySelector("#genres").textContent = "Genres: " + filmDetails.genres[0];
        modal.querySelector("#date").textContent = "Date: " + filmDetails.date_published;
        modal.querySelector("#rated").textContent = "Rating: " + filmDetails.rated;
        modal.querySelector("#score").textContent = "Score IMDB: " + filmDetails.imdb_score;
        modal.querySelector("#director").textContent = "Director: " + filmDetails.directors;
        modal.querySelector("#actors").textContent = "Actors: " + filmDetails.actors;
        modal.querySelector("#duration").textContent = "Duration: " + filmDetails.duration + " mins";
        modal.querySelector("#countries").textContent = "Countries: " + filmDetails.countries;
        modal.querySelector("#description").textContent = "Description: " + filmDetails.long_description;

        modal.querySelector("img").setAttribute('src', filmDetails.image_url);

    }

}
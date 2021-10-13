/**
 * Class of a  film : all the attribute given by the API
 */
class Film {
    constructor({ id, url, imdb_url, title, year, score, votes, image_url, directors, actors, writers, genres }) {
        this.id = id
        this.url = url
        this.imdb_url = imdb_url
        this.title = title
        this.year = year
        this.imdb_score = score
        this.votes = votes
        this.image_url = image_url
        this.directors = directors
        this.actors = actors
        this.writers = writers
        this.genres = genres
    }
}

/**
 * Contains all the function to get all the movies needed in the carousel
 */
export default class FilmAPI {

    constructor() {
        this.filmsByGenre = {};
        this.genres = [];
    }

    async getGenres() {
        await this.fetchGenres("http://localhost:8000/api/v1/genres/")
    }
    async getBestFilm() {
        let url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
        this.bestFilm = await this.fetchFilms(url, [], 1);
        this.bestFilm = this.bestFilm[0]
    }
    async getFilms(genreName) {
        if (genreName == 'best') {
            let url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
            let bestFilms = await this.fetchFilms(url, [], 8);
            this.filmsByGenre["Best"] = bestFilms.slice(1)
        }
        else {
            let url = "http://localhost:8000/api/v1/titles/?genre=" + genreName + "&sort_by=-imdb_score";
            this.filmsByGenre[genreName] = await this.fetchFilms(url, [], 7);
        }
    }

    /**
     * Fetch the films
     * @param { String } url
     * @param { Film[] } films
     * @param { Number } nbFilms
     * @returns { Film[] } films
     */
    async fetchFilms(url, films, nbFilms = -1) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            document.film = data.results[0]
            document.Film = Film
            const newFilms = data.results.map(f => new Film(f))
            films = films.concat(newFilms);
            if (data.next) {
                if (nbFilms != -1 && nbFilms > films.length) {
                    console.log(data.next);
                    films = await this.fetchFilms(data.next, films, nbFilms);
                }
                else {
                    films = films.slice(0, nbFilms);
                    return films;
                }
            }
            return films;
        } catch (error) {
            console.log(error);
            return []
        }
    }

    /**
    * Fetch all the genres 
    * @param { String } url
    */
    async fetchGenres(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            data.results.forEach(element => {
                this.genres.push(element.name);
            });
            if (data.next) {
                console.log(data.next);
                await this.fetchGenres(data.next);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Fetch the film's url to get all the details
     * @param { String } url 
     * @returns { Object } film_details
     */
    async fetchFilm(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

}


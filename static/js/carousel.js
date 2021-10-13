export default class Carousel {
    constructor(films, genre, modal, filmAPI) {
        this.films = films;
        this.genre = genre;
        this.modal = modal;
        this.filmAPI = filmAPI;

        this.carousel = null;
        this.create()
        this.carousel = document.getElementById(this.genre)
        let carouselGenre = this.carousel.getElementsByClassName('genre')
        carouselGenre[0].textContent += this.genre;
        this.carouselContent = this.carousel.querySelector(".carousel-content");
        this.carouselDisplaying;
        this.screenSize;
        this.setScreenSize();
        this.lengthOfSlide;
        window.addEventListener("resize", this.setScreenSize.bind(this));
        this.addFilms()

        this.moving = true;
        this.rightNav = this.carousel.querySelector(".nav-right");
        this.rightNav.addEventListener("click", this.moveLeft.bind(this));
        this.leftNav = this.carousel.querySelector(".nav-left");
        this.leftNav.addEventListener("click", this.moveRight.bind(this));
        this.bindedReplaceToEnd = this.replaceToEnd.bind(this);
        this.bindedActivateAgain = this.activateAgain.bind(this);
        this.moveSlidesRight();
    }

    create() {
        let container = document.getElementById('carouselContainer');
        let template = document.getElementById('carouselTemplate');
        const carousel = template.content.cloneNode(true);
        carousel.querySelector(".carousel").id = this.genre;
        container.appendChild(carousel);

    }
    /**
     * Add the films in the slides
     */
    addFilms() {
        const slides = this.carouselContent.querySelectorAll(".slide");
        let i = 0;
        slides.forEach(slide => {
            const title = document.createElement('h3')
            title.textContent += this.films[i].title;
            slide.appendChild(title);
            const img = document.createElement('img');
            img.setAttribute('src', this.films[i].image_url);
            slide.appendChild(img);
            slide.setAttribute('details', this.films[i].url)
            slide.addEventListener("click", () => {
                const url = slide.getAttribute('details')
                this.modal.display(url, this.filmAPI)
            });
            i++;
        });
    }

    /**
     * Creates a clone of the last slide - and add as first element
     */
    addClone() {
        const lastSlide = this.carouselContent.lastElementChild.cloneNode(true);
        lastSlide.style.left = -this.lengthOfSlide + "px";
        this.carouselContent.insertBefore(
            lastSlide,
            this.carouselContent.firstChild
        );
        lastSlide.addEventListener("click", () => {
            const url = lastSlide.getAttribute('details')
            this.modal.display(url, this.filmAPI)
        });
    }

    removeClone() {
        var firstSlide = this.carouselContent.firstElementChild;
        firstSlide.parentNode.removeChild(firstSlide);
    }

    setScreenSize() {
        if (window.innerWidth >= 1600) {
            this.carouselDisplaying = 5;
        } else if (window.innerWidth >= 1300) {
            this.carouselDisplaying = 4;
        } else if (window.innerWidth >= 700) {
            this.carouselDisplaying = 3;
        } else if (window.innerWidth >= 500) {
            this.carouselDisplaying = 2;
        } else {
            this.carouselDisplaying = 1;
        }
        this.getScreenSize();
    }

    getScreenSize() {
        const slides = this.carouselContent.querySelectorAll(".slide");
        var slidesArray = Array.prototype.slice.call(slides);
        this.lengthOfSlide = this.carousel.offsetWidth / this.carouselDisplaying;
        var initialWidth = -this.lengthOfSlide;
        slidesArray.forEach(function (el) {
            el.style.width = this.lengthOfSlide + "px";
            el.style.left = initialWidth + "px";
            initialWidth += this.lengthOfSlide;
        }, this);
    }

    moveSlidesRight() {
        const slides = this.carouselContent.querySelectorAll(".slide");
        var width = 0;
        for (const el of slides) {
            el.style.left = width + "px";
            width += this.lengthOfSlide;
        }
        this.addClone();
    }

    moveSlidesLeft() {
        const slides = this.carouselContent.querySelectorAll(".slide");
        var slidesArray = Array.prototype.slice.call(slides);
        slidesArray = slidesArray.reverse();
        var maxWidth = (slidesArray.length - 1) * this.lengthOfSlide;
        slidesArray.forEach(function (el, i) {
            maxWidth -= this.lengthOfSlide;
            el.style.left = maxWidth + "px";
        }, this);
    }

    moveRight() {
        if (this.moving) {
            this.moving = false;
            var lastSlide = this.carouselContent.lastElementChild;
            lastSlide.parentNode.removeChild(lastSlide);
            this.carouselContent.insertBefore(
                lastSlide,
                this.carouselContent.firstChild
            );
            this.removeClone();
            var firstSlide = this.carouselContent.firstElementChild;
            firstSlide.addEventListener("transitionend", this.bindedActivateAgain);
            this.moveSlidesRight();
        }
    }

    moveLeft() {
        if (this.moving) {
            this.moving = false;
            this.removeClone();
            var firstSlide = this.carouselContent.firstElementChild;
            firstSlide.addEventListener("transitionend", this.bindedReplaceToEnd);
            this.moveSlidesLeft();
        }
    }

    /**
     * Used in MoveRight
     */
    activateAgain() {
        var firstSlide = this.carouselContent.firstElementChild;
        this.moving = true;
        firstSlide.removeEventListener("transitionend", this.bindedActivateAgain);
    }

    /**
     * Used in MoveLeft
     */
    replaceToEnd() {
        const slides = this.carouselContent.querySelectorAll(".slide");
        var slidesArray = Array.prototype.slice.call(slides);
        const firstSlide = this.carouselContent.firstElementChild;
        firstSlide.parentNode.removeChild(firstSlide);
        this.carouselContent.appendChild(firstSlide);
        firstSlide.style.left =
            (slidesArray.length - 1) * this.lengthOfSlide + "px";
        this.addClone();
        this.moving = true;
        firstSlide.removeEventListener("transitionend", this.bindedReplaceToEnd);
    }
}














(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var mobileNav = document.querySelector(".mobile-nav");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startHero() {
            if (timer || slides.length < 2) {
                return;
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
                startHero();
            });
        });

        showSlide(0);
        startHero();

        var filterInput = document.querySelector("[data-filter-input]");
        var filterCategory = document.querySelector("[data-filter-category]");
        var filterYear = document.querySelector("[data-filter-year]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function runFilter() {
            var keyword = normalize(filterInput && filterInput.value);
            var category = normalize(filterCategory && filterCategory.value);
            var year = normalize(filterYear && filterYear.value);
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-genre") + " " + card.getAttribute("data-region"));
                var cardCategory = normalize(card.getAttribute("data-category"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var matched = true;
                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (category && cardCategory !== category) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                card.classList.toggle("hidden-by-filter", !matched);
            });
        }

        [filterInput, filterCategory, filterYear].forEach(function (control) {
            if (control) {
                control.addEventListener("input", runFilter);
                control.addEventListener("change", runFilter);
            }
        });
    });
})();

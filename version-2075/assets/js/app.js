(function () {
    const header = document.querySelector("[data-site-header]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");

    function refreshHeader() {
        if (!header) {
            return;
        }
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    refreshHeader();
    window.addEventListener("scroll", refreshHeader, { passive: true });

    if (header && toggle && panel) {
        toggle.addEventListener("click", function () {
            const open = !header.classList.contains("menu-active");
            header.classList.toggle("menu-active", open);
            document.body.classList.toggle("menu-open", open);
            toggle.setAttribute("aria-expanded", String(open));
        });

        panel.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                header.classList.remove("menu-active");
                document.body.classList.remove("menu-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
        const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        let index = 0;
        let timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("is-active", itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("is-active", itemIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener("click", function () {
                show(itemIndex);
                start();
            });
        });

        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        start();
    });

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
        const input = scope.querySelector(".js-search-input");
        const selects = Array.from(scope.querySelectorAll(".js-filter-select"));
        const buttons = Array.from(scope.querySelectorAll("[data-filter-value]"));
        const items = Array.from(scope.querySelectorAll(".js-filter-item"));
        const empty = scope.querySelector(".empty-state");
        let activeCategory = "all";

        function apply() {
            const term = normalize(input ? input.value : "");
            const selected = {};
            selects.forEach(function (select) {
                selected[select.getAttribute("data-filter-key")] = select.value;
            });
            let visible = 0;
            items.forEach(function (item) {
                const search = normalize(item.getAttribute("data-search"));
                const category = item.getAttribute("data-category") || "";
                const type = item.getAttribute("data-type") || "";
                const year = item.getAttribute("data-year") || "";
                const okTerm = !term || search.indexOf(term) !== -1;
                const okCategory = activeCategory === "all" || category === activeCategory;
                const okType = !selected.type || selected.type === "all" || type === selected.type;
                const okYear = !selected.year || selected.year === "all" || year === selected.year;
                const matched = okTerm && okCategory && okType && okYear;
                item.classList.toggle("is-hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener("input", apply);
        }
        selects.forEach(function (select) {
            select.addEventListener("change", apply);
        });
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                activeCategory = button.getAttribute("data-filter-value") || "all";
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                apply();
            });
        });
        apply();
    });
})();

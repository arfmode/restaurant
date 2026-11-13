document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    document.querySelectorAll(".nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    });

    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
    });

    const tabs = document.querySelectorAll(".menu-tab");
    const cards = document.querySelectorAll(".menu-card");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const category = tab.dataset.category;

            tabs.forEach(item => item.classList.remove("active"));
            tab.classList.add("active");

            cards.forEach(card => {
                const visible =
                    category === "all" ||
                    card.dataset.category === category;

                card.classList.toggle("hide", !visible);
            });
        });
    });

    const dateInput = document.getElementById("reservationDate");

    function getLocalDate() {
        const date = new Date();
        const local = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
        );

        return local.toISOString().split("T")[0];
    }

    dateInput.min = getLocalDate();

    const reservationForm = document.getElementById("reservationForm");
    const formMessage = document.getElementById("formMessage");

    reservationForm.addEventListener("submit", event => {
        event.preventDefault();

        const reservation = {
            name: document.getElementById("guestName").value.trim(),
            phone: document.getElementById("guestPhone").value.trim(),
            date: dateInput.value,
            time: document.getElementById("reservationTime").value,
            guests: document.getElementById("guestCount").value,
            comment: document.getElementById("guestComment").value.trim()
        };

        if (
            !reservation.name ||
            !reservation.phone ||
            !reservation.date ||
            !reservation.time
        ) {
            formMessage.textContent =
                "Будь ласка, заповніть усі обов'язкові поля.";

            formMessage.style.color = "#B33A3A";
            return;
        }

        console.log("Заявка на бронювання:", reservation);

        formMessage.textContent =
            "Дякуємо, " + reservation.name +
            "! Демонстраційну заявку заповнено.";

        formMessage.style.color = "#A98750";

        reservationForm.reset();
        dateInput.min = getLocalDate();
    });

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    const animatedElements = document.querySelectorAll(
        ".about-content, .about-image, .menu-card, .gallery-item, .reservation-form, .section-heading"
    );

    if ("IntersectionObserver" in window) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("show");

                if (entry.target.classList.contains("section-heading")) {
                    entry.target.classList.add("heading-visible");
                }

                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12
        });

        animatedElements.forEach(element => {
            element.classList.add("reveal");
            scrollObserver.observe(element);
        });

    } else {
        animatedElements.forEach(element => {
            element.classList.add("show", "heading-visible");
        });
    }

    const accountModal = document.getElementById("accountModal");
    const accountButton = document.getElementById("accountButton");
    const closeAccount = document.getElementById("closeAccount");

    const authContent = document.getElementById("authContent");
    const profileContent = document.getElementById("profileContent");

    const authTitle = document.getElementById("authTitle");
    const authMessage = document.getElementById("authMessage");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const authTabs = document.querySelectorAll(".auth-tab");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    const logoutButton = document.getElementById("logoutButton");

    const USERS_KEY = "velore_users";
    const SESSION_KEY = "velore_current_user";

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch {
            return [];
        }
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY));
        } catch {
            return null;
        }
    }

    function openModal() {
        accountModal.classList.add("open");
        document.body.classList.add("modal-open");
        updateAccountView();
    }

    function closeModal() {
        accountModal.classList.remove("open");
        document.body.classList.remove("modal-open");
        authMessage.textContent = "";
    }

    function showAuth(mode = "login") {
        authContent.classList.remove("hidden");
        profileContent.classList.add("hidden");

        authMessage.textContent = "";

        loginForm.reset();
        registerForm.reset();

        setAuthMode(mode);
    }

    function setAuthMode(mode) {
        const isRegister = mode === "register";

        loginForm.classList.toggle("hidden", isRegister);
        registerForm.classList.toggle("hidden", !isRegister);

        authTabs.forEach(tab => {
            tab.classList.toggle("active", tab.dataset.auth === mode);
        });

        authTitle.innerHTML = isRegister
            ? "Створити <i>акаунт</i>"
            : "Ваш <i>акаунт</i>";

        authMessage.textContent = "";
    }

    function updateAccountView() {
        const user = getCurrentUser();

        if (user) {
            authContent.classList.add("hidden");
            profileContent.classList.remove("hidden");

            profileName.textContent = user.name;
            profileEmail.textContent = user.email;

            accountButton.textContent = "Мій профіль";

        } else {
            showAuth("login");
            accountButton.textContent = "Мій акаунт";
        }
    }

    accountButton.addEventListener("click", openModal);
    closeAccount.addEventListener("click", closeModal);

    accountModal.addEventListener("click", event => {
        if (event.target === accountModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    authTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setAuthMode(tab.dataset.auth);
        });
    });

    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();

        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("registerPassword").value;

        if (name.length < 2) {
            authMessage.textContent =
                "Ім'я має містити щонайменше 2 символи.";

            authMessage.style.color = "#B33A3A";
            return;
        }

        if (password.length < 6) {
            authMessage.textContent =
                "Пароль має містити щонайменше 6 символів.";

            authMessage.style.color = "#B33A3A";
            return;
        }

        const users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            authMessage.textContent =
                "Користувач із такою поштою вже зареєстрований.";

            authMessage.style.color = "#B33A3A";
            return;
        }

        const newUser = {
            name,
            email,
            password
        };

        users.push(newUser);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        localStorage.setItem(SESSION_KEY, JSON.stringify({
            name: newUser.name,
            email: newUser.email
        }));

        updateAccountView();
    });

    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(item =>
            item.email === email && item.password === password
        );

        if (!user) {
            authMessage.textContent =
                "Неправильна електронна пошта або пароль.";

            authMessage.style.color = "#B33A3A";
            return;
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify({
            name: user.name,
            email: user.email
        }));

        updateAccountView();
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);

        showAuth("login");
        accountButton.textContent = "Мій акаунт";
    });

    if (getCurrentUser()) {
        accountButton.textContent = "Мій профіль";
    }

});

document.addEventListener("DOMContentLoaded", () => {

    let cart = JSON.parse(localStorage.getItem("veloreCart") || "[]");

    const headerActions = document.querySelector(".header-actions");

    let cartButton = document.querySelector("#cartButton");

    if (!cartButton && headerActions) {
        cartButton = document.createElement("button");

        cartButton.id = "cartButton";
        cartButton.className = "cart-button";

        cartButton.innerHTML = 'Кошик <span id="cartCount">0</span>';

        headerActions.prepend(cartButton);
    }

    document.querySelectorAll(".menu-card").forEach((card, index) => {

        const info = card.querySelector(".menu-card-info");

        if (!info || info.querySelector(".add-to-cart")) return;

        const title = card.querySelector("h3")?.textContent.trim();

        const priceText = info.querySelector("span")?.textContent || "0";

        const price = Number(priceText.replace(/[^\d]/g, ""));

        const button = document.createElement("button");

        button.className = "add-to-cart";
        button.type = "button";
        button.textContent = "Додати до кошика ＋";

        button.addEventListener("click", () => {

            const id = "product-" + index;

            const existing = cart.find(item => item.id === id);

            if (existing) {
                existing.quantity++;

            } else {
                cart.push({
                    id,
                    title,
                    price,
                    quantity: 1
                });
            }

            saveCart();
            renderCart();
        });

        info.appendChild(button);
    });

    const cartWindow = document.createElement("div");

    cartWindow.className = "cart-overlay";

    cartWindow.innerHTML = `
        <div class="cart-box">
            <button class="cart-close">×</button>

            <h2>Ваш кошик</h2>

            <div id="cartItems"></div>

            <div class="cart-footer">
                <h3>Разом: <span id="cartTotal">0 ₴</span></h3>

                <button class="btn btn-gold" id="clearCart">
                    Очистити кошик
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(cartWindow);

    function saveCart() {
        localStorage.setItem("veloreCart", JSON.stringify(cart));
    }


    function renderCart() {

        const itemsContainer = document.querySelector("#cartItems");

        const totalElement = document.querySelector("#cartTotal");

        const countElement = document.querySelector("#cartCount");

        let total = 0;
        let count = 0;

        itemsContainer.innerHTML = "";

        cart.forEach(item => {

            total += item.price * item.quantity;
            count += item.quantity;

            const row = document.createElement("div");
            row.className = "cart-item";

            const name = document.createElement("h3");
            name.textContent = item.title;

            const price = document.createElement("p");
            price.textContent = item.price + " ₴";

            const quantity = document.createElement("div");
            quantity.className = "cart-quantity";

            const minus = document.createElement("button");
            minus.textContent = "−";

            const number = document.createElement("span");
            number.textContent = item.quantity;

            const plus = document.createElement("button");
            plus.textContent = "+";

            const remove = document.createElement("button");
            remove.className = "cart-remove";
            remove.textContent = "Видалити";

            minus.addEventListener("click", () => {

                item.quantity--;

                if (item.quantity <= 0) {
                    cart = cart.filter(product => product.id !== item.id);
                }

                saveCart();
                renderCart();
            });

            plus.addEventListener("click", () => {

                item.quantity++;

                saveCart();
                renderCart();
            });

            remove.addEventListener("click", () => {

                cart = cart.filter(product => product.id !== item.id);

                saveCart();
                renderCart();
            });


            quantity.append(minus, number, plus);

            row.append(name, price, quantity, remove);

            itemsContainer.appendChild(row);
        });

        if (cart.length === 0) {
            itemsContainer.innerHTML =
                "<p class='empty-cart'>Ваш кошик поки порожній</p>";
        }

        totalElement.textContent = total + " ₴";

        if (countElement) {
            countElement.textContent = count;
        }
    }

    cartButton?.addEventListener("click", () => {
        cartWindow.classList.add("active");
    });

    cartWindow.querySelector(".cart-close").addEventListener("click", () => {
        cartWindow.classList.remove("active");
    });

    cartWindow.addEventListener("click", event => {
        if (event.target === cartWindow) {
            cartWindow.classList.remove("active");
        }
    });

    document.querySelector("#clearCart").addEventListener("click", () => {

        cart = [];

        saveCart();
        renderCart();
    });

    renderCart();

});
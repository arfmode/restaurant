document.addEventListener("DOMContentLoaded", () => {

    // МОБІЛЬНЕ МЕНЮ

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


    // ЕФЕКТ ШАПКИ ПРИ ПРОКРУТЦІ

    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
    });


    // ФІЛЬТРАЦІЯ МЕНЮ

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


    // ДАТА БРОНЮВАННЯ

    const dateInput = document.getElementById("reservationDate");

    function getLocalDate() {
        const date = new Date();
        const local = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
        );
        return local.toISOString().split("T")[0];
    }

    dateInput.min = getLocalDate();


    // ФОРМА БРОНЮВАННЯ

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

        if (!reservation.name || !reservation.phone || !reservation.date || !reservation.time) {
            formMessage.textContent = "Будь ласка, заповніть усі обов'язкові поля.";
            formMessage.style.color = "#B33A3A";
            return;
        }

        console.log("Заявка на бронювання:", reservation);

        formMessage.textContent =
            "Дякуємо, " + reservation.name + "! Демонстраційну заявку заповнено.";

        formMessage.style.color = "#A98750";

        reservationForm.reset();
        dateInput.min = getLocalDate();
    });


    // РІК У ФУТЕРІ

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();


    // АНІМАЦІЇ ПРИ ПРОКРУТЦІ

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(
        ".about-content, .about-image, .menu-card, .gallery-item, .reservation-form"
    ).forEach(element => {
        element.classList.add("reveal");
        observer.observe(element);
    });


    // =====================================
    // АКАУНТ: РЕЄСТРАЦІЯ ТА ВХІД
    // =====================================

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


    // ПЕРЕМИКАННЯ МІЖ ВХОДОМ І РЕЄСТРАЦІЄЮ

    authTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setAuthMode(tab.dataset.auth);
        });
    });


    // РЕЄСТРАЦІЯ

    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;

        if (name.length < 2) {
            authMessage.textContent = "Ім'я має містити щонайменше 2 символи.";
            authMessage.style.color = "#B33A3A";
            return;
        }

        if (password.length < 6) {
            authMessage.textContent = "Пароль має містити щонайменше 6 символів.";
            authMessage.style.color = "#B33A3A";
            return;
        }

        const users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            authMessage.textContent = "Користувач із такою поштою вже зареєстрований.";
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


    // ВХІД

    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(item =>
            item.email === email && item.password === password
        );

        if (!user) {
            authMessage.textContent = "Неправильна електронна пошта або пароль.";
            authMessage.style.color = "#B33A3A";
            return;
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify({
            name: user.name,
            email: user.email
        }));

        updateAccountView();

    });


    // ВИХІД

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);
        showAuth("login");
        accountButton.textContent = "Мій акаунт";
    });


    // ПЕРЕВІРКА СЕСІЇ ПІД ЧАС ЗАВАНТАЖЕННЯ

    if (getCurrentUser()) {
        accountButton.textContent = "Мій профіль";
    }

});
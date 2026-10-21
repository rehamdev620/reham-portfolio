
document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // قائمة الجوال
    // =========================
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll(".nav-link");

    function openMenu() {
        if (!menuToggle || !mainNav) return;

        mainNav.classList.remove("invisible", "opacity-0", "-translate-y-2");
        mainNav.classList.add("visible", "opacity-100", "translate-y-0");

        menuToggle.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "إغلاق القائمة");

        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        if (!menuToggle || !mainNav) return;

        mainNav.classList.add("invisible", "opacity-0", "-translate-y-2");
        mainNav.classList.remove("visible", "opacity-100", "translate-y-0");

        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "فتح القائمة");

        document.body.classList.remove("menu-open");
    }

    function isMobileMenu() {
        return window.matchMedia("(max-width: 1023px)").matches;
    }

    if (menuToggle && mainNav) {
        // تأكيد أن القائمة مغلقة عند بداية التشغيل
        closeMenu();

        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (isMobileMenu()) {
                    closeMenu();
                }
            });
        });

        // إغلاق القائمة عند الضغط خارجها
        document.addEventListener("click", (event) => {
            if (!isMobileMenu()) return;

            const clickedInsideMenu = mainNav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen && !clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        // إغلاق القائمة بزر Escape
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // إعادة ضبط القائمة عند الانتقال إلى شاشة الكمبيوتر
        window.addEventListener("resize", () => {
            if (!isMobileMenu()) {
                closeMenu();
            }
        });
    }

    // =========================
    // تصفية المشاريع
    // =========================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((item) => {
                const selected = item === button;

                item.setAttribute("aria-pressed", String(selected));

                item.classList.toggle("bg-burgundy", selected);
                item.classList.toggle("text-white", selected);
                item.classList.toggle("border", !selected);
                item.classList.toggle("border-beige", !selected);
            });

            projectCards.forEach((card) => {
                const categories = (card.dataset.category || "").split(/\s+/);
                const shouldShow =
                    selectedFilter === "all" ||
                    categories.includes(selectedFilter);

                card.classList.toggle("hidden", !shouldShow);
            });
        });
    });

    // =========================
    // السنة الحالية في الفوتر
    // =========================
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // =========================
    // ظهور العناصر عند التمرير
    // =========================
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    // =========================
    // نموذج التواصل عبر واتساب
    // =========================
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    // استبدلي الرقم برقم واتسابك مع مفتاح الدولة،
    // دون علامة + أو مسافات.
    const whatsappNumber = "966559796251";

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const service = document.getElementById("service").value;
            const message = document.getElementById("message").value.trim();

            if (!name || !service || !message) {
                showFormMessage("فضلاً، عبّي الحقول المطلوبة.", false);
                return;
            }

            if (
                whatsappNumber.includes("X") ||
                !/^\d{8,15}$/.test(whatsappNumber)
            ) {
                showFormMessage(
                    "النموذج جاهز، لكن يلزم إضافة رقم واتساب الصحيح داخل ملف script.js أولاً.",
                    false
                );
                return;
            }

            const text = [
                "مرحبًا ريهام، أرغب بالاستفسار عن مشروع.",
                "",
                `الاسم: ${name}`,
                `البريد الإلكتروني: ${email || "لم يُذكر"}`,
                `الخدمة المطلوبة: ${service}`,
                "",
                "تفاصيل المشروع:",
                message
            ].join("\n");

            const whatsappUrl =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

            const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

            if (!newWindow) {
                window.location.href = whatsappUrl;
            }

            showFormMessage(
                "تم تجهيز رسالتك. أكمل الإرسال من واتساب بعد فتحه.",
                true
            );
        });
    }

    function showFormMessage(message, success) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.classList.remove("hidden");
        formMessage.classList.toggle("text-brown", success);
        formMessage.classList.toggle("text-red-700", !success);
    }
});

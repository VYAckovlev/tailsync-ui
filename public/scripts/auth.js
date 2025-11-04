"use strict";

(() => {
    const config = window.TAILSYNC_CONFIG || {};
    const API_BASE_URL = config.apiBaseUrl || "http://localhost:8080";

    const forms = {
        login: document.getElementById("loginForm"),
        register: document.getElementById("registerForm")
    };

    const authCard = document.querySelector(".auth-card");
    const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
    let cardBaselineHeight = null;
    let resizeTimerId = null;

    function measureRegisterBaselineHeight() {
        if (!authCard || !forms.register) return;

        const clone = forms.register.cloneNode(true);
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        clone.classList.add("is-active");
        clone.hidden = false;
        clone.style.position = "absolute";
        clone.style.inset = "0";
        clone.style.visibility = "hidden";
        clone.style.pointerEvents = "none";
        clone.style.display = "flex";
        clone.style.maxHeight = "none";

        authCard.appendChild(clone);
        const measuredHeight = clone.scrollHeight;
        authCard.removeChild(clone);

        if (measuredHeight) {
            cardBaselineHeight = measuredHeight;
            authCard.style.minHeight = `${measuredHeight}px`;
        }
    }

    function ensureCardHeight() {
        if (!authCard) return;
        if (cardBaselineHeight === null) {
            measureRegisterBaselineHeight();
        } else {
            authCard.style.minHeight = `${cardBaselineHeight}px`;
        }
    }

    const validationRules = {
        name(value) {
            if (!value.trim()) return "Name is required.";
            if (value.trim().length < 2) return "Please provide your full name.";
            return "";
        },
        email(value) {
            if (!value.trim()) return "Email is required.";
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value);
            return isEmail ? "" : "Enter a valid email address.";
        },
        password(value) {
            if (!value) return "Password is required.";
            return value.length >= 8 ? "" : "Password must be at least 8 characters.";
        },
        confirmPassword(value, form) {
            if (!value) return "Please confirm your password.";
            return value === form.querySelector("#registerPassword").value
                ? ""
                : "Passwords do not match.";
        }
    };

    const ROUTES = {
        login: "/auth/login",
        register: "/auth/register"
    };

    function setActiveForm(targetKey) {
        const targetForm = forms[targetKey];
        if (!targetForm) return;

        Object.entries(forms).forEach(([key, form]) => {
            const isActive = key === targetKey;
            form.classList.toggle("is-active", isActive);
            form.toggleAttribute("hidden", !isActive);
        });

        tabButtons.forEach((button) => {
            const isActive = button.dataset.target === targetKey;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", String(isActive));
        });

        document.title = targetKey === "register" ? "TailSync | Create Account" : "TailSync | Sign In";
        ensureCardHeight();
    }

    function setFieldError(input, message) {
        const errorOutput = document.querySelector(`.field-error[data-for="${input.id}"]`);
        if (!errorOutput) return;
        errorOutput.textContent = message;
        input.toggleAttribute("aria-invalid", Boolean(message));
    }

    function validateForm(formKey) {
        const form = forms[formKey];
        if (!form) return false;

        let isValid = true;
        const inputs = Array.from(form.querySelectorAll("input"));

        inputs.forEach((input) => {
            const rule = validationRules[input.name];
            const value = input.value || "";
            const message = rule ? rule(value, form) : input.validationMessage;
            setFieldError(input, message);
            if (message) isValid = false;
        });

        return isValid;
    }

    function resetFormErrors(formKey) {
        const form = forms[formKey];
        if (!form) return;

        form.querySelectorAll(".field-error").forEach((node) => {
            node.textContent = "";
        });
        form.querySelectorAll("input").forEach((input) => input.removeAttribute("aria-invalid"));
    }

    function updateFormStatus(formKey, message, variant = "info") {
        const form = forms[formKey];
        if (!form) return;
        const statusNode = form.querySelector(".form-status");
        if (!statusNode) return;
        statusNode.textContent = message;
        statusNode.classList.remove("form-status--error", "form-status--success", "form-status--info");
        statusNode.classList.add(`form-status--${variant}`);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formKey = form.id === "loginForm" ? "login" : "register";

        resetFormErrors(formKey);
        updateFormStatus(formKey, "");

        if (!validateForm(formKey)) {
            updateFormStatus(formKey, "Please fix the highlighted fields.", "error");
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        updateFormStatus(formKey, "Sending request…", "info");

        const payload =
            formKey === "login"
                ? {
                      email: form.email.value.trim(),
                      password: form.password.value
                  }
                : {
                      name: form.name.value.trim(),
                      email: form.email.value.trim(),
                      password: form.password.value,
                      confirmPassword: form.confirmPassword.value
                  };

        try {
            const response = await fetch(`${API_BASE_URL}${ROUTES[formKey]}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const data = await parseJsonSafely(response);

            if (!response.ok) {
                const errorMessage = data?.message || "Unable to complete the request. Try again later.";
                throw new Error(errorMessage);
            }

            updateFormStatus(
                formKey,
                formKey === "login" ? "Welcome back! Redirecting…" : "Account created! You can now sign in.",
                "success"
            );
            form.reset();
        } catch (error) {
            updateFormStatus(formKey, error.message, "error");
        } finally {
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
        }
    }

    async function parseJsonSafely(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    function attachFieldListeners(formKey) {
        const form = forms[formKey];
        if (!form) return;

        form.querySelectorAll("input").forEach((input) => {
            input.addEventListener("blur", () => {
                const rule = validationRules[input.name];
                if (!rule) return;
                const message = rule(input.value || "", form);
                setFieldError(input, message);
            });
        });
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => setActiveForm(button.dataset.target));
    });

    Object.values(forms).forEach((formElement) => formElement?.addEventListener("submit", handleFormSubmit));
    attachFieldListeners("login");
    attachFieldListeners("register");
    setActiveForm("login");

    ensureCardHeight();

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimerId);
        resizeTimerId = setTimeout(() => {
            cardBaselineHeight = null;
            ensureCardHeight();
        }, 150);
    });

    window.addEventListener("load", () => {
        cardBaselineHeight = null;
        ensureCardHeight();
    });
})();

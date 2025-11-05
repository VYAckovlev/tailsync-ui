import React, { useState, useEffect, useCallback, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const initialLoginValues = {
    email: "",
    password: ""
};

const initialRegisterValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
};

const defaultStatus = {
    message: "",
    variant: "info"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const App = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [formValues, setFormValues] = useState({
        login: initialLoginValues,
        register: initialRegisterValues
    });
    const [formErrors, setFormErrors] = useState({
        login: {},
        register: {}
    });
    const [formStatus, setFormStatus] = useState({
        login: { ...defaultStatus },
        register: { ...defaultStatus }
    });
    const [formBusy, setFormBusy] = useState({
        login: false,
        register: false
    });

    const authCardRef = useRef(null);
    const registerFormRef = useRef(null);
    const baselineHeightRef = useRef(null);

    useEffect(() => {
        document.title = activeTab === "register" ? "TailSync | Create Account" : "TailSync | Sign In";
    }, [activeTab]);

    const validateField = useCallback((formKey, fieldName, value, values) => {
        switch (fieldName) {
            case "name": {
                const trimmed = value.trim();
                if (!trimmed) return "Name is required.";
                if (trimmed.length < 2) return "Please provide your full name.";
                return "";
            }
            case "email": {
                const trimmed = value.trim();
                if (!trimmed) return "Email is required.";
                return emailPattern.test(trimmed) ? "" : "Enter a valid email address.";
            }
            case "password": {
                if (!value) return "Password is required.";
                return value.length >= 8 ? "" : "Password must be at least 8 characters.";
            }
            case "confirmPassword": {
                if (!value) return "Please confirm your password.";
                return value === values.password ? "" : "Passwords do not match.";
            }
            default:
                return "";
        }
    }, []);

    const validateForm = useCallback(
        (formKey) => {
            const values = formValues[formKey];
            const nextErrors = {};

            Object.entries(values).forEach(([fieldName, fieldValue]) => {
                nextErrors[fieldName] = validateField(formKey, fieldName, fieldValue, values);
            });

            setFormErrors((prev) => ({
                ...prev,
                [formKey]: nextErrors
            }));

            return Object.values(nextErrors).every((message) => !message);
        },
        [formValues, validateField]
    );

    const handleInputChange = (formKey, fieldName) => (event) => {
        const { value } = event.target;
        setFormValues((prev) => ({
            ...prev,
            [formKey]: {
                ...prev[formKey],
                [fieldName]: value
            }
        }));
        setFormErrors((prev) => ({
            ...prev,
            [formKey]: {
                ...prev[formKey],
                [fieldName]: ""
            }
        }));
    };

    const handleInputBlur = (formKey, fieldName) => {
        const values = formValues[formKey];
        const message = validateField(formKey, fieldName, values[fieldName], values);
        setFormErrors((prev) => ({
            ...prev,
            [formKey]: {
                ...prev[formKey],
                [fieldName]: message
            }
        }));
    };

    const ensureCardHeight = useCallback(() => {
        const cardNode = authCardRef.current;
        const registerFormNode = registerFormRef.current;

        if (!cardNode || !registerFormNode) return;

        const clonedForm = registerFormNode.cloneNode(true);
        clonedForm.removeAttribute("id");
        clonedForm.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        clonedForm.hidden = false;
        clonedForm.classList.add("is-active");
        clonedForm.style.position = "absolute";
        clonedForm.style.inset = "0";
        clonedForm.style.visibility = "hidden";
        clonedForm.style.pointerEvents = "none";
        clonedForm.style.display = "flex";
        clonedForm.style.maxHeight = "none";

        cardNode.appendChild(clonedForm);
        const measuredHeight = clonedForm.scrollHeight;
        cardNode.removeChild(clonedForm);

        if (measuredHeight && Math.abs((baselineHeightRef.current ?? 0) - measuredHeight) > 1) {
            baselineHeightRef.current = measuredHeight;
            cardNode.style.minHeight = `${measuredHeight}px`;
        }
    }, []);

    useEffect(() => {
        ensureCardHeight();
    }, [ensureCardHeight, formValues.register, formStatus.register, activeTab]);

    useEffect(() => {
        const handleResize = () => {
            baselineHeightRef.current = null;
            ensureCardHeight();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [ensureCardHeight]);

    useEffect(() => {
        ensureCardHeight();
    }, [ensureCardHeight]);

    const updateStatus = useCallback((formKey, status) => {
        setFormStatus((prev) => ({
            ...prev,
            [formKey]: {
                message: status.message,
                variant: status.variant ?? "info"
            }
        }));
    }, []);

    const handleSubmit = async (event, formKey) => {
        event.preventDefault();

        const isValid = validateForm(formKey);
        if (!isValid) {
            updateStatus(formKey, {
                message: "Please fix the highlighted fields.",
                variant: "error"
            });
            return;
        }

        setFormBusy((prev) => ({ ...prev, [formKey]: true }));
        updateStatus(formKey, { message: "Sending request…", variant: "info" });

        const values = formValues[formKey];
        const endpoint = formKey === "login" ? "/auth/login" : "/auth/register";
        const payload =
            formKey === "login"
                ? {
                      email: values.email.trim(),
                      password: values.password
                  }
                : {
                      name: values.name.trim(),
                      email: values.email.trim(),
                      password: values.password,
                      confirmPassword: values.confirmPassword
                  };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            let responseJson = null;
            try {
                responseJson = await response.json();
            } catch (error) {
                responseJson = null;
            }

            if (!response.ok) {
                const errorMessage = responseJson?.message || "Unable to complete the request. Try again later.";
                throw new Error(errorMessage);
            }

            if (formKey === "login") {
                updateStatus(formKey, { message: "Welcome back! Redirecting…", variant: "success" });
            } else {
                updateStatus(formKey, {
                    message: "Account created! You can now sign in.",
                    variant: "success"
                });
            }

            setFormValues((prev) => ({
                ...prev,
                [formKey]: formKey === "login" ? initialLoginValues : initialRegisterValues
            }));
            setFormErrors((prev) => ({
                ...prev,
                [formKey]: {}
            }));
        } catch (error) {
            updateStatus(formKey, { message: error.message, variant: "error" });
        } finally {
            setFormBusy((prev) => ({ ...prev, [formKey]: false }));
        }
    };

    return (
        <main className="auth-layout">
            <section className="auth-panel">
                <header className="brand-block">
                    <div className="logo-circle">
                        <img src="/assets/tailsync-logo.jpg" alt="TailSync logo" className="logo-image" />
                    </div>
                    <div className="brand-copy">
                        <h1 className="brand-title">TailSync</h1>
                        <p className="brand-tagline">Sync your time, empower your team.</p>
                    </div>
                </header>

                <div className="auth-card" ref={authCardRef}>
                    <div className="tab-bar" role="tablist" aria-label="Authentication tabs">
                        <button
                            type="button"
                            className={`tab-button ${activeTab === "login" ? "is-active" : ""}`}
                            data-target="login"
                            onClick={() => setActiveTab("login")}
                            role="tab"
                            aria-selected={activeTab === "login"}
                            aria-controls="loginForm"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`tab-button ${activeTab === "register" ? "is-active" : ""}`}
                            data-target="register"
                            onClick={() => setActiveTab("register")}
                            role="tab"
                            aria-selected={activeTab === "register"}
                            aria-controls="registerForm"
                        >
                            Create Account
                        </button>
                    </div>

                    <form
                        id="loginForm"
                        className={`auth-form ${activeTab === "login" ? "is-active" : ""}`}
                        hidden={activeTab !== "login"}
                        noValidate
                        onSubmit={(event) => handleSubmit(event, "login")}
                    >
                        <div className="form-field">
                            <label htmlFor="loginEmail">Email</label>
                            <input
                                id="loginEmail"
                                name="email"
                                type="email"
                                placeholder="you@tailsync.com"
                                autoComplete="email"
                                required
                                value={formValues.login.email}
                                onChange={handleInputChange("login", "email")}
                                onBlur={() => handleInputBlur("login", "email")}
                                aria-invalid={Boolean(formErrors.login.email)}
                            />
                            <p className="field-error" data-for="loginEmail">
                                {formErrors.login.email}
                            </p>
                        </div>

                        <div className="form-field">
                            <label htmlFor="loginPassword">Password</label>
                            <input
                                id="loginPassword"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                minLength={8}
                                required
                                value={formValues.login.password}
                                onChange={handleInputChange("login", "password")}
                                onBlur={() => handleInputBlur("login", "password")}
                                aria-invalid={Boolean(formErrors.login.password)}
                            />
                            <p className="field-error" data-for="loginPassword">
                                {formErrors.login.password}
                            </p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={formBusy.login}
                                aria-busy={formBusy.login}
                            >
                                Sign In
                            </button>
                        </div>
                        <p className="form-hint">
                            By signing in you acknowledge TailSync is currently in beta—you're steering your own ship.
                        </p>
                        <div
                            className={`form-status form-status--${formStatus.login.variant}`}
                            role="status"
                            aria-live="polite"
                        >
                            {formStatus.login.message}
                        </div>
                    </form>

                    <form
                        id="registerForm"
                        ref={registerFormRef}
                        className={`auth-form ${activeTab === "register" ? "is-active" : ""}`}
                        hidden={activeTab !== "register"}
                        noValidate
                        onSubmit={(event) => handleSubmit(event, "register")}
                    >
                        <div className="form-field">
                            <label htmlFor="registerName">Full name</label>
                            <input
                                id="registerName"
                                name="name"
                                type="text"
                                placeholder="Jane Doe"
                                autoComplete="name"
                                minLength={2}
                                required
                                value={formValues.register.name}
                                onChange={handleInputChange("register", "name")}
                                onBlur={() => handleInputBlur("register", "name")}
                                aria-invalid={Boolean(formErrors.register.name)}
                            />
                            <p className="field-error" data-for="registerName">
                                {formErrors.register.name}
                            </p>
                        </div>

                        <div className="form-field">
                            <label htmlFor="registerEmail">Email</label>
                            <input
                                id="registerEmail"
                                name="email"
                                type="email"
                                placeholder="you@tailsync.com"
                                autoComplete="email"
                                required
                                value={formValues.register.email}
                                onChange={handleInputChange("register", "email")}
                                onBlur={() => handleInputBlur("register", "email")}
                                aria-invalid={Boolean(formErrors.register.email)}
                            />
                            <p className="field-error" data-for="registerEmail">
                                {formErrors.register.email}
                            </p>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="registerPassword">Password</label>
                                <input
                                    id="registerPassword"
                                    name="password"
                                    type="password"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    value={formValues.register.password}
                                    onChange={handleInputChange("register", "password")}
                                    onBlur={() => handleInputBlur("register", "password")}
                                    aria-invalid={Boolean(formErrors.register.password)}
                                />
                                <p className="field-error" data-for="registerPassword">
                                    {formErrors.register.password}
                                </p>
                            </div>
                            <div className="form-field">
                                <label htmlFor="registerConfirmPassword">Confirm password</label>
                                <input
                                    id="registerConfirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    value={formValues.register.confirmPassword}
                                    onChange={handleInputChange("register", "confirmPassword")}
                                    onBlur={() =>
                                        handleInputBlur("register", "confirmPassword")
                                    }
                                    aria-invalid={Boolean(formErrors.register.confirmPassword)}
                                />
                                <p className="field-error" data-for="registerConfirmPassword">
                                    {formErrors.register.confirmPassword}
                                </p>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={formBusy.register}
                                aria-busy={formBusy.register}
                            >
                                Create Account
                            </button>
                        </div>
                        <p className="form-hint">
                            By creating an account you acknowledge TailSync is currently in beta—you're steering your own
                            ship.
                        </p>
                        <div
                            className={`form-status form-status--${formStatus.register.variant}`}
                            role="status"
                            aria-live="polite"
                        >
                            {formStatus.register.message}
                        </div>
                    </form>
                </div>
            </section>

            <aside className="pitch-panel">
                <div className="pitch-frame">
                    <h2>Diddybluds unite</h2>
                    <p>
                        TailSync keeps your calendars aligned, your tasks accountable, and your teams in sync. Centralize
                        schedules, coordinate events, and never miss the moments that matter.
                    </p>
                </div>
            </aside>
        </main>
    );
};

export default App;

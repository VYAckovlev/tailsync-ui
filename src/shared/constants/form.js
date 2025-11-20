// Authentication form configurations
export const loginConfig = {
    submitButtonText: "Login",
    loadingText: "Logging in...",
    fields: [
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email"
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password"
        }
    ]
};

export const registerConfig = {
    submitButtonText: "Register",
    loadingText: "Creating account...",
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter your full name"
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email"
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password"
        },
        {
            name: "confirm_password",
            label: "Confirm Password",
            type: "password",
            placeholder: "Confirm your password"
        }
    ]
};

export const passwordResetConfig = {
    submitButtonText: "Reset Password",
    loadingText: "Sending...",
    fields: [
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email address"
        }
    ]
};

export const passwordResetConfirmConfig = {
    submitButtonText: "Change Password",
    loadingText: "Sending...",
    fields: [
        {
            name: "password",
            label: "New Password",
            type: "password",
            placeholder: "Enter your new password"
        },
        {
            name: "confirm_password",
            label: "Confirm Password",
            type: "password",
            placeholder: "Confirm your new password"
        }
    ]
};

// User profile update configurations
export const changeNameConfig = {
    submitButtonText: "Save new name",
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter your full name",
            required: true
        }
    ]
};

export const changePasswordConfig = {
    submitButtonText: "Update password",
    fields: [
        {
            name: "old_password",
            label: "Old password",
            type: "password",
            placeholder: "Enter your old password",
            required: true
        },
        {
            name: "new_password",
            label: "New password",
            type: "password",
            placeholder: "Enter your new password",
            required: true
        },
        {
            name: "confirm_password",
            label: "Confirm new password",
            type: "password",
            placeholder: "Confirm your new password",
        }
    ]
};

// Form validation helpers
export const formValidators = {
    validatePasswordMatch: (password, confirm_password) => {
        if (password !== confirm_password) {
            return {
                isValid: false,
                error: "Passwords do not match"
            };
        }
        return {
            isValid: true,
            error: null
        };
    }
};
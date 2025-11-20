import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import './AuthForm.css';

const AuthForm = ({
                      fields,
                      onSubmit,
                      submitButtonText,
                      showForgotPassword = false,
                      switchLink = null
                  }) => {

    const { formData, handleChange, handleSubmit } = useForm(fields, onSubmit);

    return (
        <div className="auth-card">
            <form className="auth-form is-active" onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <div className="form-field" key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            required={field.required !== false}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                        <span className="field-error"></span>
                    </div>
                ))}

                <div className="form-actions">
                    <button type="submit" className="primary-button">
                        {submitButtonText}
                    </button>
                </div>

                {showForgotPassword && (
                    <p className="form-hint">
                        <Link to="/auth/password-reset">Forgot password?</Link>
                    </p>
                )}

                {switchLink && (
                    <p className="auth-switch-link">
                        {switchLink.text} <Link to={switchLink.to}>{switchLink.linkText}</Link>
                    </p>
                )}
            </form>
        </div>
    );
};

export default AuthForm;
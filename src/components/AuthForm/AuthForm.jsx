import {useState} from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../shared/logo/logo';
import './AuthForm.css';

const AuthForm = ({
  fields,
  onSubmit,
  submitButtonText,
  showForgotPassword = false,
  switchLink = null
}) => {

    const initFormState = fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const [formData, setFormData] = useState(initFormState);

    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        Promise.resolve(onSubmit(formData)).catch(err => {
            console.error('Form submission error:', err);
        });
        return false
    }
    return (
        <div className="auth-panel">
            <div className="brand-block">
                <Logo size="medium" />
                <div>
                    <h1 className="brand-title">TailSync</h1>
                </div>
            </div>

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
                            <Link to="/password-reset">Forgot password?</Link>
                        </p>
                    )}

                    {switchLink && (
                        <p className="auth-switch-link">
                            {switchLink.text} <Link to={switchLink.to}>{switchLink.linkText}</Link>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
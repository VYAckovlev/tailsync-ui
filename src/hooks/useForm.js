import { useState } from 'react';

const useForm = (fields, onSubmit) => {
    const initFormState = fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : "";
        return acc;
    }, {});

    const [formData, setFormData] = useState(initFormState);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        Promise.resolve(onSubmit(formData)).catch(err => {
            console.error('Form submission error:', err);
        });

        return false;
    };

    const resetForm = () => {
        setFormData(initFormState);
    };

    return {
        formData,
        setFormData,
        handleChange,
        handleSubmit,
        resetForm
    };
};

export default useForm;
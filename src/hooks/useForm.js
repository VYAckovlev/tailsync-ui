import { useState } from 'react';

const useForm = (fields, onSubmit) => {
    const initFormState = fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const [formData, setFormData] = useState(initFormState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
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

    return {
        formData,
        handleChange,
        handleSubmit
    };
};

export default useForm;
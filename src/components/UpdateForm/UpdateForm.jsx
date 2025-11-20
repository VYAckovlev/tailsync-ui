import useForm from "../../hooks/useForm";

const UpdateForm = ({
    fields,
    onSubmit,
    submitButtonText = "Update"
}) => {

    const { formData, handleChange, handleSubmit } = useForm(fields, onSubmit);

    return (
        <div className="update-form">
            <form onSubmit={handleSubmit}>
                {fields.map(field => (
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
                    </div>
                ))}
                <div className="form-actions">
                    <button type="submit" className="primary-button">
                        {submitButtonText}
                    </button>
                </div>
            </form>
        </div>

    )
}
export default UpdateForm
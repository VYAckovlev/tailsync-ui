import { useEffect } from 'react';
import FormPopover from '../FormPopover/FormPopover.jsx';
import useForm from '../../hooks/useForm.js';
import './ChangeColorPopover.css';

const ChangeColorPopover = ({ isOpen, onClose, onSubmit, anchorPosition, currentColor, calendarName }) => {
    const fields = [{ name: 'color', type: 'color', value: currentColor || '#ff7a18' }];

    const { formData, setFormData, handleChange, handleSubmit } = useForm(fields, (data) => {
        onSubmit(data.color);
    });

    useEffect(() => {
        if (isOpen && currentColor) {
            setFormData({ color: currentColor });
        }
    }, [isOpen, currentColor, setFormData]);

    return (
        <FormPopover
            isOpen={isOpen}
            onClose={onClose}
            anchorPosition={anchorPosition}
            title="Change Color"
            className="color-popover-wrapper"
        >
            <form onSubmit={handleSubmit} className="color-form">

                <div className="color-picker-centered">
                    <label className="color-circle-wrapper">
                        <input
                            type="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                        />
                        <div
                            className="color-circle-display"
                            style={{
                                backgroundColor: formData.color,
                                boxShadow: `0 0 20px ${formData.color}66`
                            }}
                        />
                    </label>

                    {/* Текст коду кольору */}
                    <span className="color-hex-value">{formData.color}</span>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" className="primary-button">
                        Save Color
                    </button>
                </div>
            </form>
        </FormPopover>
    );
};

export default ChangeColorPopover;
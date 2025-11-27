import { useEffect, useRef } from 'react';
import useForm from '../../hooks/useForm.js';
import FormPopover from '../FormPopover/FormPopover.jsx';
import './CalendarPopover.css';

const CalendarPopover = ({ isOpen, onClose, onSubmit, anchorPosition }) => {
    const formRef = useRef(null);

    const fields = [
        { name: 'name', type: 'text' },
        { name: 'color', type: 'color' }
    ];

    const { formData, handleChange, handleSubmit } = useForm(fields, (data) => {
        onSubmit(data);
    });

    useEffect(() => {
        if (isOpen && formRef.current) {
            const inputs = formRef.current.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.name === 'name') input.value = '';
                if (input.name === 'color') input.value = '#ff7a18';
            });
        }
    }, [isOpen]);

    return (
        <FormPopover
            isOpen={isOpen}
            onClose={onClose}
            anchorPosition={anchorPosition}
            title="Create Calendar"
            className="calendar-create-popover"
        >
            <form ref={formRef} onSubmit={handleSubmit} className="calendar-form">
                <div className="form-field">
                    <label htmlFor="calendar-name">Calendar Name</label>
                    <input
                        type="text"
                        id="calendar-name"
                        name="name"
                        defaultValue=""
                        onChange={handleChange}
                        placeholder="My Calendar"
                        required
                        maxLength={50}
                    />
                </div>

                <div className="form-field color-field-row">
                    <label htmlFor="calendar-color" className="color-label">
                        Set calendar color:
                    </label>
                    <input
                        type="color"
                        id="calendar-color"
                        name="color"
                        defaultValue="#ff7a18"
                        onChange={handleChange}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Create
                    </button>
                </div>
            </form>
        </FormPopover>
    );
};

export default CalendarPopover;
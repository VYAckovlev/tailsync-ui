import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import useForm from '../../hooks/useForm.js';
import './CalendarPopover.css';
import {useDraggable} from "../../hooks/useDraggable.js";
import CloseIcon from "../../shared/icons/Close.icon.jsx";

const CalendarPopover = ({ isOpen, onClose, onSubmit, anchorPosition }) => {
    const popoverRef = useRef(null)

    const { position, isDragging, handleMouseDown } = useDraggable(
        popoverRef,
        anchorPosition,
        isOpen
    );
;

    const fields = [
        { name: 'name', type: 'text' },
        { name: 'color', type: 'color' }
    ];

    const { formData, handleChange, handleSubmit } = useForm(fields, (data) => {
        onSubmit(data);
    });

    useEffect(() => {
        if (isOpen && popoverRef.current) {
            const inputs = popoverRef.current.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.name === 'name') input.value = '';
                if (input.name === 'color') input.value = '#ff7a18';
            });
        }
    }, [isOpen]);

    useClickOutside(popoverRef, () => {
        if (isOpen && !isDragging) {
            onClose();
        }
    });

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={popoverRef}
            className={`calendar-popover ${isDragging ? 'dragging' : ''}`}
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 9999
            }}
        >
            <div
                className="popover-header"
                onMouseDown={handleMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <h3>Create Calendar</h3>
                <button
                    className="popover-close"
                    onClick={onClose}
                    type="button"
                >
                    <CloseIcon />
                </button>
            </div>

            <form className="popover-body" onSubmit={handleSubmit}>
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

                <div className="form-field">
                    <label htmlFor="calendar-color">Calendar Color</label>
                    <div className="color-picker-wrapper">
                        <input
                            type="color"
                            id="calendar-color"
                            name="color"
                            defaultValue="#ff7a18"
                            onChange={handleChange}
                        />
                    </div>
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
        </div>,
        document.body
    );
};

export default CalendarPopover;
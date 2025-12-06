import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import { useDraggable } from '../../hooks/useDraggable.js';
import CloseIcon from '../../shared/icons/Close.icon.jsx';
import './FormPopover.css';

const FormPopover = ({
    isOpen,
    onClose,
    anchorPosition,
    title,
    children,
    className = ''
}) => {
    const popoverRef = useRef(null);

    const { position, isDragging, handleMouseDown } = useDraggable(
        popoverRef,
        anchorPosition,
        isOpen
    );

    useClickOutside(popoverRef, () => {
        if (isOpen && !isDragging) {
            onClose();
        }
    });

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={popoverRef}
            className={`form-popover ${isDragging ? 'dragging' : ''} ${className}`}
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
                <h3>{title}</h3>
                <button className="popover-close" onClick={onClose} type="button">
                    <CloseIcon />
                </button>
            </div>

            <div className="popover-body">
                {children}
            </div>
        </div>,
        document.body
    );
};

export default FormPopover;
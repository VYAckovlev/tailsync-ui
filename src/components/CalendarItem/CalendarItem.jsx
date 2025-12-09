import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import "./CalendarItem.css";
import CheckIcon from "../../shared/icons/Check.icon.jsx";
import ThreeDotsIcon from "../../shared/icons/ThreeDots.icon.jsx";
import AddUserPopover from '../AddUserPopover/AddUserPopover.jsx';
import ChangeColorPopover from '../ChangeColorPopover/ChangeColorPopover.jsx';
import { useClickOutside } from "../../hooks/useClickOutside.js";
import { useCalendar } from "../../context/CalendarContext.jsx";
import { calendarApi } from '../../services/calendarApi.js';

const CalendarItem = ({ calendar, isOwner }) => {
    const { refreshCalendars, toggleCalendarVisibility } = useCalendar();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isAddUserPopoverOpen, setIsAddUserPopoverOpen] = useState(false);
    const [isChangeColorPopoverOpen, setIsChangeColorPopoverOpen] = useState(false);
    const [popoverAnchorPosition, setPopoverAnchorPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    useClickOutside(menuRef, () => setIsMenuOpen(false));

    const handleMenuClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isMenuOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 5,
                left: rect.right - 160
            });
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const handleAddUserClick = (e) => {
        e.stopPropagation();
        const rect = buttonRef.current.getBoundingClientRect();
        setPopoverAnchorPosition({
            x: rect.right + 10,
            y: rect.top
        });
        setIsAddUserPopoverOpen(true);
        setIsMenuOpen(false);
    };

    const handleChangeColorClick = (e) => {
        e.stopPropagation();
        const rect = buttonRef.current.getBoundingClientRect();
        setPopoverAnchorPosition({
            x: rect.right + 10,
            y: rect.top
        });
        setIsChangeColorPopoverOpen(true);
        setIsMenuOpen(false);
    };

    const handleDeleteClick = async (e) => {
        e.stopPropagation();
        setIsMenuOpen(false);

        if (!confirm(`Are you sure you want to delete "${calendar.name}"?`)) {
            return;
        }

        try {
            await calendarApi.deleteCalendar(calendar.id);
            toast.success('Calendar deleted successfully');
            await refreshCalendars();
        } catch (error) {
            console.error('Failed to delete calendar:', error);
            toast.error(`Failed to delete calendar: ${error.response.data.message}`);
        }
    };

    const handleLeaveClick = async (e) => {
        e.stopPropagation();
        setIsMenuOpen(false);

        if (!confirm(`Are you sure you want to leave "${calendar.name}"?`)) {
            return;
        }

        try {
            await calendarApi.leaveCalendar(calendar.id);
            toast.success('You have left the calendar');
            await refreshCalendars();
        } catch (error) {
            console.error('Failed to leave calendar:', error);
            toast.error('Failed to leave calendar');
        }
    };

    const handleAddUserSubmit = async (userData) => {
        try {
            await calendarApi.shareCalendar(calendar.id, userData);
            toast.success(`Calendar shared with ${userData.email}`);
            setIsAddUserPopoverOpen(false);
        } catch (error) {
            console.error('Failed to share calendar:', error);
            toast.error(`Failed to share calendar. ${error.response.data.message}`);
        }
    };

    const handleColorChangeSubmit = async (newColor) => {
        try {
            await calendarApi.updateCalendar(calendar.id, { color: newColor });
            toast.success('Calendar color updated');
            setIsChangeColorPopoverOpen(false);
            await refreshCalendars();
        } catch (error) {
            console.error('Failed to update color:', error);
            toast.error('Failed to update calendar color');
        }
    };

    return (
        <div
            className="calendar-item"
            style={{ '--calendar-color': calendar.color }}
        >
            <label className="calendar-label">
                <input
                    type="checkbox"
                    checked={calendar.visible}
                    onChange={() => toggleCalendarVisibility(calendar.id)}
                    className="hidden-checkbox"
                />

                <div className="custom-checkbox">
                    <CheckIcon />
                </div>

                <span className="calendar-name">{calendar.name}</span>
            </label>

            {calendar.id !== 'holidays' && (
                <button
                    ref={buttonRef}
                    className={`calendar-menu-btn ${isMenuOpen ? 'active' : ''}`}
                    onClick={handleMenuClick}
                >
                    <ThreeDotsIcon />
                </button>
            )}

            {isMenuOpen && createPortal(
                <div
                    ref={menuRef}
                    className="calendar-menu-dropdown open"
                    style={{
                        position: 'fixed',
                        top: menuPosition.top,
                        left: menuPosition.left,
                        zIndex: 9999
                    }}
                >
                    {isOwner && (
                        <>
                            {calendar.canShare && (
                                <button className="calendar-menu-item" onClick={handleAddUserClick}>
                                    Add another user
                                </button>
                            )}
                            <button className="calendar-menu-item" onClick={handleChangeColorClick}>
                                Change color
                            </button>
                        </>
                    )}
                    {isOwner ? (
                        calendar.canDelete && (
                            <button className="calendar-menu-item" onClick={handleDeleteClick}>
                                Delete
                            </button>
                        )
                    ) : (
                        <button className="calendar-menu-item" onClick={handleLeaveClick}>
                            Leave calendar
                        </button>
                    )}
                </div>,
                document.body
            )}

            <AddUserPopover
                isOpen={isAddUserPopoverOpen}
                onClose={() => setIsAddUserPopoverOpen(false)}
                onSubmit={handleAddUserSubmit}
                anchorPosition={popoverAnchorPosition}
                calendarName={calendar.name}
            />

            <ChangeColorPopover
                isOpen={isChangeColorPopoverOpen}
                onClose={() => setIsChangeColorPopoverOpen(false)}
                onSubmit={handleColorChangeSubmit}
                anchorPosition={popoverAnchorPosition}
                currentColor={calendar.color}
                calendarName={calendar.name}
            />
        </div>
    );
};

export default CalendarItem;
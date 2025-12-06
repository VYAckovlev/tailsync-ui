import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calendarApi } from '../../services/calendarApi';
import toast from 'react-hot-toast';
import './JoinCalendar.css';

const JoinCalendar = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const joinCalendar = async () => {
            if (!token) {
                toast.error('Invalid invitation link');
                navigate('/tailsync');
                return;
            }

            try {
                await calendarApi.joinByToken(token);
                toast.success('Successfully joined the calendar!');
                navigate('/tailsync');
            } catch (error) {
                console.error('Failed to join calendar:', error);
                toast.error('Failed to join calendar. Please try again.');
                navigate('/tailsync');
            } finally {
                setIsProcessing(false);
            }
        };

        joinCalendar();
    }, [token, navigate]);

    return (
        <div className="join-calendar-container">
            <div className="join-calendar-content">
                {isProcessing && (
                    <>
                        <div className="spinner"></div>
                        <p>Joining calendar...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default JoinCalendar;
import {useEffect, useState} from "react";

export const useDraggable = (ref, initialPosition, IsOpen = true) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});

    useEffect(() => {
        if (IsOpen) {
            setPosition(initialPosition);
        }
    }, [initialPosition, IsOpen]);

    const handleMouseDown = (e) => {
        if (e.target.closest('button') || e.target.closest('.no-drag')) return;
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setIsDragging(true);
        }
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e) => {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset]);

    return {position, isDragging, handleMouseDown};
};
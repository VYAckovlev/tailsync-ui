// import {useRef, useState} from "react";
// import {useClickOutside} from "../../hooks/useClickOutside.js";
//
//
// const EventPopover = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const popoverRef = useRef(null);
//
//     useClickOutside(popoverRef, () => {setIsOpen(false);})
//
//     const [formData, setFormData] = useState({
//         title: '',
//         type: '', // 'arrangement' | 'reminder' | 'task'
//         date: new Date().toISOString().split('T')[0],
//         time: '',
//     });
//
// }
//
// export default EventPopover;
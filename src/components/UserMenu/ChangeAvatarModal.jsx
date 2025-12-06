import {useState, useRef, useEffect} from 'react';
import {useUser} from "../../hooks/useUser.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../Modal/Modal.jsx";
import {getUserInitials} from "../../utils/UserUtils.js";
import toast from "react-hot-toast";
import './ChangeAvatarModal.css';
import GalleryIcon from "../../shared/icons/Gallery.icon.jsx";

const ChangeAvatarModal = ({isOpen, onClose}) => {
    const {user} = useAuth();
    const {updateAvatar, loading} = useUser();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(user?.avatar || '');

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setPreview(user?.avatar || '');
            setSelectedFile(null);
        }
    }, [isOpen, user?.avatar]);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setSelectedFile(file);
    }

    const handleSubmit = async () => {
        if (!selectedFile) {
            onClose();
        }
        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);
            const result = await updateAvatar(formData);
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success('Avatar updated successfully');
            onClose();
        } catch (err) {
            console.error('Error uploading avatar:', err);
            toast.error('Failed to upload avatar');
        } finally {
            onClose();
        }
    }
    if (!user) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Avatar">
            <div className="avatar-upload-container">
                <div className="avatar-preview-wrapper" onClick={handleAvatarClick}>
                    {preview ? (
                        <img src={preview} alt="Avatar preview" className="avatar-preview-img" />
                    ) : (
                        <div className="avatar-placeholder">
                            <span className="avatar-icon">{getUserInitials(user)}</span>
                        </div>
                    )}
                    <div className="avatar-overlay">
                        <GalleryIcon/>
                        <span>Change</span>
                    </div>
                </div>
                <p className="avatar-hint">Click on the image to choose a new one</p>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleSubmit}
                        disabled={loading || !selectedFile}
                    >
                        {loading ? 'Uploading...' : 'Save Avatar'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ChangeAvatarModal;
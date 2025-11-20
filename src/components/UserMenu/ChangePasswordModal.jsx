import Modal from '../Modal/Modal';
import UpdateForm from '../UpdateForm/UpdateForm';
import { changePasswordConfig, formValidators } from '../../shared/constants/form';
import { useUser } from '../../hooks/useUser';
import toast from 'react-hot-toast';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { updatePassword, loading } = useUser();

    const onSubmit = async (data) => {
        try {
            const validation = formValidators.validatePasswordMatch(data.new_password, data.confirm_password);
            if (!validation.isValid) {
                toast.error(validation.error);
                return;
            }

            const result = await updatePassword(data.old_password, data.new_password);
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success("Password updated successfully!");
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
            <UpdateForm
                fields={changePasswordConfig.fields}
                onSubmit={onSubmit}
                submitButtonText={loading ? "Updating..." : changePasswordConfig.submitButtonText}
            />
        </Modal>
    );
};

export default ChangePasswordModal;
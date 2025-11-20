import Modal from '../Modal/Modal';
import UpdateForm from '../UpdateForm/UpdateForm';
import { changeNameConfig } from '../../shared/constants/form';
import { useUser } from '../../hooks/useUser';
import toast from 'react-hot-toast';

const ChangeNameModal = ({ isOpen, onClose }) => {
    const { updateName, loading } = useUser();

    const onSubmit = async (data) => {
        try {
            const result = await updateName(data.name);
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success("Name updated successfully!");
            onClose();
        } catch (err) {
            toast.error(err.message);
        }finally {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Name">
            <UpdateForm
                fields={changeNameConfig.fields}
                onSubmit={onSubmit}
                submitButtonText={loading ? "Saving..." : changeNameConfig.submitButtonText}
            />
        </Modal>
    );
};

export default ChangeNameModal;
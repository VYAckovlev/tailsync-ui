import FormPopover from '../FormPopover/FormPopover.jsx';
import useForm  from '../../hooks/useForm.js';
import './AddUserPopover.css';

const AddUserPopover = ({ isOpen, onClose, onSubmit, anchorPosition, calendarName }) => {
    const fields = [
        { name: 'email', type: 'email', value: '', required: true },
        { name: 'role', type: 'select', value: 'user', options: ['user', 'admin'] }
    ];

    const { formData, handleChange, handleSubmit } = useForm(fields, (data) => {
        onSubmit(data);
    });

    return (
        <FormPopover
            isOpen={isOpen}
            onClose={onClose}
            anchorPosition={anchorPosition}
            title={`Share "${calendarName}"`}
        >
            <form onSubmit={handleSubmit} className="add-user-form">
                <div className="form-group">
                    <label htmlFor="user-email">Email</label>
                    <input
                        type="email"
                        id="user-email"
                        name="email"
                        placeholder="user@example.com"
                        required
                        onChange={handleChange}
                        value={formData.email}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="user-role">Role</label>
                    <select
                        id="user-role"
                        name="role"
                        onChange={handleChange}
                        value={formData.role}
                        required
                    >
                        <option value="" disabled selected>Select Role</option>
                        <option value="viewer">Viewer</option>
                        <option value="contributor">Contributor</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" className="primary-button">
                        Share Calendar
                    </button>
                </div>
            </form>
        </FormPopover>
    );
};

export default AddUserPopover;
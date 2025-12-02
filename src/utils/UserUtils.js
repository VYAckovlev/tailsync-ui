const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getUserInitials = (user) => {
    if (!user) {
        return 'U';
    }

    const name = user.name;
    const email = user.email;

    if (name.trim()) {
        const nameParts = name.trim().split(' ').filter(part => part.length > 0);

        if (nameParts.length === 0) {
            return email ? email[0].toUpperCase() : 'U';
        }

        if (nameParts.length === 1) {
            return nameParts[0].substring(0, 2).toUpperCase();
        }

        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }

    if (email && email.trim()) {
        return email[0].toUpperCase();
    }

    return 'U';
};

export const getAvatarUrl = (avatarPath) => {
    if (!avatarPath || !avatarPath.trim()) {
        return null;
    }

    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }

    return `${API_BASE_URL}${avatarPath}`;
};
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
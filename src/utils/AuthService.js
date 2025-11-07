export const authService = {
    setToken (accessToken) {
        localStorage.setItem('token', accessToken);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    clearAuth() {
        localStorage.removeItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
}
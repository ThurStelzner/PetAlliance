// auth.js - Gerenciamento de Autenticação
const Auth = {
    getState: function() {
        return JSON.parse(localStorage.getItem('pa:user') || 'null');
    },
    setState: function(user) {
        if (user) {
            localStorage.setItem('pa:user', JSON.stringify(user));
        } else {
            localStorage.removeItem('pa:user');
        }
    },
    logout: function() {
        this.setState(null);
        window.location.href = 'index.html';
    },
    updateAuthUI: function() {
        const user = this.getState();
        const authOnly = document.querySelectorAll('.auth-only');
        authOnly.forEach(el => {
            if (user) el.classList.remove('hidden'); else el.classList.add('hidden');
        });

        const authBtn = document.getElementById('auth-btn');
        const authBtnMobile = document.getElementById('auth-btn-mobile');
        const logoutBtn = document.getElementById('logout-btn');
        const logoutBtnMobile = document.getElementById('logout-btn-mobile');

        if (user) {
            if (authBtn) authBtn.classList.add('hidden');
            if (authBtnMobile) authBtnMobile.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (logoutBtnMobile) logoutBtnMobile.classList.remove('hidden');
        } else {
            if (authBtn) authBtn.classList.remove('hidden');
            if (authBtnMobile) authBtnMobile.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (logoutBtnMobile) logoutBtnMobile.classList.add('hidden');
        }
        return user;
    }
};
window.Auth = Auth;

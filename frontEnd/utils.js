// utils.js - Helpers globais
const Utils = {
    calcAge: function(bd) {
        const diff = Date.now() - new Date(bd).getTime();
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        if (years > 0) return `${years} ano${years > 1 ? 's' : ''}`;
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
        return `${months} mês${months !== 1 ? 'es' : ''}`;
    },
    qs: function(sel, root = document) { return root.querySelector(sel); },
    qsa: function(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
};
window.Utils = Utils;

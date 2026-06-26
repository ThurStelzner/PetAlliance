// favorites.js - Gerenciamento de Favoritos
const Favorites = {
    getState: function() {
        return JSON.parse(localStorage.getItem('pa:favs') || '[]');
    },
    setState: function(favs) {
        localStorage.setItem('pa:favs', JSON.stringify(favs));
    },
    toggle: function(id) {
        let favs = this.getState();
        const idx = favs.indexOf(id);
        if (idx === -1) favs.push(id); else favs.splice(idx, 1);
        this.setState(favs);
        this.updateBadges();
        return favs.includes(id);
    },
    updateBadges: function() {
        const count = this.getState().length;
        const favCount = document.getElementById('fav-count');
        const favCountMobile = document.getElementById('fav-count-mobile');
        
        if (favCount) {
            favCount.textContent = count || '';
            if (count) favCount.classList.remove('hidden'); else favCount.classList.add('hidden');
        }
        if (favCountMobile) {
            favCountMobile.textContent = count || '';
            if (count) favCountMobile.classList.remove('hidden'); else favCountMobile.classList.add('hidden');
        }
    }
};
window.Favorites = Favorites;

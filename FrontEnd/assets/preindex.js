window.data = {
    works: [],
    categories: [],
};
window.filtersActive = [];

if (!!getToLocalJSON('user')) {
    const [, payload] = decodeJWT(getToLocalJSON('user').token);
    if (Date.now() > (payload.exp * 1000)) {
        window.localStorage.removeItem('user');
        console.log('session expired');
    }
}

window.isConnected = !!getToLocalJSON('user');
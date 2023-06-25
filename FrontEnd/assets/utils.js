window.BASE_URL_API = 'http://localhost:5678/api';

// Function to make url for API
function makeUrl(endpoint) {
    return window.BASE_URL_API + endpoint;
}

// Remove element from array and return new array
function removeFromArray(arr, id, key) {
    const index = key
        ? arr.findIndex((e) => e[key] == id)
        : arr.findIndex((e) => e == id);
    if (index < 0) return arr;
    arr.splice(index, 1);
    return arr;
}

// parse obj to string and save to localStorage
function setToLocalJSON(key, obj) {
    window.localStorage.setItem(key, JSON?.stringify(obj));
}

// parse string to obj from localStorage
function getToLocalJSON(key) {
    const value = window.localStorage.getItem(key);
    if (!value || value == "") return null;
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
}

function decodeJWT(jwt) {
    const splitedJWT = jwt.split('.');
    return [header, payload] = splitedJWT.slice(0, 2).map((c) => JSON.parse(atob(c)));
}
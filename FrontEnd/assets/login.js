const loginBtn = document.querySelector('#login-btn');

const headers = new Headers();
headers.append('Content-Type', 'application/json');

function showError(text) {
    const error = document.getElementById('error');
    error.innerText = text;
}

loginBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    const { value: email } = document.querySelector('#email');
    const { value: password } = document.querySelector('#password');

    if (!email) {
        return void showError('Vous devez renseigner votre addresse mail');
    }

    if (!password) {
        return void showError('Vous devez renseigner votre mot de passe');
    }

    fetch(makeUrl('/users/login'), {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers
    })
        .then(async (res) => await res.json())
        .then((data) => {
            if (data.message == 'user not found' || 'error' in data) {
                showError('Erreur dans l\'identifiant ou le mot de passe');
                return;
            }
            setToLocalJSON('user', data);
            window.location.href = '/'
        })
        .catch(() => showError('Une erreur est survenue.'))
});
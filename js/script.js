import App from './app.js';

const theme = document.getElementById('theme'),
    body = document.body;
theme.addEventListener('click', () => {
    if (theme.classList.contains('ativo')) {
        theme.classList.remove('ativo');
        body.classList.remove('escuro');
    } else {
        theme.classList.add('ativo');
        body.classList.add('escuro');
    }
});

App();
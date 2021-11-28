import App from './app.js';

const theme = document.getElementById('theme'),
    body = document.body;
theme.addEventListener('click', () => {
    if (theme.classList.contains('ativo')) {
        theme.classList.remove('ativo');
        document.body.classList.remove('escuro');
    } else {
        theme.classList.add('ativo');
        document.body.classList.add('escuro');
    }
});

App();
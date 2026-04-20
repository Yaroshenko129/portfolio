const eyelid = document.querySelector('.eyelid');
const pupil = document.querySelector('.pupil');
const btn = document.querySelector('.creepy-btn');

/* мигание */
function blink() {
    eyelid.style.transition = 'top 0.15s';
    eyelid.style.top = '0';

    setTimeout(() => {
        eyelid.style.top = '-100%';
    }, 150);
}

setInterval(() => {
    blink();
}, Math.random() * 4000 + 1500);

/* движение зрачка */
function movePupil() {
    const x = Math.random() * 40 - 20;
    const y = Math.random() * 20 - 10;
    pupil.style.transform = `translate(${x}px, ${y}px)`;
}

setInterval(movePupil, 300);

/* ПЕРЕХОД НА СТРАНИЦУ */
btn.addEventListener('click', () => {
    window.location.href = "menu.html";
});
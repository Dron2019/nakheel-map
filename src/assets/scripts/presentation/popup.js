const buttonsRef = document.querySelectorAll('.presentation-btn');

const links = [
  'https://www.comobynakheel.com/emotions/home',
  'https://tecma-demo.com/clients/d1west/emotions',
  './web/viewer.html?file=https://nakheelmap.com/static/palm-beach-tower.pdf',
  './web/viewer.html?file=https://nakheelmap.com/static/dubai-islands.pdf',
];

buttonsRef.forEach(function(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    const popup = document.getElementById('popup');
    const index = Array.from(buttonsRef).indexOf(button);
    const iframe = popup.querySelector('iframe');
    iframe.src = links[index];

    const buttonText = button.innerText;
    const iframeTitleRef = popup.querySelector('.presentation-popup-top__title');
    iframeTitleRef.innerHTML = buttonText;

    // Відкриваємо попап

    popup.classList.add('active');

    // Додаємо обробник кліків на close-елемент попапа
    const close = popup.querySelector('.presentation-popup-top__btn');
    close.addEventListener('click', function(event) {
      event.preventDefault();
      popup.classList.remove('active');
    });
  });
});

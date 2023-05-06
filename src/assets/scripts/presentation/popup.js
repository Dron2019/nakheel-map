const buttonsRef = document.querySelectorAll('.presentation-btn');

const links = [
  'https://www.comobynakheel.com/emotions/home',
  'https://tecma-demo.com/clients/d1west/emotions',
  'https://nakheelmap.com/static/palm-beach-tower.pdf',
  'https://nakheelmap.com/static/dubai-islands.pdf',
];

buttonsRef.forEach(function(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    const popup = document.getElementById('popup');
    const close = popup.querySelector('.presentation-popup-top__btn');
    const iframeTitleRef = popup.querySelector('.presentation-popup-top__title');
    const index = Array.from(buttonsRef).indexOf(button);
    const iframe = popup.querySelector('iframe');

    iframe.src = links[index];

    const buttonText = button.innerText;

    iframeTitleRef.innerHTML = buttonText;

    popup.classList.add('active');

    close.addEventListener('click', function(event) {
      event.preventDefault();
      popup.classList.remove('active');
    });
  });
});

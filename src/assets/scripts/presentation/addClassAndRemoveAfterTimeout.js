function addClassAndRemoveAfterTimeout(selector, className) {
  const blocks = document.querySelectorAll(selector);

  blocks.forEach(block => {
    const button = block.querySelector('.presentation-btn-qr');

    button.addEventListener('click', () => {
      const popupQrRef = button.nextElementSibling || button.previousElementSibling;
      const otherBigButtonsRef = document.querySelectorAll('.presentation-btn');
      if (popupQrRef && otherBigButtonsRef) {
        popupQrRef.classList.toggle(className);
        otherBigButtonsRef.forEach(otherButton => {
          if (otherButton !== button) {
            otherButton.classList.toggle(className);
          }
        });
        setTimeout(() => {
          popupQrRef.classList.remove(className);
          otherBigButtonsRef.forEach(otherButton => {
            if (otherButton !== button) {
              otherButton.classList.remove(className);
            }
          });
        }, 30000);
      }
    });
  });
}
addClassAndRemoveAfterTimeout('.presentation-btn-item', 'is-active');

const buttonsRef = document.querySelectorAll('.presentation-btn-qr');
const largeButtonsRef = document.querySelectorAll('.presentation-btn');
const closeQrButtonRef = document.querySelectorAll('.presentation-btn-popup-qr-close');


buttonsRef.forEach(button => {
  button.addEventListener('click', () => {
    const itemRef = document.querySelectorAll('.presentation-btn-qr');
    const largeButtonsRef = document.querySelectorAll('.presentation-btn');
    const popupQrRef = button.nextElementSibling;

    itemRef.forEach( item => {
      item.classList.add('hidden');
    });

    largeButtonsRef.forEach( item => {
      item.classList.add('hidden');
    })
    
    popupQrRef.classList.add('is-active');
        
  });
});

closeQrButtonRef.forEach( close => {
  close.addEventListener('click', () => {
    const itemRef = document.querySelectorAll('.presentation-btn-qr');
    const largeButtonsRef = document.querySelectorAll('.presentation-btn');
    const popupQrRef = document.querySelectorAll('.presentation-btn-popup-qr');

    itemRef.forEach( item => {
      item.classList.remove('hidden');
    });

    largeButtonsRef.forEach( item => {
      item.classList.remove('hidden');
    });
    
    popupQrRef.forEach(popup => {
        popup.classList.remove('is-active');
    });
  }); 
});

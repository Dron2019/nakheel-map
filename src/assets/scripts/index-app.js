import PDFObject from 'pdfobject';
let pdfViewer = null;
const pinData = {
  palm_beach_towers: {
    title: 'Palm Beach Towers ',
    text: `Palm Beach Towers 3 is an amalgam of
    style and luxury that inspires a fresh
    perspective; where each day the
    sounds of the waves are the backdrop
    to a life immersed in the best the city
    has to offer.`,
    image_url: './assets/images/palm-beach-towers/image.jpg',
    qr_url: './assets/images/palm-beach-towers/qr.jpg',
    pdf_text: 'Palm Beach Towers presentation',
    pdf_url: `./static/palm-beach-tower.pdf`
  },
  dubai_islands: {
    title: 'Dubai Islands',
    text: `Welcome to Dubai Islands, where opportunity
    flows. As the spectacular vision of the Nakheel
    Group, Dubai Islands rises from the sea,
    redefining the horizon of Dubai and inviting you
    to step across the bridge, towards a future of
    possibilities.`,
    image_url: './assets/images/dubai-islands/image.jpg',
    qr_url: './assets/images/dubai-islands/qr.jpg',
    pdf_text: 'Dubai Islands presentation',
    pdf_url: `./static/dubai-islands.pdf`
  },
  district_11: {
    title: 'District 11',
    text: `With exceptional access to Downtown Dubai, District 11 Opal Gardens enlivens the spirit with verdant green spaces encircling a stunning crystal lagoon. Secure and gated, the development will feature well-crafted villas and townhouses surrounded by lush landscaping and over 5–kilometers of cycling and pedestrian trails.`,
    image_url: './assets/images/district-11/image.jpg',
    qr_url: './assets/images/district-11/qr.jpg',
    pdf_text: 'District 11 presentation',
    pdf_url: `./static/district-11.pdf`
  }
}


let timeoutClosing = 0;

document.body.addEventListener('click',function(evt){
  const target = evt.target.closest('.popup__close');
  if (!target) return;

  target.closest('.popup').classList.remove('visible');

});
document.body.addEventListener('click',function(evt){
  const target = evt.target.closest('g[data-id]');
  if (!target) return;

  const popup = document.querySelector('.popup');

  const data = pinData[target.dataset.id];

  popup.querySelector('.popup__text div').textContent = data.title;
  popup.querySelector('.popup__text p').textContent = data.text;
  popup.querySelector('.popup__img').src = data.image_url;
  popup.querySelector('.popup__qr').src = data.qr_url;
  popup.querySelector('button').dataset.url = data.pdf_url;
  popup.querySelector('button').dataset.text = data.pdf_text;


  const { width,height } = popup.getBoundingClientRect();

  const { top, left } = target.getBoundingClientRect();
  
  const leftOffset = Math.min(left, window.innerWidth - width / 2);
  const topOffset = Math.min(top, window.innerHeight - height / 2);


  popup.style.left = Math.max(leftOffset, width/2)+'px';
  popup.style.top = Math.max(topOffset, height)+'px';

  popup.classList.add('visible');

});

document.body.addEventListener('click',function(evt){
  const target = evt.target.closest('.popup2__close');
  if (!target) return;

  document.querySelector('.popup2').classList.remove('visible');

});

document.body.addEventListener('click',function(evt){
  const target = evt.target.closest('[data-url]');
  if (!target) return;

  const popup = document.querySelector('.popup2');
  popup.style.height = target.dataset.height ? target.dataset.height : '';


  PDFObject.embed(target.dataset.url, "[data-pdf]", {
    forceIframe: true,
  });

  console.log();
  // popup.querySelector('iframe').src = target.dataset.url;

  // popup.querySelector('iframe').contentWindow.location.reload();
  popup.querySelector('.popup2__title').textContent = target.dataset.text;
  popup.classList.add('visible');

});

document.body.addEventListener('click',function(evt){
  clearTimeout(timeoutClosing);
  addTimeout();
});

function closePopups() {
  document.querySelectorAll('.popup2, .popup').forEach(el => {
    el.classList.remove('visible');
  })
}

function addTimeout() {
  timeoutClosing = setTimeout(closePopups, 1000 * 120);
}


window.addEventListener('myevent',function(evt){

  console.log('EVENT');
});


import PDFObject from 'pdfobject';
import customSelecthandler from './modules/selectHandler';
import useState from './modules/hooks/useState';
import svgSwitcher from './modules/svgSwitcher';
import Swiper, { Pagination } from 'swiper';

import 'current-device';
import { gsap } from 'gsap';

const a = customSelecthandler('[data-select]');



svgSwitcher();

const [ filter, setFilter, useFilterEffect ] = useState({});

useFilterEffect((state) => {

  console.log(state);
  let elementsToHide = [];
  let elementsToShow = []

  document.querySelectorAll('[data-filter-item]').forEach(elementForFilter => {
    let validCount = 0;
    let fieldsCountForValidation = 0; 

    Object.entries(state).forEach(([ filterKey, filterValue ]) => {
      const datasetValue = elementForFilter.dataset[`filter_${filterKey}`];
      if (!datasetValue) {
        validCount++;
        fieldsCountForValidation++;
        return;
      }
      if (!filterValue) {
        validCount++;
        fieldsCountForValidation++;
        return;
      }
      if (datasetValue != filterValue) {
        fieldsCountForValidation++;
        return;
      }
      validCount++;
      fieldsCountForValidation++;
    });
    console.log('validCount',validCount,
      'fieldsCountForValidation', fieldsCountForValidation);

    elementForFilter.style.display =  validCount == fieldsCountForValidation ? '' :  'none';

    if (validCount == fieldsCountForValidation) {
      elementsToShow.push(elementForFilter);
    } else {
      elementsToHide.push(elementForFilter);
    }    
  });

  // gsap.to(elementsToShow, {
  //   display: 1
  // })
  
  // gsap.to(elementsToHide, {
  //   autoAlpha: 0
  // })

})  

// setFilter(Array.from(document.querySelectorAll('select[data-select]')).reduce((acc,el) => {
//   acc[el.name] = '';
//   return acc;
// }, {}))


a.onChange(({ target }) => {
  console.log('efefef change', target.dataset.select, target.name);
  setFilter({
    ...filter(),
    [target.name]: target.value,
  })
});






let pdfViewer = null;
const pinData = {
  como_residence: {
    title: 'Como Residences ',
    text: `Como Residences blends the very best of the world’s most luxurious destinations into one monumental, architectural landmark.`,
    image_url: './assets/images/como-residence/image.jpg',
    qr_url: './assets/images/como-residence/qr.jpg',
    pdf_text: 'Como Residences presentation',
    pdf_url: `./static/como_residence.pdf`,
  },
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
    pdf_url: `./static/palm-beach-tower.pdf`,
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
    pdf_url: `./static/dubai-islands.pdf`,
  },
  district_11: {
    title: 'District 11',
    text: `With exceptional access to Downtown Dubai, District 11 Opal Gardens enlivens the spirit with verdant green spaces encircling a stunning crystal lagoon. Secure and gated, the development will feature well-crafted villas and townhouses surrounded by lush landscaping and over 5–kilometers of cycling and pedestrian trails.`,
    image_url: './assets/images/district-11/image.jpg',
    qr_url: './assets/images/district-11/qr.jpg',
    pdf_text: 'District 11 presentation',
    pdf_url: `./static/district-11.pdf`,
  },

  nakheeeeel: {
    images: ['./assets/images/district-11/qr.jpg', './assets/images/district-11/image.jpg'],
    qr_url: './assets/images/district-11/qr.jpg',
    title: 'Nakheeltitle',
    text: 'Lorem Ipsum',
    gallery_link: 'https://google.com/',
    video_link: 'https://google.com/',
    payment_plan: 'https://google.com/',
    floor_plans: 'https://google.com/',
    material_board_specification_link: 'https://google.com/' 

  }
};

let timeoutClosing = 0;

const popupSlider = new Swiper('.popup .swiper-container', {
  modules: [ Pagination ],
  pagination: {
    el: '.popup .swiper-container .thumbs',
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="thumbs__item ' + className + '"></span>';
    },
  },
});

document.body.addEventListener('click', function(evt) {
  if (evt.target.closest('.popup') === null) {
    document.querySelector('.popup').classList.remove('visible');
    return;
  }
  const target = evt.target.closest('.popup__close');
  if (!target) return;

  target.closest('.popup').classList.remove('visible');
});
document.body.addEventListener('click', function(evt) {
  const target = evt.target.closest('g[data-id]');
  if (!target) return;

  const popup = document.querySelector('.popup');

  const data = pinData[target.dataset.id];
  if (!data) return;


  popup.querySelector('[data-gallery-link]').setAttribute('href', data.gallery_link);
  popup.querySelector('[data-video-link]').setAttribute('href', data.video_link);
  popup.querySelector('[data-payment-plan-link]').setAttribute('href', data.payment_plan);
  popup.querySelector('[data-floor-plan-link]').setAttribute('href', data.floor_plans);
  popup.querySelector('[data-material-board-specification]').setAttribute('href', data.material_board_specification_link);

  popup.querySelector('.swiper-wrapper').innerHTML = data.images.map(el => `
    <img src="${el}" class="swiper-slide">
  `).join('');

  popupSlider.update();

  // gallery_link
  // video_link
  // payment_plan
  // floor_plans
  // material_board_specification_link

  popup.querySelector('.popup__text div').textContent = data.title;
  popup.querySelector('.popup__text p').textContent = data.text;
  // popup.querySelector('.popup__img').src = data.image_url;
  popup.querySelector('.popup__qr').src = data.qr_url;
  // popup.querySelector('button').dataset.url = data.pdf_url;
  // popup.querySelector('button').dataset.text = data.pdf_text;

  const { width, height } = popup.getBoundingClientRect();

  const { top, left } = target.getBoundingClientRect();

  const leftOffset = Math.min(left, window.innerWidth - width / 2);
  const topOffset = Math.min(top, window.innerHeight - height / 2);

  popup.style.left = Math.max(leftOffset, width / 2) + 'px';
  popup.style.top = Math.max(topOffset, height) + 'px';

  popup.classList.add('visible');
});

document.body.addEventListener('click', function(evt) {
  if (evt.target.closest('.popup2') === null) {
    document.querySelector('.popup2').classList.remove('visible');
    return;
  }
  const target = evt.target.closest('.popup2__close');
  if (!target) return;
  document.querySelector('.popup2').classList.remove('visible');
});

document.body.addEventListener('click', function(evt) {
  const target = evt.target.closest('[data-url]');
  if (!target) return;

  const popup = document.querySelector('.popup2');
  popup.style.height = target.dataset.height ? target.dataset.height : '';

  const isIOS = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);

  if (isIOS) {
    document.querySelector('[data-pdf]').innerHTML = '';
    document.querySelector('[data-pdf]').insertAdjacentHTML(
      'afterbegin',
      `
      <iframe src="./web/viewer.html?file=${window.location.origin}/${target.dataset.url.replace(
        './',
        '',
      )}"></iframe>
    `,
    );
  } else {
    PDFObject.embed(target.dataset.url, '[data-pdf]', {
      forceIframe: true,
      supportRedirect: true,
    });
  }

  // document.querySelector('[data-pdf]').innerHTML = '';

  // document.querySelector('[data-pdf]').insertAdjacentHTML(
  //   'afterbegin',
  //   `
  //   <iframe src="./web/viewer.html?file=${window.location.origin}/${target.dataset.url.replace(
  //     './',
  //     '',
  //   )}"></iframe>
  // `,
  // );

  // PDFObject.embed(target.dataset.url, "[data-pdf]", {
  //   // forceIframe: true,
  //   supportRedirect:true,
  // });

  console.log();
  // popup.querySelector('iframe').src = target.dataset.url;

  // popup.querySelector('iframe').contentWindow.location.reload();
  popup.querySelector('.popup2__title').textContent = target.dataset.text;
  popup.classList.add('visible');
});

document.body.addEventListener('click', function(evt) {
  clearTimeout(timeoutClosing);
  addTimeout();
});

function closePopups() {
  document.querySelectorAll('.popup2, .popup').forEach(el => {
    el.classList.remove('active');
    el.classList.remove('visible');
  });

  document.querySelectorAll('.active[data-zone-highlighter]').forEach(el => el.click());
}

function addTimeout() {
  timeoutClosing = setTimeout(closePopups, 1000 * 120);
}

window.addEventListener('myevent', function(evt) {
  console.log('EVENT');
});

document.querySelector('[data-zone-highlighter]').addEventListener('change', function(evt) {
  this.classList.toggle('active');
  console.log('efefefegreswgh e tfew tgesw gfes tgfesw ', this.checked);
  if (this.checked) {
    document.querySelectorAll('[class*="master communiti"]').forEach(el => el.classList.add('active'));
  } else {
    document.querySelectorAll('[class*="master communiti"]').forEach(el => el.classList.remove('active'));
  }
});

if (document.querySelector('[data-zone-highlighter]').checked) {
  document.querySelectorAll('[class*="master communiti"]').forEach(el => el.classList.add('active'));
} else {
  document.querySelectorAll('[class*="master communiti"]').forEach(el => el.classList.remove('active'));
}

// if (window.matchMedia('(max-width: 1920px').matches) {
//   document.querySelector('.map>svg').setAttribute('preserveAspectRatio', 'xMaxYMin slice');
// }




const [ clickedProject, setClickedProject, useClickedProjectEffect ] = useState({
  name: '',
  element: null
});

useClickedProjectEffect(val => {

  console.log(val);

  if (val.element) {
    document.querySelectorAll('[data-project]').forEach(el => {
      if (val.element === el || el.classList.contains('communiti')) return el.style.opacity = '';
      if (val.element !== el) return el.style.opacity = '0.2';
    })
  } else {
    document.querySelectorAll('[data-project]').forEach(el => {
      el.style.opacity = '';
    })
  }

  if (val.name)  {
    document.querySelectorAll('[data-img-overlay]').forEach(el => el.style.opacity = '');
    document.querySelectorAll('[data-filter_infrastructure]').forEach(el => el.style.opacity = '0');
    
  } else {
    document.querySelectorAll('[data-img-overlay]').forEach(el => el.style.opacity = 0);
    document.querySelectorAll('[data-filter_infrastructure]').forEach(el => el.style.opacity = '');
  }




  // console.log(val);
});
useClickedProjectEffect(val => {

  document.querySelectorAll('[data-project-routes]').forEach(el => {
    if (el.dataset.projectRoutes === val.name) {
      el.style.display = '';
    } else {
      
      el.style.display = 'none';
    }
  })
});


useClickedProjectEffect(val => {

  document.querySelectorAll('[data-landmark]').forEach(el => {
    if (val.name) {
      el.classList.add('inverted');
    } else {
      el.classList.remove('inverted');
    }
  });
});


const disabledLandmarksOnProjects = {
  CanalFrontResidence: ['Dubai Canal'],
  'Palm Jumeirah': ['The View at Palm', 'The Palm Monorail', 'Nakheel Sales Center'],
  'Nakheel Marinas Dubai Islands': ['Nakheel Marinas Dubai Islands'],
  'Dubai Islands': ['Nakheel Marinas Dubai Islands']
}

/**disable some individual landmarks on some clicked projects */
useClickedProjectEffect(val => {

  

  if (!val.name){
    document.querySelectorAll('[data-landmark]').forEach(el => {
      el.style.display = '';
    });
    return;
  }
  
  document.querySelectorAll('[data-landmark]').forEach(el => {
    const ignoreItems = disabledLandmarksOnProjects[val.name];
    if (!ignoreItems) return el.style.display = '';
    console.log(el.dataset.landmark);
    if (ignoreItems.includes(el.dataset.landmark)) {
      el.style.display = 'none';
    }
  });
});


useClickedProjectEffect(val => {
  const activeProject = document.querySelector(`.master.communiti[data-project="${val.name}"]`);

  if (!val.name) {
    document.querySelectorAll('.master.communiti').forEach(el => {
      el.classList.remove('shadowed');
    });
    return;
  }
  document.querySelectorAll('.master.communiti').forEach(el => {
    if (el === activeProject) {
      el.classList.remove('shadowed');
    } else {
      el.classList.add('shadowed');
    }
  });
});



setClickedProject({
  ...clickedProject(),
  name: ''
});


const [ activeInnerRoute, setActiveInnerRoute, useActiveInnerRouteEffect ] = useState(null);

document.body.addEventListener('click',function(evt){
  const target = evt.target.closest('[data-project]');
  if (target && target.dataset.project === clickedProject().name) return;
  if (evt.target.closest('[data-landmark]')) return;
  if (!target) {
    setClickedProject({
      ...clickedProject(),
      name: '',
      element: null,
    });
    setActiveInnerRoute(null);
    return;
  }
  setClickedProject({
    ...clickedProject(),
      name: target.dataset.project,
      element: target
  });

  console.log(target);
});




useActiveInnerRouteEffect(val => {
  console.log(val);
  document.querySelectorAll('.active[data-inner-route]').forEach(el => {
    el.classList.remove('active');
  });
  const landmarks = document.querySelectorAll('[data-landmark]');
  if (val) {
    val.classList.add('active');

    const activeLandMark = document.querySelector(`[data-landmark="${val.classList.value.replace(' active', '')}"]`);

    landmarks.forEach(el => {
      if (el === activeLandMark) {
        el.classList.remove('shadowed');
      } else {
        el.classList.add('shadowed');
      }
    })
    console.log(activeLandMark);
    
    simulatePathDrawing(val.querySelector('.Path'));
    return;
  }

  landmarks.forEach(el => {
    el.classList.remove('shadowed');
  })
});


document.querySelectorAll('[data-landmark]').forEach(el => {

  el.addEventListener('click', () => {

    const innerRouteOfClickedProject = document.querySelector(`[data-project-routes="${clickedProject().name}"] [data-inner-route][class*="${el.dataset.landmark}"]`);

    if (!innerRouteOfClickedProject) {
      setActiveInnerRoute(null);
      return;
    }
    
    setActiveInnerRoute(innerRouteOfClickedProject);



    console.log('[data-landmark]click');
  })
  el.addEventListener('mouseenter', () => {
    console.log('[data-landmark]mouseenter');
  })
  el.addEventListener('mouseleave', () => {
    console.log('[data-landmark]mouseleave');
  })
});



function simulatePathDrawing(path, strokeWidth = "3") {
  // var path = document.querySelector('.squiggle-animated path');
  var length = path.getTotalLength();

  console.log(length);
  // Clear any previous transition
  path.style.transition = path.style.WebkitTransition = "none";
  // Set up the starting positions
  path.style.strokeDasharray = length + " " + length;
  path.style.strokeDashoffset = length;
  // Trigger a layout so styles are calculated & the browser
  // picks up the starting position before animating
  path.getBoundingClientRect();
  // Define our transition
  path.style.transition = path.style.WebkitTransition =
    "stroke-dashoffset 1.5s ease-in-out";
  // Go!
  path.style.strokeDashoffset = "0";
  // path.style.strokeWidth = strokeWidth;
  // path.style.stroke = "#F7F7F7";
}
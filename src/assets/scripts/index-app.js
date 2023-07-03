import PDFObject from 'pdfobject';
import useState from './modules/hooks/useState';
import svgSwitcher from './modules/svgSwitcher';
import Swiper, { Pagination } from 'swiper';

import 'current-device';
import { pinData } from './modules/pinData';

svgSwitcher();

const [ filter, setFilter, useFilterEffect ] = useState(() => {
  const state = {};

  document.querySelectorAll('[data-select]').forEach(input => {
    const key = input.getAttribute('name');
    state[key] = new Set();
  })

  return state;


});

useFilterEffect((state) => {

  let elementsToHide = [];
  let elementsToShow = []

  document.querySelectorAll('[data-filter-item]').forEach(elementForFilter => {
    let validCount = 0;
    let fieldsCountForValidation = 0; 

    Object.entries(state).forEach(([ filterKey, filterValue ]) => {
      const datasetValue = elementForFilter.dataset[`filter_${filterKey}`];


      
      if (filterKey === 'infrastructure' && filterValue.size === 0 && elementForFilter.dataset.filter_infrastructure) {
        fieldsCountForValidation++;
        return;
      }

      if (filterValue.size === 0 || !datasetValue) {
        validCount++;
        fieldsCountForValidation++;
        return;
      }
      if (!filterValue.has(datasetValue)) {
        
        fieldsCountForValidation++;
        return;
      }

      validCount++;
      fieldsCountForValidation++;
    });

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

setFilter({
  ...filter()
})

document.body.addEventListener('change', (evt) => {
  const target = evt.target.closest('[data-select]');
  if (!target) return;
  const key = target.getAttribute('name');
  const value = target.value;
  
  const currentFilterState = filter()[key];

  target.checked ? currentFilterState.add(value) : currentFilterState.delete(value);
  setFilter({
    ...filter(),
    [key] : currentFilterState
  })
})


let pdfViewer = null;

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
  console.log(evt.target);
  if (evt.target.closest('.popup') === null && evt.target.closest('.popup2') === null) {
    document.querySelector('.popup').classList.remove('visible');
    return;
  }
  const target = evt.target.closest('.popup__close');
  if (!target) return;

  target.closest('.popup').classList.remove('visible');
});
document.body.addEventListener('dblclick', function(evt) {
  const target = evt.target.closest('g[data-id]');
  if (!target) return;

  const popup = document.querySelector('.popup');

  const data = pinData[target.dataset.id];
  if (!data) return;


  popup.querySelector('[data-gallery-link]').setAttribute('data-url', data.gallery_link || '#');
  popup.querySelector('[data-video-link]').setAttribute('data-url', data.video_link || '#');
  popup.querySelector('[data-payment-plan-link]').setAttribute('data-url', data.payment_plan || '#');
  popup.querySelector('[data-floor-plan-link]').setAttribute('data-url', data.floor_plans || '#');
  popup.querySelector('[data-material-board-specification]').setAttribute('data-url', data.material_board_specification_link || '#');

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


document.querySelector('[data-zone-highlighter]').addEventListener('change', function(evt) {
  this.classList.toggle('active');
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

const [ clickedProject, setClickedProject, useClickedProjectEffect ] = useState({
  name: '',
  element: null
});

useClickedProjectEffect(val => {

  if (val.name) {
    document.querySelectorAll('[data-project]').forEach(el => {
      if (el.classList.contains('communiti')) return el.style.opacity = '';
      if (val.element !== el) return el.style.opacity = '0';
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

});




useActiveInnerRouteEffect(val => {
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

    console.log(innerRouteOfClickedProject);
    if (!innerRouteOfClickedProject) {
      setActiveInnerRoute(null);
      return;
    }
    
    setActiveInnerRoute(innerRouteOfClickedProject);
  })
});



function simulatePathDrawing(path, strokeWidth = "3") {
  
  var length = path.getTotalLength();

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
}


document.body.addEventListener('click', (evt) => {
  const target = evt.target.closest('[data-checkbox-dropdown]');
  if (target) {

    document.querySelectorAll('.on[data-checkbox-dropdown]').forEach(el => {
      if (el === target) return;
      el.classList.remove('on')
    });
    return;
  }

  document.querySelectorAll('.on[data-checkbox-dropdown]').forEach(el => el.classList.remove('on'));

})

document.querySelectorAll('[data-checkbox-dropdown]').forEach(el => {
  const head = el.querySelector('.dropdown-label');
  head.addEventListener('click', () => el.classList.toggle('on'));
})
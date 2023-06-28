import PDFObject from 'pdfobject';
import customSelecthandler from './modules/selectHandler';
import useState from './modules/hooks/useState';
import svgSwitcher from './modules/svgSwitcher';

const a = customSelecthandler('[data-select]');



svgSwitcher();

const [ filter, setFilter, useFilterEffect ] = useState({});

useFilterEffect((state) => {

  console.log(state);

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

    elementForFilter.style.display = validCount == fieldsCountForValidation ? '' :  'none';
    
  })
})  

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
};

let timeoutClosing = 0;

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

  popup.querySelector('.popup__text div').textContent = data.title;
  popup.querySelector('.popup__text p').textContent = data.text;
  popup.querySelector('.popup__img').src = data.image_url;
  popup.querySelector('.popup__qr').src = data.qr_url;
  popup.querySelector('button').dataset.url = data.pdf_url;
  popup.querySelector('button').dataset.text = data.pdf_text;

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

if (window.matchMedia('(max-width: 1920px').matches) {
  document.querySelector('.map>svg').setAttribute('preserveAspectRatio', 'xMaxYMin slice');
}




const [ clickedProject, setClickedProject, useClickedProjectEffect ] = useState('');

useClickedProjectEffect(val => {

  if (val)  {
    document.querySelectorAll('[data-img-overlay]').forEach(el => el.style.opacity = '');
    
  } else {
    document.querySelectorAll('[data-img-overlay]').forEach(el => el.style.opacity = 0);
  }
  // console.log(val);
});
useClickedProjectEffect(val => {

  document.querySelectorAll('[data-project-routes]').forEach(el => {
    if (el.dataset.projectRoutes === val) {
      el.style.display = '';
    } else {
      
      el.style.display = 'none';
    }
  })
});


useClickedProjectEffect(val => {

  document.querySelectorAll('[data-landmark]').forEach(el => {
    if (val) {
      el.classList.add('inverted');
    } else {
      el.classList.remove('inverted');
    }
  });
});


useClickedProjectEffect(val => {

  console.log('clicked Project', val);
  const activeProject = document.querySelector(`[data-project="${val}"]`);

  console.log(activeProject);
  if (!val) {
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



setClickedProject('');


const [ activeInnerRoute, setActiveInnerRoute, useActiveInnerRouteEffect ] = useState(null);

document.body.addEventListener('click',function(evt){
  const target = evt.target.closest('[data-project]');
  if (target && target.dataset.project === clickedProject()) return;
  if (evt.target.closest('[data-landmark]')) return;
  if (!target) {
    setClickedProject('');
    setActiveInnerRoute(null);
    return;
  }
  setClickedProject(target.dataset.project);

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

    const innerRouteOfClickedProject = document.querySelector(`[data-project-routes="${clickedProject()}"] [data-inner-route][class*="${el.dataset.landmark}"]`);

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
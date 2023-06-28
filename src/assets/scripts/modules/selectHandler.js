import customSelect from 'custom-select';



export default function customSelecthandler(selector) {

    const a = customSelect(selector);

    a.forEach(cstSel => {

        console.log(cstSel);

        cstSel.container.querySelector('.custom-select-panel').insertAdjacentHTML(
            'afterbegin', 
            `
                <div class="custom-select-panel-title">
                    ${cstSel.select.dataset.select}
                </div>
            `
        );
        cstSel.select.addEventListener('change', (evt) => {
            const $selectTitle = cstSel.container.querySelector('.custom-select-opener span');

            if (evt.target.value) {
                $selectTitle.innerHTML = `${cstSel.select.dataset.select}: <b>${evt.target.querySelector(`[value="${evt.target.value}"]`).textContent}</b>`;
            } else {
                $selectTitle.innerHTML = `${cstSel.select.dataset.select}`;

            }
            console.log();
        });
    })


    return {
        onChange: (func) => {
            a.forEach(cstSel => {
                cstSel.select.addEventListener('change', func);
            }) 
        }
    }
}
//form-step2

const modal = document.querySelector('.modal-form');
const openBtn = document.querySelector('#cta-section-button');
const closeEls = modal ? modal.querySelectorAll('a.close-button, .modal-background') : [];
const startQuizBtn = modal ? modal.querySelector('.button-cta-quiz') : null;
const backBtn = modal ? modal.querySelector('.button-cta-back') : null;
const quizCard = modal ? modal.querySelector('.quiz-card') : null;
const quizCardContent = modal ? modal.querySelector('.quiz-card-content') : null;
const submitForm =  document.querySelector('.submit_form');

const buttonOpenModal = document.querySelectorAll('.button-open-modal');

const nextButtons = modal ? modal.querySelectorAll('.next-button') : [];
const backButtons = modal ? modal.querySelectorAll('.back-button') : [];

const submitButton = modal ? modal.querySelector('.submit-button') : null; 

const formSteps = [document.querySelector('.form-step1'), document.querySelector('.form-step2'), document.querySelector('.form-step3'), document.querySelector('.form-step4'), document.querySelector('.form-step5'), document.querySelector('.form-step6')];
let currentStep = 0;

const openModal = () => {
    if (!modal) return;
    modal.style.display = 'flex';
};

const closeModal = () => {
    if (!modal) return;
    modal.style.display = 'none';
};

nextButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault(); 
        formSteps[currentStep].classList.remove('active');
        formSteps[currentStep + 1].classList.add('active'); 
        currentStep++;  
        console.log(currentStep);
    });
});


backButtons.forEach(button => {
    button.addEventListener('click', e => {
        console.log("back presesd");
        e.preventDefault();
        formSteps[currentStep].classList.remove('active');
        formSteps[currentStep - 1].classList.add('active');
        currentStep--;
        console.log("went troug");
    });
});




buttonOpenModal.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        openModal();
    }); 
});




submitButton.addEventListener('click', e => {
    e.preventDefault(); 
    // Here you can add any form validation or submission logic before closing the modal
    closeModal();
});

const rangeInput = document.querySelector('#rangeInput');
const thumbValue = document.querySelector('#thumbValue');

if (rangeInput && thumbValue) {
    const updateBudgetLabel = value => {
        thumbValue.innerHTML = `Your budget: <span class="thumb-value-style">${value}$</span>`;
    };

    const snapValue = value => {
        const step = 250;
        const min = Number(rangeInput.min);
        const raw = Number(value);
        const snapped = Math.round((raw - min) / step) * step + min;
        return String(Math.min(rangeInput.max, Math.max(rangeInput.min, snapped)));
    };

    rangeInput.value = snapValue(rangeInput.value);
    updateBudgetLabel(rangeInput.value);

    rangeInput.addEventListener('input', e => {
        const snapped = snapValue(e.target.value);
        rangeInput.value = snapped;
        updateBudgetLabel(snapped);
    });
}

closeEls.forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        closeModal();
    });
});


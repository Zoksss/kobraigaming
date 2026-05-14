//form-step2

const modal = document.querySelector('.modal-form');
const openBtn = document.querySelector('#cta-section-button');
const closeEls = modal ? modal.querySelectorAll('a.close-button, .modal-background') : [];
const startQuizBtn = modal ? modal.querySelector('.button-cta-quiz') : null;
const backBtn = modal ? modal.querySelector('.button-cta-back') : null;
const quizCard = modal ? modal.querySelector('.quiz-card') : null;
const quizCardContent = modal ? modal.querySelector('.quiz-card-content') : null;
const submitForm = document.querySelector('.submit_form');

const buttonOpenModal = document.querySelectorAll('.button-open-modal');

const nextButtons = modal ? modal.querySelectorAll('.next-button') : [];
const backButtons = modal ? modal.querySelectorAll('.back-button') : [];

const submitButton = document.querySelector('#submit_button');
const notification = document.querySelector('#submission-message');
let notificationTimeout = null;

const formSteps = [document.querySelector('.form-step1'), document.querySelector('.form-step2'), document.querySelector('.form-step3'), document.querySelector('.form-step4'), document.querySelector('.form-step5'), document.querySelector('.form-step6')];
let currentStep = 0;

const showMessage = (message, type = 'success') => {
    if (!notification) {
        console[type === 'error' ? 'warn' : 'log']('Notification container not found:', message);
        return;
    }

    clearTimeout(notificationTimeout);
    notification.textContent = message;
    notification.classList.remove('success', 'error');
    notification.classList.add(type, 'visible');

    notificationTimeout = setTimeout(() => {
        notification.classList.remove('visible');
    }, 4500);
};

const hideMessage = () => {
    if (!notification) return;
    notification.classList.remove('visible');
    clearTimeout(notificationTimeout);
};

const openModal = () => {
    if (!modal) return;
    modal.style.display = 'flex';
};

const closeModal = () => {
    if (!modal) return;
    modal.style.display = 'none';
};

const validateEmail = value => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value.trim());
};

const validateStep5 = () => {
    const step5 = document.querySelector('.form-step5');
    if (!step5) return true;

    const requiredInputs = Array.from(step5.querySelectorAll('.form-input[required], input[required]'));
    const emptyFields = requiredInputs.filter(input => !input.value.trim());

    if (emptyFields.length > 0) {
        showMessage('Please fill in all required fields before continuing.', 'error');
        emptyFields[0].focus();
        return false;
    }

    const emailInput = step5.querySelector('input[name="Email"], input#gmail');
    if (emailInput && !validateEmail(emailInput.value)) {
        showMessage('Please enter a valid email address.', 'error');
        emailInput.focus();
        return false;
    }

    return true;
};

nextButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        if (currentStep === 4 && !validateStep5()) {
            return;
        }

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
    // 1. Potpuno zaustavljamo slanje stranice i ućutkujemo Webflow skripte
    e.preventDefault();
    e.stopPropagation();
    console.log('Submit button clicked, preparing to collect form data...');

    const form = document.querySelector('#email-form');
    if (!form) {
        console.warn('Email form not found.');
        closeModal();
        return;
    }

    // Close the modal immediately when the user submits
    closeModal();

    // 2. Tvoja funkcija uspešno skuplja snapshot svih koraka
    const formValues = getFormSnapshot(form);
    console.log('Collected quiz values:', formValues);

    // 1. Prvo skupljamo ciljeve iz checkboxova u jedan string
    const goalsCombined = [
        ...(formValues["checkbox-1"] || []),
        ...(formValues["checkbox-2"] || []),
        ...(formValues["checkbox-3"] || []),
        ...(formValues["checkbox-4"] || [])
    ].join(', ');

    // 2. Pravimo sirovi objekat, ali pazimo na 'email' ključ (mora biti validan ako postoji)
    const rawData = {
        name: formValues["Name"]?.trim() || undefined,
        email: formValues["Email"]?.includes('@') ? formValues["Email"].trim() : undefined, // Šalje se samo ako je validan email
        budget: formValues["Budget"] ? `${formValues["Budget"]}$` : undefined,
        website: formValues["Website"]?.trim() || undefined,
        geo: formValues["GEO"]?.trim() || undefined,
        discovery: formValues["Where did you hear about us?"]?.trim() || undefined,
        goals: goalsCombined ? goalsCombined : undefined,
        niche: formValues["radio"] && formValues["radio"] !== "Radio" ? formValues["radio"] : undefined
    };

    // 3. BRISANJE UKLETIH 'UNDEFINED' POLJA (Da Formspree dobije samo čiste podatke)
    const cleanDataForFormspree = Object.fromEntries(
        Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== "")
    );

    console.log('Spremno za Formspree (Bez praznih polja):', cleanDataForFormspree);

    // 4. SLANJE NA FORMSPREE
    fetch('https://formspree.io/f/xkoylwkk', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanDataForFormspree)
    })
        .then(response => {
            if (response.ok) {
                showMessage('Thank you! Your quiz has been submitted successfully.', 'success');
                closeModal();
            } else {
                response.json().then(errData => {
                    showMessage('Sorry, we could not submit the quiz. Please try again later.', 'error');
                }).catch(() => {
                    showMessage('Sorry, we could not submit the quiz. Please try again later.', 'error');
                });
            }
        })
        .catch(error => {
            showMessage('A network error occurred while sending the quiz. Please check your connection and try again.', 'error');
        });
});

const rangeInput = document.querySelector('#rangeInput');
const thumbValue = document.querySelector('#thumbValue');

const getFormSnapshot = form => {
    const formData = {};
    const fields = [...form.querySelectorAll('input, textarea, select')];

    fields.forEach(field => {
        if (field.disabled || field.type === 'button' || field.type === 'submit' || field.type === 'reset' || field.type === 'image') {
            return;
        }

        const key = field.name || field.id || field.type;
        if (!key) {
            return;
        }

        if (field.type === 'radio') {
            if (!field.checked) {
                return;
            }
            formData[key] = field.value;
            return;
        }

        if (field.type === 'checkbox') {
            if (!formData[key]) {
                formData[key] = [];
            }
            if (field.checked) {
                formData[key].push(field.value);
            }
            return;
        }

        formData[key] = field.value;
    });

    return formData;
};

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


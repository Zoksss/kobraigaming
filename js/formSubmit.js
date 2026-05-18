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
const requestCaseStudiesButton = modal ? modal.querySelector('#request_case_studies_button') : null;
const requestEmailInput = modal ? modal.querySelector('#request-email') : null;
const requestEmailStep = modal ? modal.querySelector('.form-step-simple') : null;
const notification = document.querySelector('#submission-message');
let notificationTimeout = null;

const formSteps = [document.querySelector('.form-step1'), document.querySelector('.form-step2'), document.querySelector('.form-step3'), document.querySelector('.form-step4'), document.querySelector('.form-step5'), document.querySelector('.form-step6')];
let currentStep = 0;

const activateStep = step => {
    if (!modal || !step) return;
    const allSteps = modal.querySelectorAll('.quiz-card, .quiz-card-content');
    allSteps.forEach(el => el.classList.remove('active'));
    step.classList.add('active');
};

const showMessage = (message, type = 'success') => {
    if (!notification) {
        console[type === 'error' ? 'warn' : 'log']('Notification container not found:', message);
        return;
    }

    clearTimeout(notificationTimeout);
    notification.textContent = message;
    notification.classList.remove('success', 'error', 'info');
    notification.classList.add(type, 'visible');

    if (type !== 'info') {
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('visible');
        }, 4500);
    }
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
    });
});


backButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        if (currentStep === -1) {
            activateStep(formSteps[0]);
            currentStep = 0;
            return;
        }
        if (currentStep > 0) {
            formSteps[currentStep].classList.remove('active');
            formSteps[currentStep - 1].classList.add('active');
            currentStep--;
        }
    });
});


buttonOpenModal.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        openModal();
        const target = button.dataset.modalTarget;
        if (target === 'simple' && requestEmailStep) {
            activateStep(requestEmailStep);
            currentStep = -1;
        } else {
            activateStep(formSteps[0]);
            currentStep = 0;
        }
    });
});

if (requestCaseStudiesButton) {
    requestCaseStudiesButton.addEventListener('click', e => {
        e.preventDefault();
        const email = requestEmailInput ? requestEmailInput.value.trim() : '';

        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            if (requestEmailInput) requestEmailInput.focus();
            return;
        }

        const form = document.querySelector('#email-form');
        if (!form) {
            closeModal();
            return;
        }

        closeModal();

        const rawData = {
            email: email,
            requestType: 'Full Case Studies'
        };

        const cleanDataForFormspree = Object.fromEntries(
            Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== "")
        );

        showMessage('Submitting your request...', 'info');

        fetch('https://formspree.io/f/mnjrqyaq', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cleanDataForFormspree)
        })
            .then(response => {
                if (response.ok) {
                    showMessage('Thank you! Your request has been sent successfully.', 'success');
                } else {
                    showMessage('Sorry, we could not submit your request. Please try again later.', 'error');
                }
            })
            .catch(() => {
                showMessage('A network error occurred while sending your request. Please check your connection and try again.', 'error');
            });
    });
}

submitButton.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    const form = document.querySelector('#email-form');
    if (!form) {
        closeModal();
        return;
    }

    closeModal();

    const formValues = getFormSnapshot(form);

    const goalsCombined = [
        ...(formValues["checkbox-1"] || []),
        ...(formValues["checkbox-2"] || []),
        ...(formValues["checkbox-3"] || []),
        ...(formValues["checkbox-4"] || [])
    ].join(', ');

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

    const cleanDataForFormspree = Object.fromEntries(
        Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== "")
    );

    showMessage('Submitting your quiz...', 'info');

    fetch('https://formspree.io/f/mjgldqnp', {
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


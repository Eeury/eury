// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Sections
const homeSection = document.getElementById('home');
const sections = {
    about: document.getElementById('about-section'),
    service: document.getElementById('service-section'),
    review: document.getElementById('review-section'),
    portfolio: document.getElementById('portfolio-section'),
    contact: document.getElementById('contact-section')
};

// Reviews loaded from server
const initialReviewsEl = document.getElementById('initial-reviews-data');
let reviews = [];
if (initialReviewsEl) {
    try {
        reviews = JSON.parse(initialReviewsEl.textContent) || [];
    } catch (e) {
        reviews = [];
    }
}

const reviewGrid = document.getElementById('reviewGrid');

function renderReviews() {
    reviewGrid.innerHTML = '';
    if (reviews.length === 0) {
        const empty = document.createElement('div');
        empty.classList.add('review-card');
        empty.innerHTML = `
          <p class="review-text">No reviews yet. Be the first to share your experience!</p>
        `;
        reviewGrid.appendChild(empty);
        return;
    }

    reviews.forEach(review => {
        const card = document.createElement('div');
        card.classList.add('review-card');
        card.innerHTML = `
          <p class="review-text">${review.text}</p>
          <div class="review-author">${review.name}</div>
          <div class="review-title">${review.title}</div>
        `;
        reviewGrid.appendChild(card);
    });
}

renderReviews();

async function fetchReviews() {
    try {
        const resp = await fetch('/api/reviews/');
        if (!resp.ok) return;
        const data = await resp.json();
        if (Array.isArray(data.reviews)) {
            reviews = data.reviews;
            renderReviews();
        }
    } catch (e) {
        // silently ignore fetch errors
    }
}

// Enhanced form validation
const submitBtn = document.getElementById('submitReview');
const nameInput = document.getElementById('reviewName');
const titleInput = document.getElementById('reviewTitle');
const textInput = document.getElementById('reviewText');

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) return meta.getAttribute('content');
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
}

function validateForm() {
    let valid = true;

    if (nameInput.value.trim().length < 2) {
        document.getElementById('nameGroup').classList.add('invalid');
        valid = false;
    } else {
        document.getElementById('nameGroup').classList.remove('invalid');
    }

    if (titleInput.value.trim().length < 2) {
        document.getElementById('titleGroup').classList.add('invalid');
        valid = false;
    } else {
        document.getElementById('titleGroup').classList.remove('invalid');
    }

    if (textInput.value.trim().length < 20) {
        document.getElementById('textGroup').classList.add('invalid');
        valid = false;
    } else {
        document.getElementById('textGroup').classList.remove('invalid');
    }

    submitBtn.disabled = !valid;
    return valid;
}

nameInput.addEventListener('input', validateForm);
titleInput.addEventListener('input', validateForm);
textInput.addEventListener('input', validateForm);

submitBtn.addEventListener('click', async () => {
    if (!validateForm()) return;

    const payload = {
        name: nameInput.value.trim(),
        title: titleInput.value.trim(),
        text: textInput.value.trim(),
    };

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';

    try {
        const resp = await fetch('/api/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify(payload),
        });

        if (!resp.ok) {
            submitBtn.textContent = 'Try Again';
            return;
        }

        const data = await resp.json();
        if (data.review) {
            reviews.unshift(data.review);
            renderReviews();
            nameInput.value = '';
            titleInput.value = '';
            textInput.value = '';
            validateForm();
            submitBtn.textContent = 'Thank You! Review Submitted';
            submitBtn.style.background = '#10b981';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 2000);
            reviewGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            submitBtn.textContent = 'Try Again';
        }
    } catch (e) {
        submitBtn.textContent = 'Error, retry';
    } finally {
        submitBtn.disabled = false;
    }
});

validateForm();

// Pull latest reviews from server (including admin-added)
fetchReviews();

// Menu navigation
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');

        const sectionKey = this.getAttribute('data-section');

        Object.values(sections).forEach(sec => sec.classList.remove('visible'));
        homeSection.style.display = sectionKey === 'home' ? 'flex' : 'none';

        if (sectionKey !== 'home') {
            const target = sections[sectionKey];
            if (target) {
                target.classList.add('visible');
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        }
    });
});

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('[data-section="home"]').click();
    });
});


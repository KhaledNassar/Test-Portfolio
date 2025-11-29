// ========== Smooth Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            const navLinks = document.getElementById('navLinks');
            const hamburger = document.getElementById('hamburger');
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== Hamburger Menu Toggle ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// ========== Fade-in Effect on Scroll ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// ========== Modal & Read More Functionality ==========
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const closeModal = document.querySelector('.modal-close');

function initializeSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        const btn = card.querySelector('.read-more');
        const title = card.querySelector('h3').textContent;
        const ul = card.querySelector('.skill-content');
        const listItems = ul.querySelectorAll('li');
        
        if(listItems.length > 4) {
            btn.style.display = 'flex';
            
            listItems.forEach((item, index) => {
                if(index >= 4) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex';
                }
            });
            
            btn.addEventListener('click', () => {
                const allItemsHTML = Array.from(listItems).map(item => 
                    `<li style="display: flex; align-items: center; padding: 8px 0;">
                        <span style="color: var(--primary-color); margin-right: 10px;">✓</span>
                        ${item.textContent}
                     </li>`
                ).join('');
                
                modalText.innerHTML = `
                    <h3>${title}</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${allItemsHTML}
                    </ul>
                `;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        } else {
            btn.style.display = 'none';
            listItems.forEach(item => {
                item.style.display = 'flex';
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeSkillCards();
    setTimeout(initializeSkillCards, 100);
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalText.innerHTML = '';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.style.display = 'none';
        modalText.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        modalText.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
});

// ========== Navbar Background Change on Scroll ==========
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(18, 10, 6, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(18, 10, 6, 0.9)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========== Carousel ==========
const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const indicatorsContainer = document.querySelector('.carousel-indicators');

const cards = Array.from(track.children);
const totalCards = cards.length;

function getCardsToShow() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
}

let cardsToShow = getCardsToShow();
let currentIndex = 0;

function createIndicators() {
    indicatorsContainer.innerHTML = '';
    const numIndicators = totalCards - cardsToShow + 1;
    
    for(let i = 0; i < numIndicators; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(dot);
    }
}

function updateIndicators() {
    const dots = indicatorsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function getCardWidth() {
    if(cards.length === 0) return 0;
    const card = cards[0];
    const style = window.getComputedStyle(card);
    const width = card.offsetWidth;
    const gap = parseFloat(style.marginRight) || 30;
    return width + gap;
}

function goToSlide(index) {
    const maxIndex = totalCards - cardsToShow;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    
    const cardWidth = getCardWidth();
    const offset = -currentIndex * cardWidth;
    
    track.style.transition = 'transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)';
    track.style.transform = `translateX(${offset}px)`;
    updateIndicators();
}

function nextSlide() {
    const maxIndex = totalCards - cardsToShow;
    if(currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    goToSlide(currentIndex);
}

function prevSlide() {
    if(currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalCards - cardsToShow;
    }
    goToSlide(currentIndex);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') prevSlide();
    if(e.key === 'ArrowRight') nextSlide();
});

let touchStartX = 0;
let touchEndX = 0;

const carouselWrapper = document.querySelector('.carousel-wrapper');

carouselWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if(Math.abs(diff) > swipeThreshold) {
        if(diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

let autoSlideInterval = setInterval(nextSlide, 5000);

track.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

track.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newCardsToShow = getCardsToShow();
        if(newCardsToShow !== cardsToShow) {
            cardsToShow = newCardsToShow;
            currentIndex = 0;
            createIndicators();
            goToSlide(0);
        } else {
            goToSlide(currentIndex);
        }
    }, 250);
});

createIndicators();
goToSlide(0);

// ========== Contact Form with Web3Forms ==========
const contactForm = document.getElementById('contactForm');

if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const sendBtn = contactForm.querySelector('.send-btn');
        const originalText = sendBtn.innerHTML;
        
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if(data.success) {
                sendBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent Successfully!';
                sendBtn.style.background = '#4CAF50';
                
                setTimeout(() => {
                    sendBtn.innerHTML = originalText;
                    sendBtn.style.background = '';
                    sendBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            } else {
                throw new Error('Failed to send');
            }
        } catch(error) {
            console.error('Error:', error);
            sendBtn.innerHTML = '<i class="fas fa-times"></i> Failed to Send - Try Again';
            sendBtn.style.background = '#f44336';
            
            setTimeout(() => {
                sendBtn.innerHTML = originalText;
                sendBtn.style.background = '';
                sendBtn.disabled = false;
            }, 3000);
        }
    });
}

// ========== Loading Animation ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

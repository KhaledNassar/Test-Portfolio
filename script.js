// ========== Smooth Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            // Close mobile menu if open
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

// Close menu when clicking outside
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

// Function to initialize skill cards
function initializeSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        const btn = card.querySelector('.read-more');
        const title = card.querySelector('h3').textContent;
        const ul = card.querySelector('.skill-content');
        const listItems = ul.querySelectorAll('li');
        
        console.log(`Card: "${title}" - Total items: ${listItems.length}`);
        
        // Check if there are more than 4 items
        if(listItems.length > 4) {
            console.log(`Showing Read More for "${title}" - ${listItems.length} items`);
            btn.style.display = 'flex';
            
            // Hide extra items initially (keep only first 4 visible)
            listItems.forEach((item, index) => {
                if(index >= 4) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex';
                }
            });
            
            btn.addEventListener('click', () => {
                // Show all items in modal
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
            console.log(`Hiding Read More for "${title}" - only ${listItems.length} items`);
            btn.style.display = 'none';
            
            // Show all items since there are 4 or less
            listItems.forEach(item => {
                item.style.display = 'flex';
            });
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSkillCards();
    
    // Re-initialize after a short delay to ensure all styles are applied
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

// Close modal with Escape key
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
    
    // Change background opacity
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(18, 10, 6, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(18, 10, 6, 0.9)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========== Simple Carousel with Loop Reset ==========
const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const indicatorsContainer = document.querySelector('.carousel-indicators');

// Get all cards
const cards = Array.from(track.children);
const totalCards = cards.length;

// Calculate how many cards to show based on screen width
function getCardsToShow() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
}

let cardsToShow = getCardsToShow();
let currentIndex = 0;

// Create indicators
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

// Update indicators
function updateIndicators() {
    const dots = indicatorsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Calculate card width including gap
function getCardWidth() {
    if(cards.length === 0) return 0;
    const card = cards[0];
    const style = window.getComputedStyle(card);
    const width = card.offsetWidth;
    const gap = parseFloat(style.marginRight) || 30;
    return width + gap;
}

// Go to specific slide
function goToSlide(index) {
    const maxIndex = totalCards - cardsToShow;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    
    const cardWidth = getCardWidth();
    const offset = -currentIndex * cardWidth;
    
    track.style.transition = 'transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)';
    track.style.transform = `translateX(${offset}px)`;
    updateIndicators();
}

// Next slide
function nextSlide() {
    const maxIndex = totalCards - cardsToShow;
    if(currentIndex < maxIndex) {
        currentIndex++;
    } else {
        currentIndex = 0; // Reset to beginning
    }
    goToSlide(currentIndex);
}

// Previous slide
function prevSlide() {
    if(currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalCards - cardsToShow; // Jump to end
    }
    goToSlide(currentIndex);
}

// Event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') prevSlide();
    if(e.key === 'ArrowRight') nextSlide();
});

// Touch/Swipe support
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

// Auto-slide every 5 seconds
let autoSlideInterval = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
track.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

track.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
});

// Handle window resize
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

// Initialize carousel
createIndicators();
goToSlide(0);

// ========== Contact Form Enhancement ==========
const contactForm = document.getElementById('contactForm');

if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        const sendBtn = contactForm.querySelector('.send-btn');
        const originalText = sendBtn.innerHTML;
        
        // Try to send via formsubmit.co (free service)
        try {
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            sendBtn.disabled = true;
            
            const response = await fetch('https://formsubmit.co/ajax/kh.ahmednassar@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `Portfolio Contact from ${name}`
                })
            });
            
            if(response.ok) {
                sendBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
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
            // Fallback to mailto if API fails
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            
            window.location.href = `mailto:kh.ahmednassar@gmail.com?subject=${subject}&body=${body}`;
            
            sendBtn.innerHTML = originalText;
            sendBtn.disabled = false;
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

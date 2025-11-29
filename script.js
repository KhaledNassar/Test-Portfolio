// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target){
            target.scrollIntoView({behavior:'smooth', block:'start'});
        }
    });
});

// Fade-in effect on scroll
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(section);
});

// Modal & Read More functionality - UPDATED
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const closeModal = document.querySelector('.modal-close');

document.querySelectorAll('.skill-card').forEach(card => {
    const ul = card.querySelector('ul');
    const btn = card.querySelector('.read-more');
    const title = card.querySelector('h3').textContent; // الحصول على عنوان الكارت

    const maxLines = 4; 
    const lineHeight = parseFloat(getComputedStyle(ul).lineHeight);
    const maxHeight = lineHeight * maxLines;

    if(ul.scrollHeight > maxHeight){
        ul.style.maxHeight = maxHeight + 'px';
        ul.style.overflow = 'hidden';
        btn.style.display = 'block';
    }

    btn.addEventListener('click', () => {
        // إضافة العنوان والمحتوى في الـ Modal
        modalText.innerHTML = `<h3 style="color: #ff6a2e; margin-bottom: 15px; text-align: center;">${title}</h3>`;
        modalText.innerHTML += ul.innerHTML;
        modal.style.display = 'flex';
    });
});

closeModal.addEventListener('click', () => { 
    modal.style.display = 'none'; 
    modalText.innerHTML = ''; // تنظيف المحتوى
});

window.addEventListener('click', e => { 
    if(e.target === modal) {
        modal.style.display = 'none';
        modalText.innerHTML = ''; // تنظيف المحتوى
    }
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(18,10,6,0.95)';
    } else {
        navbar.style.background = 'rgba(18,10,6,0.9)';
    }
});



const track = document.querySelector('.carousel-track');
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const gap = 20;

// الكروت الحقيقية
const originalCards = Array.from(track.children);
const cardWidth = originalCards[0].offsetWidth + gap;

// عمل clone لأول وآخر كارت
const firstClone = originalCards[0].cloneNode(true);
const lastClone = originalCards[originalCards.length - 1].cloneNode(true);
track.appendChild(firstClone);
track.insertBefore(lastClone, originalCards[0]);

// جميع الكروت بعد الـ clones
let allCards = Array.from(track.children);
let currentIndex = 1;

// ضبط عرض track حسب عدد الكروت
track.style.width = `${cardWidth * allCards.length}px`;
track.style.display = 'flex';
track.style.flexWrap = 'nowrap';
track.style.transform = `translateX(${-cardWidth * currentIndex}px)`;

// دالة تحريك السلايدر
function moveSlide(index) {
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(${-cardWidth * index}px)`;
}

// ضبط اللوب عند نهاية transition
track.addEventListener('transitionend', () => {
    if(allCards[currentIndex] === firstClone) {
        track.style.transition = 'none';
        currentIndex = 1; // الكارت الحقيقي الأول
        track.style.transform = `translateX(${-cardWidth * currentIndex}px)`;
    }
    if(allCards[currentIndex] === lastClone) {
        track.style.transition = 'none';
        currentIndex = allCards.length - 2; // الكارت الحقيقي الأخير
        track.style.transform = `translateX(${-cardWidth * currentIndex}px)`;
    }
});

// أزرار next و prev
function nextSlide() {
    currentIndex++;
    moveSlide(currentIndex);
}

function prevSlide() {
    currentIndex--;
    moveSlide(currentIndex);
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// auto-slide كل 5 ثواني
setInterval(nextSlide, 5000);


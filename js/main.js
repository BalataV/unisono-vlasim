// ================================
// Unisono Vlašim - Main JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Initialize all modules
    initNavigation();
    initLanguageSwitcher();
    initMusicPlayer();
    initSmoothScroll();
    initScrollAnimations();
    loadEvents();
    loadGallery();
});

// ================================
// Navigation
// ================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ================================
// Language Switcher
// ================================
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('lang') || 'cs';

    // Apply saved language
    setLanguage(currentLang);

    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setLanguage(lang);
            localStorage.setItem('lang', lang);
        });
    });
}

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-cs][data-en]');
    elements.forEach(el => {
        const text = el.dataset[lang];
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// ================================
// Music Player
// ================================
function initMusicPlayer() {
    const tracks = document.querySelectorAll('.track');
    let currentAudio = null;
    let currentTrack = null;

    tracks.forEach(track => {
        const playBtn = track.querySelector('.play-btn');
        const progressBar = track.querySelector('.progress-bar');
        const progress = track.querySelector('.progress');
        const duration = track.querySelector('.track-duration');
        const audioSrc = track.dataset.src;

        // Create audio element
        const audio = new Audio(audioSrc);

        // Update duration when metadata loads
        audio.addEventListener('loadedmetadata', function() {
            duration.textContent = formatTime(audio.duration);
        });

        // Update progress
        audio.addEventListener('timeupdate', function() {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = percent + '%';
            duration.textContent = formatTime(audio.currentTime);
        });

        // Track ended
        audio.addEventListener('ended', function() {
            track.classList.remove('playing');
            playBtn.innerHTML = getPlayIcon();
            progress.style.width = '0%';
            duration.textContent = formatTime(audio.duration);
            currentAudio = null;
            currentTrack = null;
        });

        // Play button click
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePlay(audio, track, playBtn, progress);
        });

        // Track click
        track.addEventListener('click', function() {
            togglePlay(audio, track, playBtn, progress);
        });

        // Progress bar click
        progressBar.addEventListener('click', function(e) {
            e.stopPropagation();
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        });
    });

    function togglePlay(audio, track, playBtn, progress) {
        // Stop current playing track
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentTrack.classList.remove('playing');
            currentTrack.querySelector('.play-btn').innerHTML = getPlayIcon();
        }

        if (audio.paused) {
            audio.play();
            track.classList.add('playing');
            playBtn.innerHTML = getPauseIcon();
            currentAudio = audio;
            currentTrack = track;
        } else {
            audio.pause();
            track.classList.remove('playing');
            playBtn.innerHTML = getPlayIcon();
            currentAudio = null;
            currentTrack = null;
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function getPlayIcon() {
        return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }

    function getPauseIcon() {
        return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    }
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// Scroll Animations
// ================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation class to sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // CSS for animate-in
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ================================
// Load Events from JSON
// ================================
async function loadEvents() {
    try {
        const response = await fetch('content/events.json');
        if (!response.ok) return;

        const data = await response.json();
        const events = data.events || [];
        const eventsList = document.getElementById('events-list');
        const lang = localStorage.getItem('lang') || 'cs';

        if (events.length === 0) return;

        eventsList.innerHTML = events.map(event => {
            const date = new Date(event.date);
            const months = {
                cs: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
                en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            };

            return `
                <div class="event-card">
                    <div class="event-date">
                        <span class="event-day">${date.getDate()}</span>
                        <span class="event-month">${months[lang][date.getMonth()]}</span>
                    </div>
                    <div class="event-info">
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-location">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            ${event.location}
                        </p>
                        <p class="event-time">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                            ${event.time}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        // Events file doesn't exist yet, keep default content
        console.log('Events file not found, using default content');
    }
}

// ================================
// Load Gallery from JSON
// ================================
async function loadGallery() {
    try {
        const response = await fetch('content/gallery.json');
        if (!response.ok) return;

        const data = await response.json();
        const photos = data.photos || [];
        const galleryGrid = document.getElementById('gallery-grid');

        if (photos.length === 0) return;

        galleryGrid.innerHTML = photos.map(item => `
            <div class="gallery-item" onclick="openLightbox('${item.image}')">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
        `).join('');

        // Add lightbox to body
        if (!document.querySelector('.lightbox')) {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
                <img class="lightbox-content" src="" alt="">
            `;
            document.body.appendChild(lightbox);

            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) closeLightbox();
            });
        }
    } catch (e) {
        // Gallery file doesn't exist yet, keep default content
        console.log('Gallery file not found, using placeholder');
    }
}

// Lightbox functions
function openLightbox(src) {
    const lightbox = document.querySelector('.lightbox');
    const img = lightbox.querySelector('.lightbox-content');
    img.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});

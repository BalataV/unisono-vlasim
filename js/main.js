// ================================
// Unisono Vlašim - Main JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();

    initNavigation();
    initScrollSpy();
    initLanguageSwitcher();
    initMusicPlayer();
    initSmoothScroll();
    initRevealAnimations();
    initTypewriter();
    initHeroParticles();
    initScrollToTop();
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

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', e => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ================================
// Scroll Spy — Active nav link
// ================================
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
}

// ================================
// Language Switcher
// ================================
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('lang') || 'cs';

    setLanguage(currentLang);

    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);

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
    document.querySelectorAll('[data-cs][data-en]').forEach(el => {
        const text = el.dataset[lang];
        if (!text) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });
    document.documentElement.lang = lang;
    if (tw.subtitle) restartTypewriter(200);
}

// ================================
// Typewriter Effect — Hero subtitle
// ================================
const typewriterPhrases = {
    cs: ['Hudba pro vaše akce', 'Živá hudba plná energie', 'Svatby · Festivaly · Párty'],
    en: ['Music for your events', 'Live music full of energy', 'Weddings · Festivals · Parties'],
};

const tw = { phraseIdx: 0, charIdx: 0, deleting: false, timer: null, cursor: null, subtitle: null };

function typewriterTick() {
    const lang = localStorage.getItem('lang') || 'cs';
    const phrases = typewriterPhrases[lang] || typewriterPhrases.cs;
    const phrase = phrases[tw.phraseIdx % phrases.length];

    if (!tw.deleting) {
        tw.subtitle.textContent = phrase.slice(0, tw.charIdx + 1);
        tw.subtitle.appendChild(tw.cursor);
        tw.charIdx++;
        if (tw.charIdx === phrase.length) {
            tw.deleting = true;
            tw.timer = setTimeout(typewriterTick, 2000);
            return;
        }
    } else {
        tw.subtitle.textContent = phrase.slice(0, tw.charIdx - 1);
        tw.subtitle.appendChild(tw.cursor);
        tw.charIdx--;
        if (tw.charIdx === 0) {
            tw.deleting = false;
            tw.phraseIdx = (tw.phraseIdx + 1) % phrases.length;
        }
    }
    tw.timer = setTimeout(typewriterTick, tw.deleting ? 55 : 90);
}

function restartTypewriter(delay) {
    clearTimeout(tw.timer);
    tw.phraseIdx = 0;
    tw.charIdx = 0;
    tw.deleting = false;
    tw.subtitle.textContent = '';
    tw.subtitle.appendChild(tw.cursor);
    tw.timer = setTimeout(typewriterTick, delay);
}

function initTypewriter() {
    tw.subtitle = document.querySelector('.hero-subtitle');
    if (!tw.subtitle) return;
    tw.cursor = document.createElement('span');
    tw.cursor.className = 'cursor';
    tw.subtitle.textContent = '';
    tw.subtitle.appendChild(tw.cursor);
    tw.timer = setTimeout(typewriterTick, 1200);
}

// ================================
// Hero — Floating Music Notes
// ================================
function initHeroParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const notes = ['♩', '♪', '♫', '♬', '𝄞', '♭', '♮', '♯'];

    function createNote() {
        const note = document.createElement('span');
        note.className = 'note';
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.left = Math.random() * 100 + '%';
        note.style.fontSize = (Math.random() * 2 + 0.7) + 'rem';
        const duration = Math.random() * 8 + 7;
        note.style.animationDuration = duration + 's';
        note.style.animationDelay = '0s';
        container.appendChild(note);
        setTimeout(() => note.remove(), (duration + 1) * 1000);
    }

    // Initial burst — more notes upfront
    for (let i = 0; i < 18; i++) {
        setTimeout(createNote, i * 300);
    }
    setInterval(createNote, 800);
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
        const audio = new Audio(track.dataset.src);

        audio.addEventListener('loadedmetadata', () => {
            duration.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            const pct = (audio.currentTime / audio.duration) * 100;
            progress.style.width = pct + '%';
            duration.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            track.classList.remove('playing');
            playBtn.innerHTML = getPlayIcon();
            progress.style.width = '0%';
            duration.textContent = formatTime(audio.duration);
            currentAudio = null;
            currentTrack = null;
        });

        playBtn.addEventListener('click', e => { e.stopPropagation(); togglePlay(audio, track, playBtn); });
        track.addEventListener('click', () => togglePlay(audio, track, playBtn));

        progressBar.addEventListener('click', e => {
            e.stopPropagation();
            const rect = progressBar.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
        });

        // Seek on drag
        let dragging = false;
        progressBar.addEventListener('mousedown', e => {
            dragging = true;
            e.stopPropagation();
        });
        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            const rect = progressBar.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            progress.style.width = (pct * 100) + '%';
        });
        document.addEventListener('mouseup', e => {
            if (!dragging) return;
            dragging = false;
            const rect = progressBar.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            audio.currentTime = pct * audio.duration;
        });
    });

    function togglePlay(audio, track, playBtn) {
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
}

function formatTime(s) {
    if (isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function getPlayIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
}

function getPauseIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });
}

// ================================
// Reveal Animations
// ================================
function initRevealAnimations() {
    // Mark elements for reveal
    const selectors = [
        '.section-title', '.section-subtitle',
        '.about-text', '.about-image',
        '.track', '.event-card',
        '.contact-item', '.contact-form',
        '.gallery-item', '.events-note'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')]
                    .filter(el => !el.classList.contains('visible'));
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));

    // Section title underline animation
    const titleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));
}

// ================================
// Scroll To Top
// ================================
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ================================
// Load Events
// ================================
// ---- Calendar state ----
const calState = { year: 0, month: 0, events: [] };

async function loadEvents() {
    try {
        const res = await fetch('content/events.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const events = data.events || [];
        if (!events.length) return;

        const lang = localStorage.getItem('lang') || 'cs';
        const months = {
            cs: ['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'],
            en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        };

        // Render list view
        document.getElementById('events-list').innerHTML = events.map(event => {
            const d = new Date(event.date);
            return `
                <div class="event-card">
                    <div class="event-date">
                        <span class="event-day">${d.getDate()}</span>
                        <span class="event-month">${months[lang][d.getMonth()]}</span>
                        <span class="event-year">${d.getFullYear()}</span>
                    </div>
                    <div class="event-info">
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-location">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            ${event.location}
                        </p>
                        <p class="event-time">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                            ${event.time}
                        </p>
                    </div>
                </div>`;
        }).join('');

        // Set calendar start to first upcoming event month
        calState.events = events;
        const today = new Date(); today.setHours(0,0,0,0);
        const upcoming = events.find(e => new Date(e.date) >= today);
        const startDate = upcoming ? new Date(upcoming.date) : today;
        calState.year  = startDate.getFullYear();
        calState.month = startDate.getMonth();
        renderCalendarView();

        // Toggle buttons
        const btnList = document.getElementById('btn-list');
        const btnCal  = document.getElementById('btn-calendar');
        if (btnList && btnCal) {
            btnList.addEventListener('click', () => {
                document.getElementById('events-list').classList.remove('hidden');
                document.getElementById('events-calendar').classList.add('hidden');
                btnList.classList.add('active');
                btnCal.classList.remove('active');
            });
            btnCal.addEventListener('click', () => {
                document.getElementById('events-list').classList.add('hidden');
                document.getElementById('events-calendar').classList.remove('hidden');
                btnCal.classList.add('active');
                btnList.classList.remove('active');
            });
        }
    } catch(e) { /* keep default */ }
}

function renderCalendarView() {
    const { year, month, events } = calState;
    const lang = localStorage.getItem('lang') || 'cs';

    const monthNames = {
        cs: ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
        en: ['January','February','March','April','May','June','July','August','September','October','November','December']
    };
    const dayNames = {
        cs: ['Po','Út','St','Čt','Pá','So','Ne'],
        en: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    };

    // Build event map keyed by "Y-M-D"
    const eventMap = {};
    events.forEach(e => {
        const d = new Date(e.date);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!eventMap[key]) eventMap[key] = [];
        eventMap[key].push(e);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7; // Mon=0
    const today    = new Date(); today.setHours(0,0,0,0);

    let html = `
        <div class="cal-header">
            <button class="cal-nav" id="cal-prev">&#8249;</button>
            <span class="cal-month-title">${monthNames[lang][month]} <span class="cal-year">${year}</span></span>
            <button class="cal-nav" id="cal-next">&#8250;</button>
        </div>
        <div class="cal-grid">
            ${dayNames[lang].map(d => `<div class="cal-day-name">${d}</div>`).join('')}`;

    for (let i = 0; i < startDow; i++) html += `<div class="cal-cell cal-empty"></div>`;

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const key = `${year}-${month}-${day}`;
        const dayEvs = eventMap[key] || [];
        const cellDate = new Date(year, month, day); cellDate.setHours(0,0,0,0);
        const isToday = cellDate.getTime() === today.getTime();
        const isPast  = cellDate < today;

        let cls = 'cal-cell';
        if (isToday) cls += ' cal-today';
        if (isPast)  cls += ' cal-past';
        if (dayEvs.length) cls += ' cal-has-event';

        const evAttr = dayEvs.length
            ? ` data-events='${JSON.stringify(dayEvs).replace(/'/g, "\u2019")}'`
            : '';

        html += `<div class="${cls}"${evAttr}>
            <span class="cal-day-num">${day}</span>
            ${dayEvs.length ? `<div class="cal-dots">${dayEvs.map(() => '<span class="cal-dot"></span>').join('')}</div>` : ''}
        </div>`;
    }

    html += `</div><div class="cal-event-detail" id="cal-event-detail"></div>`;

    const container = document.getElementById('events-calendar');
    container.innerHTML = html;

    // Navigation
    document.getElementById('cal-prev').addEventListener('click', () => {
        calState.month--;
        if (calState.month < 0) { calState.month = 11; calState.year--; }
        renderCalendarView();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
        calState.month++;
        if (calState.month > 11) { calState.month = 0; calState.year++; }
        renderCalendarView();
    });

    // Day click → show event detail
    container.querySelectorAll('.cal-has-event').forEach(cell => {
        cell.addEventListener('click', () => {
            const raw = cell.getAttribute('data-events').replace(/\u2019/g, "'");
            const evs = JSON.parse(raw);
            container.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('cal-selected'));
            cell.classList.add('cal-selected');
            document.getElementById('cal-event-detail').innerHTML = evs.map(ev => `
                <div class="cal-detail-card">
                    <h4>${ev.title}</h4>
                    <p>📍 ${ev.location}</p>
                    <p>🕐 ${ev.time}</p>
                </div>`).join('');
        });
    });
}

// ================================
// Load Gallery
// ================================
async function loadGallery() {
    try {
        const res = await fetch('content/gallery.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const photos = data.photos || [];
        if (!photos.length) return;

        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = photos.map(item => `
            <div class="gallery-item" onclick="openLightbox('${item.image}')">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="gallery-item-overlay"><span>${item.title}</span></div>
            </div>`).join('');

        if (!document.querySelector('.lightbox')) {
            const lb = document.createElement('div');
            lb.className = 'lightbox';
            lb.innerHTML = `
                <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
                <img class="lightbox-content" src="" alt="">`;
            document.body.appendChild(lb);
            lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
        }
    } catch(e) { /* keep placeholder */ }
}

function openLightbox(src) {
    const lb = document.querySelector('.lightbox');
    lb.querySelector('.lightbox-content').src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.querySelector('.lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

// ================================
// Flip Cards (touch/click for mobile)
// ================================
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

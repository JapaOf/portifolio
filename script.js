/**
 * ====================================
 * SCRIPT PORTFÓLIO MURILLO LEITE - VERSÃO CORRIGIDA
 * Suminagashi Multicamadas + Animações Avançadas
 * Tema Dark/Light + Funcionalidades Premium
 * ====================================
 */

/* ========== FUNÇÕES UTILITÁRIAS ========== */
const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/* ========== CONFIGURAÇÃO DOS LINKS DOS PROJETOS ========== */
const PROJECT_LINKS = {
    tcc: {
        url: '#', // Link temporário até ter o projeto
        title: 'Trabalho de Conclusão de Curso - Pesquisa em Biologia',
        description: 'Um estudo aprofundado explorando aspectos fundamentais da biologia contemporânea. Pesquisa original combinando metodologia científica rigorosa com visualização de dados inovadora e design impactante.',
        period: '2023-2025',
        technologies: 'Pesquisa, Design, Visualização de Dados',
        status: 'Em manutenção',
        linkText: 'Em manutenção'
    },
    mesozoico: {
        url: 'https://japaof.github.io/site-mesozoico/',
        title: 'Era Mesozoica - Website Educacional',
        description: 'Um site imersivo e interativo que explora a fascinante Era Mesozoica. Apresenta períodos Triássico, Jurássico e Cretáceo com foco em paleontologia, evolução e descobertas científicas.',
        period: '2024 - Presente',
        technologies: 'HTML, CSS, JavaScript, Design Responsivo',
        status: 'Publicado',
        linkText: 'Visitar Site'
    }
};

/* ========== GERENCIADOR DE LINKS DOS PROJETOS ========== */
class ProjectLinksManager {
    constructor() {
        this.init();
    }

    init() {
        this.applyProjectLinks();
        this.setupProjectCards();
        this.setupKeyboardNavigation();
    }

    applyProjectLinks() {
        const projectButtons = document.querySelectorAll('.btn-projeto');
        projectButtons.forEach(button => {
            // Verifica se o botão está desabilitado
            if (button.disabled) {
                return;
            }
            
            // Para projetos normais, pega o data-projeto do card pai
            const projectCard = button.closest('.projeto-card');
            if (!projectCard) return;
            
            // Determina o tipo de projeto baseado na classe
            let projectType = null;
            if (projectCard.classList.contains('project-mesozoico')) {
                projectType = 'mesozoico';
            } else if (projectCard.classList.contains('project-tcc')) {
                projectType = 'tcc';
            }
            
            if (!projectType) return;
            
            const project = PROJECT_LINKS[projectType];
            
            if (!project) {
                console.warn(`⚠️ Projeto não encontrado: ${projectType}`);
                return;
            }
            
            // Se for link válido, configura
            if (project.url && project.url !== '#') {
                button.href = project.url;
                button.setAttribute('target', '_blank');
                button.setAttribute('rel', 'noopener noreferrer');
                button.setAttribute('title', project.title);
            }
        });
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.projeto-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Não faz nada se clicou no botão
                if (e.target.closest('.btn-projeto')) return;
                
                // Pega o botão do card
                const btn = card.querySelector('.btn-projeto');
                if (btn && !btn.disabled && btn.href && btn.href !== '#') {
                    window.open(btn.href, '_blank', 'noopener,noreferrer');
                }
            });
            card.style.cursor = 'pointer';
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '1') {
                e.preventDefault();
                const tccCard = document.querySelector('.project-tcc');
                const tccBtn = tccCard?.querySelector('.btn-projeto');
                if (tccBtn && !tccBtn.disabled && tccBtn.href && tccBtn.href !== '#') {
                    window.open(tccBtn.href, '_blank');
                }
            }
            if (e.ctrlKey && e.key === '2') {
                e.preventDefault();
                const mesozoicoBtn = document.querySelector('.project-mesozoico .btn-projeto');
                if (mesozoicoBtn && mesozoicoBtn.href && mesozoicoBtn.href !== '#') {
                    window.open(mesozoicoBtn.href, '_blank');
                }
            }
        });
    }
}

/* ========== TEMA DARK/LIGHT ========== */
class ThemeManager {
    constructor() {
        this.html = document.documentElement;
        this.toggleBtn = null;
        this.currentTheme = this.getStoredTheme();
        this.init();
    }

    init() {
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
        this.setupListeners();
        this.setupKeyboardShortcut();
    }

    getStoredTheme() {
        try {
            const stored = localStorage.getItem('theme');
            if (stored && (stored === 'dark' || stored === 'light')) return stored;
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
            return 'light';
        } catch (e) {
            console.warn('Erro ao acessar localStorage:', e);
            return 'light';
        }
    }

    createThemeToggle() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-selector-container';
        toggleContainer.innerHTML = `
            <div class="theme-selector">
                <button id="theme-toggle" class="theme-btn active" aria-label="Alternar tema" title="Pressione 'T' ou clique">
                    <span class="theme-icon">🌙</span>
                    <span class="theme-label">Tema</span>
                </button>
            </div>
        `;
        document.body.appendChild(toggleContainer);
        this.toggleBtn = document.getElementById('theme-toggle');
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        this.html.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Erro ao salvar tema:', e);
        }
        if (this.toggleBtn) {
            this.toggleBtn.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    setupListeners() {
        this.toggleBtn?.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
        });

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const activeTag = document.activeElement.tagName;
                if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA' && activeTag !== 'SELECT') {
                    e.preventDefault();
                    this.toggle();
                }
            }
        });
    }

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

/* ========== SUMINAGASHI ========== */
const suminagashiConfig = [
    {
        canvasId: 'suminagashiCanvas1',
        colorR: 230, colorG: 57, colorB: 70,
        opacity: 0.06, speed: 0.0001
    },
    {
        canvasId: 'suminagashiCanvas2',
        colorR: 90, colorG: 155, colorB: 109,
        opacity: 0.04, speed: 0.00008
    },
    {
        canvasId: 'suminagashiCanvas3',
        colorR: 212, colorG: 165, colorB: 116,
        opacity: 0.05, speed: 0.00006
    }
];

class SuminagashiLayer {
    constructor(config) {
        this.canvas = document.getElementById(config.canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('❌ Context 2D falhou para:', config.canvasId);
            return;
        }
        
        this.config = config;
        this.time = Math.random() * 1000;
        this.animationFrame = null;
        this.isAnimating = false;
        this.resize();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (!this.canvas || !this.ctx) return;
        
        const { ctx, canvas, config, time } = this;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(251, 248, 243, 0.01)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(${config.colorR}, ${config.colorG}, ${config.colorB}, 0.04)`;
        
        for (let i = 0; i < 5; i++) {
            const x = (Math.sin(time * config.speed + i * 2) + 1) * canvas.width / 2;
            const y = (Math.cos(time * config.speed * 0.8 + i * 2) + 1) * canvas.height / 2;
            const radius = 100 + Math.sin(time * config.speed * 0.5 + i) * 80;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = `rgba(${config.colorR}, ${config.colorG}, ${config.colorB}, 0.02)`;
        for (let i = 0; i < 3; i++) {
            const x = (Math.cos(time * config.speed * 0.7 + i * 3) + 1) * canvas.width / 2;
            const y = (Math.sin(time * config.speed * 0.9 + i * 3) + 1) * canvas.height / 2;
            const radius = 150 + Math.cos(time * config.speed * 0.3 + i) * 100;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        this.time++;
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (!this.isAnimating && this.canvas) {
            this.isAnimating = true;
            this.animate();
        }
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.isAnimating = false;
        }
    }
}

const suminagashiLayers = [];

function initSuminagashi() {
    suminagashiConfig.forEach(config => {
        const layer = new SuminagashiLayer(config);
        if (layer.canvas) {
            suminagashiLayers.push(layer);
            layer.start();
        }
    });
}

function handleWindowResize() {
    suminagashiLayers.forEach(layer => layer.resize());
}

const debouncedResize = debounce(handleWindowResize, 150);
window.addEventListener('resize', debouncedResize);

/* ========== NAVEGAÇÃO ========== */
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

class NavbarManager {
    constructor() {
        this.isMenuOpen = false;
        this.throttledScroll = throttle(() => this.handleScroll(), 50);
        this.init();
    }

    init() {
        if (!navbar) return;
        
        window.addEventListener('scroll', this.throttledScroll);
        hamburger?.addEventListener('click', (e) => this.toggleMenu(e));
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });

        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !navbar.contains(e.target)) {
                this.closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    handleScroll() {
        if (!navbar) return;
        
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        this.updateActiveSection();
    }

    toggleMenu(e) {
        e?.stopPropagation();
        this.isMenuOpen = !this.isMenuOpen;
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', this.isMenuOpen);
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }

    handleNavClick(e, link) {
        e.preventDefault();
        
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        this.closeMenu();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 0) {
                currentSection = section.id;
            }
        });
        
        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    }
}

/* ========== INTERSECTION OBSERVER ========== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.animation = 'none';
            
            if (entry.target.classList.contains('stat-number')) {
                startCounter(entry.target);
                entry.target.dataset.counted = 'true';
            }
        }
    });
}, observerOptions);

function initObserver() {
    const elementsToObserve = document.querySelectorAll(
        '.projeto-card, .contato-card, .formacao-card, .timeline-item, .stat-number'
    );
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/* ========== CONTADOR DE ESTATÍSTICAS ========== */
function startCounter(element) {
    if (element.dataset.counted) return;
    element.dataset.counted = 'true';
    
    const target = parseInt(element.dataset.count);
    if (isNaN(target)) return;
    
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ========== PARALLAX ========== */
class ParallaxElement {
    constructor(selector, speed = 0.5) {
        this.element = document.querySelector(selector);
        this.speed = speed;
        this.lastScrollY = 0;
    }

    update() {
        if (!this.element) return;
        const scrolled = window.pageYOffset;
        if (Math.abs(scrolled - this.lastScrollY) > 5) {
            this.element.style.transform = `translateY(${scrolled * this.speed}px)`;
            this.lastScrollY = scrolled;
        }
    }
}

const heroParallax = new ParallaxElement('.hero', 0.3);
const aboutParallax = new ParallaxElement('.sobre', 0.2);

const throttledParallax = throttle(() => {
    heroParallax.update();
    aboutParallax.update();
}, 10);

document.addEventListener('scroll', throttledParallax);

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========== LAZY LOADING ESCALONADO ========== */
function initStaggeredAnimations() {
    document.querySelectorAll('.animate-pop, .animate-slide-up').forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

/* ========== RIPPLE EFFECT ========== */
class RippleEffect {
    constructor() {
        this.init();
    }

    init() {
        const contatoCards = document.querySelectorAll('.contato-card, .btn-primary, .btn-secondary');
        contatoCards.forEach(card => {
            card.addEventListener('click', (e) => this.createRipple(e, card));
        });
    }

    createRipple(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple-animation 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
}

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        0% { width: 10px; height: 10px; opacity: 1; }
        100% { width: 300px; height: 300px; opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

/* ========== CARD HOVER EFFECT ========== */
class CardHoverEffect {
    constructor() {
        this.projectCards = document.querySelectorAll('.projeto-card');
        this.isDesktop = window.innerWidth > 1024;
        this.init();
        
        window.addEventListener('resize', debounce(() => {
            this.isDesktop = window.innerWidth > 1024;
        }, 150));
    }

    init() {
        if (this.projectCards.length === 0) return;
        
        this.projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        const gradient = `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(255,255,255,0.15) 0%, transparent 80%)`;
        const image = card.querySelector('.projeto-image');
        
        if (image) {
            image.style.backgroundImage = gradient;
            
            if (this.isDesktop) {
                const xRotate = (yPercent - 50) * 0.03;
                const yRotate = (xPercent - 50) * 0.03;
                card.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg)`;
            }
        }
    }

    handleMouseLeave(e, card) {
        const image = card.querySelector('.projeto-image');
        if (image) {
            image.style.backgroundImage = '';
        }
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
}

/* ========== BOTÃO VOLTAR AO TOPO ========== */
class ScrollToTop {
    constructor() {
        this.createButton();
        this.isVisible = false;
        this.init();
    }

    createButton() {
        const button = document.createElement('button');
        button.id = 'scroll-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Voltar ao topo');
        button.setAttribute('title', 'Voltar ao topo (ou pressione Home)');
        document.body.appendChild(button);
        this.button = button;
    }

    init() {
        if (!this.button) return;
        
        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', this.throttledScroll.bind(this));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    throttledScroll = throttle(() => {
        this.handleScroll();
    }, 100);

    handleScroll() {
        const shouldShow = window.pageYOffset > 300;
        if (shouldShow && !this.isVisible) {
            this.button.classList.add('visible');
            this.isVisible = true;
        } else if (!shouldShow && this.isVisible) {
            this.button.classList.remove('visible');
            this.isVisible = false;
        }
    }
}

/* ========== PRELOAD DE IMAGENS ========== */
function preloadImages() {
    // Verifica se existe uma imagem de perfil configurada
    const profileImg = document.getElementById('profile-photo');
    if (profileImg && profileImg.src) {
        // Tenta preload da imagem
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = profileImg.src;
        document.head.appendChild(link);
    }
}

/* ========== PERFORMANCE MONITORING ========== */
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                if (pageLoadTime > 0) {
                    console.log(`⏱️ Tempo de carregamento: ${pageLoadTime}ms`);
                }
            }
        });
    }
}

/* ========== ANALYTICS ========== */
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.sessionStart = new Date();
        this.init();
    }

    init() {
        document.querySelectorAll('.contato-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.trackEvent('contato_click', {
                    tipo: card.dataset.tipo,
                    href: card.href
                });
            });
        });

        document.querySelectorAll('.btn-projeto:not([disabled])').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Pega o tipo do projeto baseado na classe do card pai
                const projectCard = btn.closest('.projeto-card');
                let projectType = 'desconhecido';
                if (projectCard?.classList.contains('project-mesozoico')) {
                    projectType = 'mesozoico';
                } else if (projectCard?.classList.contains('project-tcc')) {
                    projectType = 'tcc';
                }
                
                this.trackEvent('projeto_click', {
                    projeto: projectType,
                    href: btn.href
                });
            });
        });

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackEvent('section_view', { section: entry.target.id });
                    }
                });
            }, { threshold: 0.5 });
            sectionObserver.observe(section);
        });

        window.addEventListener('themechange', (e) => {
            this.trackEvent('theme_change', { theme: e.detail.theme });
        });
    }

    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        };
        this.events.push(event);
        console.log(`📈 Evento: ${eventName}`, eventData);
    }
}

/* ========== GERENCIAMENTO DA FOTO DE PERFIL ========== */
function initProfilePhoto() {
    const profilePhoto = document.getElementById('profile-photo');
    const placeholder = document.getElementById('photo-placeholder');
    
    if (!profilePhoto || !placeholder) return;
    
    // Configura a imagem para usar um placeholder se não carregar
    profilePhoto.onload = function() {
        console.log('✅ Foto carregada com sucesso');
        placeholder.style.display = 'none';
        profilePhoto.style.display = 'block';
    };
    
    profilePhoto.onerror = function() {
        console.log('ℹ️ Usando placeholder (foto não encontrada)');
        placeholder.style.display = 'flex';
        profilePhoto.style.display = 'none';
    };
    
    // Verifica se a imagem já está carregada
    if (profilePhoto.complete && profilePhoto.naturalHeight > 0) {
        profilePhoto.onload();
    } else {
        // Se não carregar em 2 segundos, mostra placeholder
        setTimeout(() => {
            if (!profilePhoto.complete || profilePhoto.naturalHeight === 0) {
                profilePhoto.onerror();
            }
        }, 2000);
    }
}

/* ========== INICIALIZAÇÃO ========== */
let projectLinksManager;
let themeManager;
let navbarManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🌸 MURILLO LEITE • PORTFÓLIO 🌸', 'color: #E63946; font-size: 16px; font-weight: bold;');
    console.log('%c✨ Estética Japonesa + Floresta Verde de Bambu', 'color: #5A9B6D; font-size: 12px; font-style: italic;');
    
    // Inicializa todas as classes e funções
    themeManager = new ThemeManager();
    projectLinksManager = new ProjectLinksManager();
    navbarManager = new NavbarManager();
    
    initProfilePhoto();
    initSuminagashi();
    initObserver();
    initStaggeredAnimations();
    
    new RippleEffect();
    new CardHoverEffect();
    new ScrollToTop();
    new PerformanceMonitor();
    new AnalyticsTracker();
    
    preloadImages();

    console.table({
        'Links dos Projetos': '✅',
        'Suminagashi': '✅',
        'Navbar': '✅',
        'Contadores': '✅',
        'Scroll to Top': '✅',
        'Tema Dark/Light': '✅',
        'Atalhos': '✅',
        'Foto de Perfil': '✅'
    });
    
    console.log('%c⌨️ Atalhos: Ctrl+1 (TCC) | Ctrl+2 (Era Mesozoica) | T (Tema) | Home (Topo)', 'color: #7BB89C; font-size: 11px;');
});

/* ========== ERROR HANDLING ========== */
window.addEventListener('error', (e) => {
    console.error('❌ Erro:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise:', e.reason);
});
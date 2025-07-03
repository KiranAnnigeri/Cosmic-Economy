// ==========================================================================
// Cosmic Economy Website - Main JavaScript
// ==========================================================================

// Global variables
let scene, camera, renderer, stars, planets = [];
let isLoading = true;
let lenis;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize 3D scene
    init3DScene();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize GSAP animations
    initGSAPAnimations();
    
    // Initialize interactive elements
    initInteractiveElements();
    
    // Initialize charts
    initCharts();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize form handling
    initFormHandling();
    
    // Start render loop
    animate();
    
    // Hide loading screen after everything is ready
    setTimeout(hideLoadingScreen, 3000);
}

// Loading Screen
function initLoadingScreen() {
    const loadingProgress = document.querySelector('.loading-progress');
    let progress = 0;
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        loadingProgress.style.width = progress + '%';
    }, 200);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        isLoading = false;
    }, 500);
}

// 3D Scene Setup
function init3DScene() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const container = document.getElementById('three-container');
    container.appendChild(renderer.domElement);
    
    // Create starfield
    createStarfield();
    
    // Create planets
    createPlanets();
    
    // Create nebula effect
    createNebula();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i++) {
        starPositions[i] = (Math.random() - 0.5) * 2000;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: Math.random() * 2 + 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createPlanets() {
    const planetData = [
        { radius: 0.8, color: 0x00d4ff, position: [-15, 5, -10], speed: 0.01 },
        { radius: 1.2, color: 0xff6b6b, position: [15, -5, -15], speed: 0.008 },
        { radius: 0.6, color: 0xffd700, position: [-8, -8, -5], speed: 0.012 },
        { radius: 1.0, color: 0x8a2be2, position: [12, 8, -8], speed: 0.009 }
    ];
    
    planetData.forEach((data, index) => {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        
        // Create planet material with glow effect
        const material = new THREE.MeshPhongMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.1,
            shininess: 100
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.set(...data.position);
        planet.userData = { speed: data.speed, originalY: data.position[1] };
        
        // Add atmosphere glow
        const glowGeometry = new THREE.SphereGeometry(data.radius * 1.2, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: "f", value: 0.3 },
                p: { type: "f", value: 1.4 },
                glowColor: { type: "c", value: new THREE.Color(data.color) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize( normalMatrix * normal );
                    vec3 vNormel = normalize( normalMatrix * viewVector );
                    intensity = pow( c - dot(vNormal, vNormel), p );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4( glow, 1.0 );
                }
            `,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        planet.add(glow);
        
        planets.push(planet);
        scene.add(planet);
    });
}

function createNebula() {
    const nebulaGeometry = new THREE.PlaneGeometry(100, 100);
    const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x00d4ff) },
            color2: { value: new THREE.Color(0xff6b6b) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }
            
            void main() {
                vec2 p = vUv * 8.0 + time * 0.1;
                float n = noise(p) * 0.5 + noise(p * 2.0) * 0.25 + noise(p * 4.0) * 0.125;
                vec3 color = mix(color1, color2, n);
                gl_FragColor = vec4(color, n * 0.3);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.z = -50;
    scene.add(nebula);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (!isLoading) {
        // Rotate stars
        if (stars) {
            stars.rotation.x += 0.0005;
            stars.rotation.y += 0.0002;
        }
        
        // Animate planets
        planets.forEach((planet, index) => {
            planet.rotation.y += planet.userData.speed;
            planet.rotation.x += planet.userData.speed * 0.5;
            
            // Floating animation
            planet.position.y = planet.userData.originalY + Math.sin(Date.now() * 0.001 + index) * 2;
        });
        
        // Update nebula time
        const nebula = scene.children.find(child => child.material && child.material.uniforms && child.material.uniforms.time);
        if (nebula) {
            nebula.material.uniforms.time.value = Date.now() * 0.001;
        }
        
        // Mouse parallax effect
        const mouseX = (window.innerWidth / 2 - window.mouseX) * 0.0001;
        const mouseY = (window.innerHeight / 2 - window.mouseY) * 0.0001;
        
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (mouseY - camera.position.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

// Mouse tracking for parallax
window.addEventListener('mousemove', (event) => {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
});

// Smooth Scrolling with Lenis
function initSmoothScrolling() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
}

// GSAP Animations
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.timeline({ delay: 3.5 })
        .from('.hero-title .title-line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .from('.hero-description', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.hero-buttons .btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        }, '-=0.2')
        .from('.scroll-indicator', {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.1');
    
    // Market cards animation
    gsap.from('.market-card', {
        scrollTrigger: {
            trigger: '.markets-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Planet items animation
    gsap.from('.planet-item', {
        scrollTrigger: {
            trigger: '.planets-container',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'back.out(1.7)'
    });
    
    // Trading panel animation
    gsap.from('.trading-panel', {
        scrollTrigger: {
            trigger: '.trading-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Contact form animation
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.contact-info .info-item', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Number counter animation
    gsap.utils.toArray('.stat-value[data-target]').forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        
        ScrollTrigger.create({
            trigger: element,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(element, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out',
                    onUpdate: function() {
                        element.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString();
                    }
                });
            }
        });
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Market card interactions
    document.querySelectorAll('.market-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Planet hover effects
    document.querySelectorAll('.planet-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const sphere = this.querySelector('.planet-sphere');
            gsap.to(sphere, {
                scale: 1.1,
                rotationY: 360,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', function() {
            const sphere = this.querySelector('.planet-sphere');
            gsap.to(sphere, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Explore button click effect
    document.getElementById('explore-btn').addEventListener('click', function() {
        // Create particle explosion effect
        createParticleExplosion(this);
        
        // Smooth scroll to markets section
        lenis.scrollTo('#markets', { duration: 2 });
    });
    
    // Learn more button click effect
    document.getElementById('learn-btn').addEventListener('click', function() {
        lenis.scrollTo('#planets', { duration: 2 });
    });
}

function createParticleExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00d4ff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = '0 0 10px #00d4ff';
        
        document.body.appendChild(particle);
        
        const angle = (i / 20) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        gsap.to(particle, {
            x: x,
            y: y,
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                particle.remove();
            }
        });
    }
}

// Chart Rendering
function initCharts() {
    // Render market charts
    document.querySelectorAll('.chart-canvas').forEach(canvas => {
        renderChart(canvas);
    });
    
    // Render main trading chart
    const mainChart = document.getElementById('main-chart');
    if (mainChart) {
        renderTradingChart(mainChart);
    }
}

function renderChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Generate random data points
    const dataPoints = 20;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
        data.push(Math.random() * 0.8 + 0.1);
    }
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw chart line
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const x = (width / (data.length - 1)) * i;
        const y = height - (data[i] * height);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Draw glow effect
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Draw data points
    ctx.fillStyle = '#00d4ff';
    for (let i = 0; i < data.length; i++) {
        const x = (width / (data.length - 1)) * i;
        const y = height - (data[i] * height);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function renderTradingChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Generate candlestick data
    const candleCount = 50;
    const candleWidth = width / candleCount;
    let price = 100;
    
    for (let i = 0; i < candleCount; i++) {
        const change = (Math.random() - 0.5) * 10;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;
        
        const x = i * candleWidth + candleWidth / 2;
        const isGreen = close > open;
        
        // Draw candlestick
        ctx.strokeStyle = isGreen ? '#4ade80' : '#f87171';
        ctx.fillStyle = isGreen ? '#4ade80' : '#f87171';
        ctx.lineWidth = 1;
        
        // High-low line
        ctx.beginPath();
        ctx.moveTo(x, (1 - high / 150) * height);
        ctx.lineTo(x, (1 - low / 150) * height);
        ctx.stroke();
        
        // Body
        const bodyTop = (1 - Math.max(open, close) / 150) * height;
        const bodyHeight = Math.abs((close - open) / 150) * height;
        
        ctx.fillRect(x - candleWidth / 4, bodyTop, candleWidth / 2, bodyHeight);
        
        price = close;
    }
}

// Navigation
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { duration: 1.5 });
            }
        });
    });
    
    // Update active navigation item on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Form Handling
function initFormHandling() {
    const form = document.getElementById('cosmic-form');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Enhanced form interactions
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        const border = group.querySelector('.form-border');
        
        input.addEventListener('focus', () => {
            gsap.to(border, {
                width: '100%',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(label, {
                y: -20,
                scale: 0.8,
                color: '#00d4ff',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                gsap.to(border, {
                    width: '0%',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(label, {
                    y: 0,
                    scale: 1,
                    color: '#b0b0b0',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Create success animation
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        
        // Loading state
        submitBtn.querySelector('span').textContent = 'Transmitting...';
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.querySelector('span').textContent = 'Message Sent! 🚀';
            
            // Success particle effect
            createSuccessParticles(submitBtn);
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                submitBtn.querySelector('span').textContent = originalText;
                
                // Reset form labels
                formGroups.forEach(group => {
                    const label = group.querySelector('label');
                    const border = group.querySelector('.form-border');
                    
                    gsap.to(label, {
                        y: 0,
                        scale: 1,
                        color: '#b0b0b0',
                        duration: 0.3
                    });
                    
                    gsap.to(border, {
                        width: '0%',
                        duration: 0.3
                    });
                });
            }, 3000);
        }, 2000);
    });
}

function createSuccessParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = '#4ade80';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = '0 0 10px #4ade80';
        
        document.body.appendChild(particle);
        
        const angle = (i / 15) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        gsap.to(particle, {
            x: x,
            y: y,
            opacity: 0,
            scale: 0,
            duration: 1.2,
            ease: 'power2.out',
            delay: Math.random() * 0.3,
            onComplete: () => {
                particle.remove();
            }
        });
    }
}

// Performance optimization
function optimizePerformance() {
    // Reduce animation complexity on mobile
    if (window.innerWidth < 768) {
        // Reduce star count
        if (stars && stars.geometry) {
            const positions = stars.geometry.attributes.position.array;
            const reducedPositions = new Float32Array(positions.length / 2);
            for (let i = 0; i < reducedPositions.length; i++) {
                reducedPositions[i] = positions[i * 2];
            }
            stars.geometry.setAttribute('position', new THREE.BufferAttribute(reducedPositions, 3));
        }
        
        // Reduce planet count
        planets = planets.slice(0, 2);
    }
    
    // Intersection Observer for lazy animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.market-card, .planet-item, .info-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize performance optimizations
setTimeout(optimizePerformance, 1000);

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        renderer.setAnimationLoop(null);
    } else {
        // Resume animations when page becomes visible
        renderer.setAnimationLoop(animate);
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        createParticleExplosion,
        renderChart
    };
}
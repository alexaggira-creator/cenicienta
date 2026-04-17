/* ══════════════════════════════════════════════════════
   LÓGICA DE LA INVITACIÓN - MARIANA
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Referencias de Elementos ---
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('intro-video');
    const invitation = document.getElementById('invitation');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const openingVideo = document.getElementById('opening-video');

    // --- Manejo del Intro (Video 1) ---
    const startInvitation = () => {
        // Ejecutar salida de intro
        introScreen.classList.add('fade-out');
        invitation.classList.remove('hidden');
        
        // Iniciar música
        bgMusic.play().catch(e => console.log("Autoplay bloqueado, el usuario debe interactuar"));
        musicBtn.classList.add('playing');
        
        // Pequeño timeout para remover el intro del DOM
        setTimeout(() => {
            introScreen.style.display = 'none';
            // Iniciar animaciones de revelación al hacer scroll
            initScrollReveal();
            // Iniciar partículas
            initParticles();
        }, 1000);
    };

    introScreen.addEventListener('click', () => {
        // Desmutear para que se escuche el primer video
        introVideo.muted = false;
        
        introVideo.play().then(() => {
            // El video está reproduciéndose con sonido
            // Esperamos a que el usuario vea un poco del video o entramos de una vez
            // Si quieres que el video 1 se vea completo antes de entrar, 
            // usaría introVideo.onended = startInvitation;
            // Pero por ahora, entramos al hacer click para no aburrir al invitado.
            startInvitation();
        }).catch((err) => {
            console.log("Error al reproducir video:", err);
            startInvitation();
        });
    });

    // --- Control de Música ---
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.classList.add('playing');
            musicBtn.innerText = '♪';
        } else {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.innerText = 'II';
        }
    });

    // --- Cuenta Regresiva ---
    const eventDate = new Date('October 24, 2026 18:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('cd-days').innerText = days.toString().padStart(2, '0');
        document.getElementById('cd-hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('cd-mins').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('cd-secs').innerText = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(timerInterval);
            document.querySelector('.countdown-grid').innerHTML = "<p style='color: var(--gold); font-size: 24px; font-family: var(--font-title);'>¡LLEGÓ EL DÍA!</p>";
        }
    };

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Scroll Reveal ---
    const initScrollReveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        
        const revealOnScroll = () => {
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 100;
                
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add('visible');
                }
            }
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Ejecutar inicial por si hay elementos visibles
    };

    // --- Formulario RSVP (WhatsApp) ---
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('rsvp-name').value;
        const guests = document.getElementById('rsvp-guests').value;
        const attending = document.querySelector('input[name="attending"]:checked').value;
        
        const phone = "573000000000"; // CAMBIAR POR EL NÚMERO REAL
        const text = attending === 'yes' 
            ? `¡Hola! Confirmo mi asistencia a los 15 de Mariana. Mi nombre es ${name} e iré con ${guests} invitado(s). 🎉`
            : `Hola, lamento informar que no podré asistir a los 15 de Mariana. Saludos de parte de ${name}.`;
        
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
    });

    // --- Sistema de Partículas (Background Estrellado/Brillante) ---
    const initParticles = () => {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        animate();
    };

});

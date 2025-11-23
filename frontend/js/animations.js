// Canvas-based interactive animated background
// Features: particle system, connecting lines, mouse interaction, soft nebula blobs
(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // Respect reduced motion

    let canvas, ctx;
    let w = 0, h = 0, dpr = 1;
    let particles = [];
    let animationId = null;
    let mouse = { x: null, y: null, vx: 0, vy: 0, down: false };
    let config = {
        maxParticles: 120,
        particleMin: 1.5,
        particleMax: 4.5,
        lineDistance: 110,
        nebulaBlobs: 3
    };

    function createCanvas() {
        if (document.querySelector('.animated-canvas')) return;
        canvas = document.createElement('canvas');
        canvas.className = 'animated-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(canvas, document.body.firstChild);
        ctx = canvas.getContext('2d');
    }

    function resize() {
        if (!canvas) return;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth = window.innerWidth;
        h = canvas.clientHeight = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParticles();
    }

    function random(min, max) { return Math.random() * (max - min) + min; }

    function initParticles() {
        particles = [];
        const areaFactor = (w * h) / 8000; // scale by viewport
        const count = Math.max(10, Math.min(config.maxParticles, Math.floor(areaFactor)));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: random(-0.3, 0.3),
                vy: random(-0.3, 0.3),
                size: random(config.particleMin, config.particleMax),
                hue: Math.floor(random(180, 320)),
                alpha: random(0.4, 1)
            });
        }
    }

    function drawNebula() {
        // Soft layered radial circles to create nebula-like glow
        const grdCanvas = document.createElement('canvas');
        grdCanvas.width = Math.max(256, w * 0.4);
        grdCanvas.height = grdCanvas.width;
        const gctx = grdCanvas.getContext('2d');
        const cx = grdCanvas.width / 2;
        const cy = grdCanvas.height / 2;

        for (let b = 0; b < config.nebulaBlobs; b++) {
            const radius = grdCanvas.width * random(0.25, 0.6);
            const hue = Math.floor(random(200, 320));
            const sat = Math.floor(random(60, 85));
            const light = Math.floor(random(45, 65));
            const alpha = random(0.06, 0.18);
            const grd = gctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
            grd.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`);
            grd.addColorStop(1, 'rgba(0,0,0,0)');
            gctx.globalCompositeOperation = 'lighter';
            gctx.fillStyle = grd;
            const offsetX = grdCanvas.width * random(-0.6, 0.6);
            const offsetY = grdCanvas.height * random(-0.6, 0.6);
            gctx.beginPath();
            gctx.arc(cx + offsetX, cy + offsetY, radius, 0, Math.PI * 2);
            gctx.fill();
        }

        // Draw the nebula layers on main canvas subtly
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 2; i++) {
            const sx = random(-w * 0.2, w * 0.2);
            const sy = random(-h * 0.2, h * 0.2);
            const scale = random(0.7, 1.5);
            const tw = grdCanvas.width * scale;
            const th = grdCanvas.height * scale;
            ctx.drawImage(grdCanvas, sx, sy, tw, th);
        }
        ctx.restore();
    }

    function drawParticles() {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let p of particles) {
            // motion
            p.x += p.vx;
            p.y += p.vy;

            // wrap
            if (p.x > w + 20) p.x = -20;
            if (p.x < -20) p.x = w + 20;
            if (p.y > h + 20) p.y = -20;
            if (p.y < -20) p.y = h + 20;

            // interaction with mouse
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 160;
                    p.vx += (dx / dist) * force * 0.15;
                    p.vy += (dy / dist) * force * 0.15;
                }
            }

            // slow down velocities
            p.vx *= 0.995;
            p.vy *= 0.995;

            // draw glow circle
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
            gradient.addColorStop(0, `hsla(${p.hue}, 95%, 65%, ${p.alpha})`);
            gradient.addColorStop(0.2, `hsla(${p.hue}, 90%, 55%, ${p.alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
            ctx.fill();

            // small core
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.alpha})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawConnections() {
        ctx.save();
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < config.lineDistance) {
                    const alpha = (1 - dist / config.lineDistance) * 0.25;
                    ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 90%, 60%, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }

    function step() {
        ctx.clearRect(0, 0, w, h);
        // subtle background tint to preserve contrast
        ctx.fillStyle = 'rgba(8,10,20,0.18)';
        ctx.fillRect(0, 0, w, h);

        // Nebula (drawn every frame but low alpha to animate subtle changes)
        drawNebula();
        drawParticles();
        drawConnections();

        animationId = requestAnimationFrame(step);
    }

    function onPointerMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        if (clientX == null) return;
        if (mouse.x !== null) {
            mouse.vx = (clientX - mouse.x) * 0.1;
            mouse.vy = (clientY - mouse.y) * 0.1;
        }
        mouse.x = clientX;
        mouse.y = clientY;
    }

    function clearMouse() {
        mouse.x = null;
        mouse.y = null;
    }

    function visibilityChange() {
        if (document.hidden) {
            if (animationId) cancelAnimationFrame(animationId);
        } else {
            animationId = requestAnimationFrame(step);
        }
    }

    function start() {
        createCanvas();
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onPointerMove, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', clearMouse, { passive: true });
        window.addEventListener('mouseout', clearMouse, { passive: true });
        document.addEventListener('visibilitychange', visibilityChange);
        animationId = requestAnimationFrame(step);

        // pause animation when user minimizes or switches tabs
        if (document.hidden) cancelAnimationFrame(animationId);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        try {
            // add animated-bg class for CSS pseudo layers
            document.body.classList.add('animated-bg');
            start();
        } catch (err) {
            console.error('Animated background error:', err);
        }
    });

})();
